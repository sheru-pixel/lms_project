import client from "../config/claude.js";
import ChatMessage from "../model/chatModel.js";

// Send message to Gemini and get response
export const chatWithAssistant = async (req, res) => {
  try {
    const { userMessage, courseId, courseName } = req.body;
    const userId = req.userId;

    if (!userMessage || userMessage.trim() === "") {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // Build system prompt with course context
    let systemPrompt =
      "You are an AI learning assistant for an online learning platform (LMS). You help students with their studies by:";
    systemPrompt += "\n1. Explaining course concepts and topics";
    systemPrompt +=
      "\n2. Answering general knowledge questions beyond the course";
    systemPrompt +=
      "\n3. Providing learning guidance and clarifying difficult concepts";
    systemPrompt +=
      "\n4. Helping with homework and practice problems\n";

    if (courseName) {
      systemPrompt += `\nCurrent Course: ${courseName}`;
      systemPrompt +=
        "\nWhen the user asks about this course's concepts, provide relevant context and explanations.";
    }

    systemPrompt +=
      "\nAlways be helpful, encouraging, and patient. Keep explanations clear and concise.";

    // Call Gemini API
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
    const message = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
      systemInstruction: systemPrompt,
    });

    const assistantResponse = message.response.text();

    // Save chat message to database
    const chatMessage = new ChatMessage({
      userId,
      courseId: courseId || null,
      userMessage,
      assistantResponse,
      courseName: courseName || "General",
    });

    await chatMessage.save();

    return res.status(200).json({
      success: true,
      userMessage,
      assistantResponse,
      courseId,
      courseName,
    });
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error processing your message",
      error: error.message,
    });
  }
};

// Get chat history for a user
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId } = req.query;

    let query = { userId };
    if (courseId) {
      query.courseId = courseId;
    }

    const chatHistory = await ChatMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      chatHistory,
    });
  } catch (error) {
    console.error("Chat History Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching chat history",
    });
  }
};

// Clear chat history for a user
export const clearChatHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId } = req.body;

    let query = { userId };
    if (courseId) {
      query.courseId = courseId;
    }

    await ChatMessage.deleteMany(query);

    return res.status(200).json({
      success: true,
      message: "Chat history cleared",
    });
  } catch (error) {
    console.error("Clear Chat History Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error clearing chat history",
    });
  }
};
