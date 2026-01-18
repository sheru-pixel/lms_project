import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from './model/userModel.js';
import Course from './model/courseModel.js';
import Enrollment from './model/enrollmentModel.js';

// In-memory storage for community chat messages
const courseMessages = new Map(); // courseId -> array of messages

/**
 * Verify if a user has access to a course room
 * User can access if:
 * 1. They are enrolled in the course OR
 * 2. They are the educator/instructor of the course
 */
async function verifyRoomAccess(userId, courseId) {
  try {
    console.log('verifyRoomAccess - Checking access for userId:', userId, 'courseId:', courseId);

    // Check if user is the course educator
    const course = await Course.findById(courseId);
    if (course && course.educator && course.educator.toString() === userId.toString()) {
      console.log('User is course educator - access granted');
      return true;
    }

    // Check if user is enrolled in the course (using studentId field)
    const enrollment = await Enrollment.findOne({
      studentId: userId,
      courseId,
    });
    
    console.log('Enrollment query result:', enrollment ? 'Found' : 'Not found');
    if (enrollment) {
      console.log('Enrollment found - access granted');
    }
    
    return !!enrollment;
  } catch (error) {
    console.error('Error verifying room access:', error.message);
    return false;
  }
}

/**
 * Verify JWT token from socket handshake
 */
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Initialize Socket.IO server with community chat functionality
 */
export function initializeCommunityChat(io) {
  // Global error handler for Socket.IO
  io.engine.on('connection_error', (error) => {
    console.error('Connection error:', error);
  });

  io.on('connection', (socket) => {
    let userId = null;
    let userName = null;
    let userRole = null;

    // Authenticate socket connection
    socket.on('authenticate', async (data) => {
      try {
        // Try to get token from socket handshake (cookies)
        const cookieHeader = socket.handshake.headers.cookie;
        let token = null;

        // Parse cookies from header string
        if (cookieHeader) {
          const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = decodeURIComponent(value);
            return acc;
          }, {});
          token = cookies.token;
        }

        // Fallback to token from client data
        if (!token && data && data.token && data.token !== 'cookie-based') {
          token = data.token;
        }

        if (!token) {
          console.error('No token provided in cookies or data');
          socket.emit('error', { message: 'Authentication required: No token found' });
          socket.disconnect();
          return;
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        if (!decoded || !decoded.userId) {
          console.error('Token verification failed');
          socket.emit('error', { message: 'Invalid token' });
          socket.disconnect();
          return;
        }

        userId = decoded.userId;

        // Fetch user details
        try {
          const user = await User.findById(userId);
          if (!user) {
            socket.emit('error', { message: 'User not found' });
            socket.disconnect();
            return;
          }
          userName = user.name || 'User';
          console.log('✓ Socket authenticated for user:', userName, '(ID:', userId + ')');
          socket.emit('authenticated', { success: true });
        } catch (error) {
          console.error('User lookup error:', error);
          socket.emit('error', { message: 'User lookup failed' });
          socket.disconnect();
        }
      } catch (error) {
        console.error('Socket authentication error:', error.message);
        socket.emit('error', { message: 'Authentication failed: ' + error.message });
        socket.disconnect();
      }
    });

    // Join course room
    socket.on('join_room', async (data) => {
      const { courseId } = data;

      if (!userId) {
        console.error('join_room: Not authenticated');
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      if (!courseId) {
        console.error('join_room: No courseId provided');
        socket.emit('error', { message: 'No course ID provided' });
        return;
      }

      // Verify room access
      try {
        const hasAccess = await verifyRoomAccess(userId, courseId);
        if (!hasAccess) {
          console.error('join_room: User does not have access to course', courseId);
          socket.emit('error', {
            message: 'You do not have access to this course room',
          });
          return;
        }
      } catch (error) {
        console.error('join_room: Error verifying access:', error.message);
        socket.emit('error', { message: 'Error verifying access: ' + error.message });
        return;
      }

      // Check if user is educator
      try {
        const course = await Course.findById(courseId);
        userRole = course.educator.toString() === userId.toString() ? 'Instructor' : 'Student';
      } catch (error) {
        userRole = 'Student';
      }

      // Join the socket to the room
      const roomId = `course_${courseId}`;
      socket.join(roomId);
      socket.currentRoom = roomId;
      socket.courseId = courseId;

      // Initialize message history for this course if not exists
      if (!courseMessages.has(courseId)) {
        courseMessages.set(courseId, []);
      }

      // Send existing messages to newly joined user
      const messages = courseMessages.get(courseId) || [];
      socket.emit('message_history', { messages });

      // Notify others that user joined
      io.to(roomId).emit('user_joined', {
        userName,
        userRole,
        message: `${userName} joined the room`,
      });

      console.log(`✓ ${userName} (${userRole}) joined room ${roomId}`);
      socket.emit('room_joined', { success: true, courseId });
    });

    // Handle incoming messages
    socket.on('send_message', (data) => {
      const { message, courseId, tag } = data;

      if (!userId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      // Validate message
      if (!message || message.trim() === '') {
        socket.emit('error', { message: 'Message cannot be empty' });
        return;
      }

      if (message.length > 5000) {
        socket.emit('error', { message: 'Message is too long (max 5000 characters)' });
        return;
      }

      const roomId = `course_${courseId}`;

      // Verify user is in the room
      if (!socket.rooms.has(roomId)) {
        socket.emit('error', { message: 'You are not in this room' });
        return;
      }

      // Validate tag if provided
      const validTags = ['task', 'theory', 'bug', 'project', 'question'];
      const messageTag = tag && validTags.includes(tag) ? tag : null;

      // Create message object
      const messageObj = {
        id: Date.now().toString(),
        userId,
        userName,
        userRole,
        message: message.trim(),
        tag: messageTag,
        timestamp: new Date(),
        isInstructor: userRole === 'Instructor',
      };

      // Store message in memory
      const messages = courseMessages.get(courseId) || [];
      messages.push(messageObj);
      // Keep only last 100 messages per room
      if (messages.length > 100) {
        messages.shift();
      }
      courseMessages.set(courseId, messages);

      // Broadcast message to all users in the room
      io.to(roomId).emit('receive_message', messageObj);

      console.log(`✓ Message saved to course ${courseId}: ${message.substring(0, 50)}${messageTag ? ` [#${messageTag}]` : ''}...`);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      if (socket.currentRoom && userId && userName) {
        io.to(socket.currentRoom).emit('user_left', {
          userName,
          userRole,
          message: `${userName} left the room`,
        });
        console.log(`User ${userName} disconnected from ${socket.currentRoom}`);
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
}

export default initializeCommunityChat;
