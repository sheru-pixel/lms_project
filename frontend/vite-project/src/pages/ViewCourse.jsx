import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiLock, FiStar, FiUsers, FiClock, FiGlobe } from 'react-icons/fi'

// Demo course data
const DEMO_COURSE = {
  _id: '694cdb536eeea1434d0b86b3',
  title: 'Complete HTML & Web Development Masterclass',
  description: 'Master HTML from beginner to advanced level. Learn semantic HTML5, accessibility standards, best practices, and real-world project development.',
  thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
  price: 199,
  originalPrice: 599,
  rating: 4.8,
  reviews: 2450,
  videoHours: '12+ hours',
  instructor: 'John Anderson',
  instructorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  category: 'Web Development',
  level: 'Beginner to Intermediate',
  students: 15420,
  language: 'English',
  lastUpdated: '2024'
}

const DEMO_REVIEWS = [
  {
    _id: '1',
    userName: 'Sarah Johnson',
    userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rating: 5,
    date: '2024-01-15',
    title: 'Excellent course!',
    comment: 'John is an amazing instructor! The course is well-structured and easy to follow. I learned so much in just a few weeks.'
  },
  {
    _id: '2',
    userName: 'Michael Chen',
    userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 4,
    date: '2024-01-10',
    title: 'Great content, very helpful',
    comment: 'The projects really helped me understand the concepts better. Only wish there were more advanced topics covered.'
  }
]

const DEMO_LECTURES = [
  {
    _id: '1',
    title: 'Welcome to HTML & Getting Started',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    isPreviewfree: true,
    duration: '12 mins',
    courseId: '694cdb536eeea1434d0b86b3',
    description: 'Introduction and course overview'
  },
  {
    _id: '2',
    title: 'HTML Document Structure & Tags',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4',
    isPreviewfree: true,
    duration: '28 mins',
    courseId: '694cdb536eeea1434d0b86b3',
    description: 'Learn HTML tags and document structure'
  },
  {
    _id: '3',
    title: 'Working with Text and Semantic HTML',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
    isPreviewfree: false,
    duration: '35 mins',
    courseId: '694cdb536eeea1434d0b86b3',
    description: 'Advanced text formatting'
  },
  {
    _id: '4',
    title: 'Creating Forms & Input Elements',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4',
    isPreviewfree: false,
    duration: '42 mins',
    courseId: '694cdb536eeea1434d0b86b3',
    description: 'Build professional forms'
  },
  {
    _id: '5',
    title: 'Images, Links & Navigation',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4',
    isPreviewfree: true,
    duration: '31 mins',
    courseId: '694cdb536eeea1434d0b86b3',
    description: 'Working with images and creating navigation menus'
  },
  {
    _id: '6',
    title: 'CSS Basics & Styling',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
    isPreviewfree: false,
    duration: '38 mins',
    courseId: '694cdb536eeea1434d0b86b3',
    description: 'Introduction to CSS styling and selectors'
  },
  {
    _id: '7',
    title: 'Responsive Design Fundamentals',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4',
    isPreviewfree: false,
    duration: '44 mins',
    courseId: '694cdb536eeea1434d0b86b3',
    description: 'Creating responsive layouts with media queries'
  },
  {
    _id: '8',
    title: 'Flexbox Layout System',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4',
    isPreviewfree: true,
    duration: '36 mins',
    courseId: '694cdb536eeea1434d0b86b3',
    description: 'Master Flexbox for flexible layouts'
  },
  {
    _id: '9',
    title: 'Grid Layout Mastery',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
    isPreviewfree: false,
    duration: '40 mins',
    courseId: '694cdb536eeea1434d0b86b3',
    description: 'Learn CSS Grid for complex layouts'
  },
  {
    _id: '10',
    title: 'JavaScript Fundamentals',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4',
    isPreviewfree: false,
    duration: '45 mins',
    courseId: '694cdb536eeea1434d0b86b3',
    description: 'Getting started with JavaScript basics'
  },
  {
    _id: '11',
    title: 'DOM Manipulation & Events',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4',
    isPreviewfree: true,
    duration: '39 mins',
    courseId: '694cdb536eeea1434d0b86b3',
    description: 'Interact with DOM and handle events'
  },
  {
    _id: '12',
    title: 'Project: Build a Portfolio Website',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
    isPreviewfree: false,
    duration: '52 mins',
    courseId: '694cdb536eeea1434d0b86b3',
    description: 'Complete real-world portfolio project'
  }
]

function ViewCourse() {
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLectureId, setSelectedLectureId] = useState(null)
  const [error, setError] = useState('')

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true)
      // Using demo data temporarily
      setCourse(DEMO_COURSE)
      setLectures(DEMO_LECTURES)
      setSelectedLectureId(DEMO_LECTURES[0]._id)
      setError('')
    } catch (err) {
      setError('Failed to load course')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCourseData()
  }, [fetchCourseData])

  const selectedLecture = lectures.find(l => l._id === selectedLectureId)

  const styles = {
    container: {
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f7f9fa',
      fontFamily: "'Segoe UI', 'Poppins', sans-serif"
    },
    header: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e8e8e8',
      padding: '16px 0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
    },
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      color: '#1a1a1a',
      padding: '8px 0',
      transition: 'color 0.2s'
    },
    breadcrumb: {
      fontSize: '13px',
      color: '#888'
    },
    mainContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '40px 20px'
    },
    courseHero: {
      backgroundColor: 'white',
      borderRadius: '8px',
      marginBottom: '40px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      overflow: 'hidden'
    },
    heroGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px',
      padding: '40px',
      gridTemplateRows: 'auto auto'
    },
    thumbnail: {
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#e0e0e0',
      aspectRatio: '16/9',
      boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
    },
    whatYouLearn: {
      marginTop: '20px',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      border: '1px solid #e8e8e8'
    },
    whatYouLearnTitle: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#1a1a1a',
      margin: '0 0 12px 0'
    },
    whatYouLearnList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    whatYouLearnItem: {
      fontSize: '13px',
      color: '#555',
      display: 'flex',
      gap: '8px',
      alignItems: 'flex-start'
    },
    thumbnailImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    courseInfo: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start'
    },
    courseTitle: {
      fontSize: '36px',
      fontWeight: '700',
      color: '#1a1a1a',
      margin: '0 0 16px 0',
      lineHeight: '1.2'
    },
    courseDescription: {
      fontSize: '16px',
      color: '#555',
      lineHeight: '1.6',
      margin: '0 0 24px 0'
    },
    ratingSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px'
    },
    ratingStars: {
      display: 'flex',
      gap: '3px',
      alignItems: 'center'
    },
    ratingText: {
      fontSize: '14px',
      color: '#666'
    },
    metaGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
      paddingTop: '24px',
      borderTop: '1px solid #e8e8e8'
    },
    metaItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    metaLabel: {
      fontSize: '12px',
      color: '#888',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    metaValue: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1a1a1a'
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: '420px 1fr',
      gap: '20px'
    },
    curriculumSection: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      height: '600px',
      overflowY: 'auto',
      scrollBehavior: 'smooth'
    },
    curriculumTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1a1a1a',
      margin: '0 0 8px 0'
    },
    lectureCount: {
      fontSize: '13px',
      color: '#888',
      margin: '0 0 16px 0'
    },
    lecturesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    lectureItem: {
      padding: '12px',
      backgroundColor: '#f9f9f9',
      border: '2px solid transparent',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      minHeight: '100px'
    },
    lectureItemActive: {
      backgroundColor: '#f0f0f0',
      borderColor: '#1a1a1a'
    },
    lectureNumber: {
      fontSize: '11px',
      fontWeight: '700',
      color: '#888',
      minWidth: '20px'
    },
    lectureTitle: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#1a1a1a',
      margin: '0 0 4px 0'
    },
    lectureMeta: {
      fontSize: '12px',
      color: '#888'
    },
    lectureBadge: {
      fontSize: '10px',
      fontWeight: '700',
      padding: '2px 6px',
      borderRadius: '2px',
      display: 'inline-block',
      marginTop: '4px'
    },
    freeBadge: {
      backgroundColor: '#e8f5e9',
      color: '#2e7d32'
    },
    videoSection: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      height: '600px',
      display: 'flex',
      flexDirection: 'column'
    },
    videoPlayer: {
      backgroundColor: '#000',
      borderRadius: '6px',
      overflow: 'hidden',
      aspectRatio: '16/9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      marginBottom: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      flex: 1,
      height: 'auto'
    },
    videoElement: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    lockOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      zIndex: 10
    },
    lockTitle: {
      color: 'white',
      fontSize: '16px',
      fontWeight: '600',
      margin: 0
    },
    lockText: {
      color: '#ccc',
      fontSize: '12px',
      margin: 0,
      textAlign: 'center'
    },
    lectureDetails: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: '16px',
      gap: '12px'
    },
    lectureDetailsTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1a1a1a',
      margin: '0 0 4px 0'
    },
    lectureDuration: {
      fontSize: '13px',
      color: '#888',
      margin: 0
    },
    statusBadge: {
      fontSize: '10px',
      fontWeight: '700',
      padding: '4px 8px',
      borderRadius: '3px',
      whiteSpace: 'nowrap'
    },
    statusInfo: {
      padding: '12px',
      borderRadius: '6px',
      marginBottom: '12px'
    },
    statusInfoFree: {
      backgroundColor: '#e8f5e9',
      border: '1px solid #c8e6c9',
      color: '#2e7d32',
      fontSize: '12px'
    },
    statusInfoLocked: {
      backgroundColor: '#ffebee',
      border: '1px solid #ffcdd2',
      color: '#c33',
      fontSize: '12px'
    },
    reviewsSection: {
      marginTop: '40px',
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '40px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    reviewsTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1a1a1a',
      margin: '0 0 8px 0'
    },
    reviewsHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '32px'
    },
    reviewsRating: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1a1a1a'
    },
    reviewsStats: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    reviewsStarsSmall: {
      display: 'flex',
      gap: '3px',
      alignItems: 'center'
    },
    reviewsCount: {
      fontSize: '13px',
      color: '#888'
    },
    reviewsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      maxHeight: '500px',
      overflowY: 'auto',
      scrollBehavior: 'smooth',
      paddingRight: '8px'
    },
    reviewItem: {
      paddingBottom: '24px',
      borderBottom: '1px solid #e8e8e8'
    },
    reviewItemLast: {
      borderBottom: 'none'
    },
    reviewHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    reviewUserImage: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover'
    },
    reviewUserInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      flex: 1
    },
    reviewUserName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1a1a1a',
      margin: 0
    },
    reviewDate: {
      fontSize: '12px',
      color: '#888',
      margin: 0
    },
    reviewRating: {
      display: 'flex',
      gap: '3px',
      alignItems: 'center'
    },
    reviewTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1a1a1a',
      margin: '0 0 8px 0'
    },
    reviewComment: {
      fontSize: '13px',
      color: '#555',
      lineHeight: '1.6',
      margin: '0'
    }
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#888', fontSize: '16px' }}>Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#888', fontSize: '16px' }}>Course not found</p>
        </div>
      </div>
    )
  }

  const discountPercent = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)

  return (
    <div className="view-course-container" style={styles.container}>
      {/* Header */}
      <div className="view-course-header" style={styles.header}>
        <div className="view-course-header-content" style={styles.headerContent}>
          <button
            className="view-course-back-button"
            style={styles.backButton}
            onClick={() => navigate(-1)}
            onMouseEnter={(e) => e.target.style.color = '#888'}
            onMouseLeave={(e) => e.target.style.color = '#1a1a1a'}
          >
            <FiArrowLeft size={18} />
          </button>
          <span className="view-course-breadcrumb" style={styles.breadcrumb}>{course.category}</span>
          <span className="view-course-breadcrumb" style={styles.breadcrumb}>›</span>
          <span className="view-course-breadcrumb" style={styles.breadcrumb}>{course.title}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="view-course-main-content" style={styles.mainContent}>
        {/* Course Hero Section */}
        <div className="view-course-hero" style={styles.courseHero}>
          <div className="view-course-hero-grid" style={styles.heroGrid}>
            {/* Left: Thumbnail and What You'll Learn */}
            <div className="view-course-thumbnail-container">
              <div className="view-course-thumbnail" style={styles.thumbnail}>
                <img src={course.thumbnail} alt={course.title} style={styles.thumbnailImg} />
              </div>
              <div className="view-course-what-you-learn" style={styles.whatYouLearn}>
                <h3 className="view-course-what-you-learn-title" style={styles.whatYouLearnTitle}>What you'll learn</h3>
                <ul className="view-course-what-you-learn-list" style={styles.whatYouLearnList}>
                  <li className="view-course-what-you-learn-item" style={styles.whatYouLearnItem}>
                    <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>✓</span> Master HTML5 fundamentals
                  </li>
                  <li className="view-course-what-you-learn-item" style={styles.whatYouLearnItem}>
                    <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>✓</span> Build real-world projects
                  </li>
                  <li className="view-course-what-you-learn-item" style={styles.whatYouLearnItem}>
                    <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>✓</span> Learn best practices
                  </li>
                  <li className="view-course-what-you-learn-item" style={styles.whatYouLearnItem}>
                    <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>✓</span> Accessibility standards
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Course Info */}
            <div className="view-course-course-info" style={styles.courseInfo}>
              <h1 className="view-course-course-title" style={styles.courseTitle}>{course.title}</h1>
              <p className="view-course-description" style={styles.courseDescription}>{course.description}</p>

              {/* Rating */}
              <div className="view-course-rating-section" style={styles.ratingSection}>
                <div className="view-course-rating-stars" style={styles.ratingStars}>
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={16}
                      style={{
                        fill: i < Math.floor(course.rating) ? '#ffa500' : '#ddd',
                        color: i < Math.floor(course.rating) ? '#ffa500' : '#ddd'
                      }}
                    />
                  ))}
                </div>
                <span className="view-course-rating-text" style={styles.ratingText}>
                  {course.rating} rating • {course.reviews.toLocaleString()} reviews
                </span>
              </div>

              {/* Meta Information */}
              <div className="view-course-meta-grid" style={styles.metaGrid}>
                <div className="view-course-meta-item" style={styles.metaItem}>
                  <span className="view-course-meta-label" style={styles.metaLabel}>
                    <FiUsers size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Students
                  </span>
                  <span className="view-course-meta-value" style={styles.metaValue}>{course.students.toLocaleString()}</span>
                </div>
                <div className="view-course-meta-item" style={styles.metaItem}>
                  <span className="view-course-meta-label" style={styles.metaLabel}>
                    <FiClock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Duration
                  </span>
                  <span className="view-course-meta-value" style={styles.metaValue}>{course.videoHours}</span>
                </div>
                <div className="view-course-meta-item" style={styles.metaItem}>
                  <span className="view-course-meta-label" style={styles.metaLabel}>Instructor</span>
                  <span className="view-course-meta-value" style={styles.metaValue}>{course.instructor}</span>
                </div>
                <div className="view-course-meta-item" style={styles.metaItem}>
                  <span className="view-course-meta-label" style={styles.metaLabel}>Level</span>
                  <span className="view-course-meta-value" style={styles.metaValue}>{course.level}</span>
                </div>
                <div className="view-course-enroll-item" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  gridColumn: '1 / 3'
                }}>
                  <span className="view-course-enroll-price" style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1a1a1a'
                  }}>
                    ₹{course.price}
                  </span>
                  <button className="view-course-enroll-btn" style={{
                    padding: '10px 20px',
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#1a1a1a'}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section with Curriculum and Video */}
        <div className="view-course-content-grid" style={styles.contentGrid}>
          {/* Left: Curriculum Sidebar */}
          <div className="view-course-curriculum-section" style={styles.curriculumSection}>
            <h3 className="view-course-curriculum-title" style={styles.curriculumTitle}>Curriculum</h3>
            <p className="view-course-lecture-count" style={styles.lectureCount}>{lectures.length} lectures</p>
            <div className="view-course-lectures-list" style={styles.lecturesList}>
              {lectures.map((lecture, idx) => (
                <div
                  key={lecture._id}
                  className={`view-course-lecture-item ${selectedLectureId === lecture._id ? 'view-course-lecture-item-active' : ''}`}
                  onClick={() => setSelectedLectureId(lecture._id)}
                  style={{
                    ...styles.lectureItem,
                    ...(selectedLectureId === lecture._id ? styles.lectureItemActive : {})
                  }}
                  onMouseEnter={(e) => {
                    if (selectedLectureId !== lecture._id) {
                      e.currentTarget.style.backgroundColor = '#f0f0f0'
                      e.currentTarget.style.borderColor = '#ddd'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedLectureId !== lecture._id) {
                      e.currentTarget.style.backgroundColor = '#f9f9f9'
                      e.currentTarget.style.borderColor = 'transparent'
                    }
                  }}
                >
                  <div className="view-course-lecture-item-inner" style={{ display: 'flex', gap: '8px' }}>
                    <span className="view-course-lecture-number" style={styles.lectureNumber}>{idx + 1}</span>
                    <div className="view-course-lecture-text-content" style={{ flex: 1 }}>
                      <p className="view-course-lecture-title" style={styles.lectureTitle}>{lecture.title}</p>
                      <p className="view-course-lecture-meta" style={styles.lectureMeta}>{lecture.duration}</p>
                      {lecture.isPreviewfree && (
                        <span className="view-course-lecture-badge view-course-free-badge" style={{ ...styles.lectureBadge, ...styles.freeBadge }}>
                          FREE PREVIEW
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Video Player */}
          <div className="view-course-video-section" style={styles.videoSection}>
            {selectedLecture ? (
              <>
                {/* Video Player */}
                <div className="view-course-video-player" style={styles.videoPlayer}>
                  {selectedLecture.isPreviewfree ? (
                    <video className="view-course-video-element" controls style={styles.videoElement}>
                      <source src={selectedLecture.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="view-course-lock-overlay" style={styles.lockOverlay}>
                      <FiLock size={48} color="white" />
                      <p className="view-course-lock-title" style={styles.lockTitle}>This lecture is locked</p>
                      <p className="view-course-lock-text" style={styles.lockText}>Enroll to watch</p>
                    </div>
                  )}
                </div>

                {/* Lecture Details */}
                <div className="view-course-lecture-details" style={styles.lectureDetails}>
                  <div className="view-course-lecture-details-content">
                    <h2 className="view-course-lecture-details-title" style={styles.lectureDetailsTitle}>{selectedLecture.title}</h2>
                    <p className="view-course-lecture-duration" style={styles.lectureDuration}>{selectedLecture.duration}</p>
                  </div>
                  {selectedLecture.isPreviewfree && (
                    <span className="view-course-status-badge view-course-free-badge" style={{ ...styles.statusBadge, ...styles.freeBadge }}>FREE</span>
                  )}
                </div>

                {/* Status Message */}
                <div className={`view-course-status-info ${selectedLecture.isPreviewfree ? 'view-course-status-info-free' : 'view-course-status-info-locked'}`} style={{
                  ...styles.statusInfo,
                  ...(selectedLecture.isPreviewfree ? styles.statusInfoFree : styles.statusInfoLocked)
                }}>
                  <p style={{ margin: 0 }}>
                    {selectedLecture.isPreviewfree
                      ? '✓ You can preview this lecture'
                      : '🔒 Enroll now to access this lecture'}
                  </p>
                </div>
              </>
            ) : (
              <div className="view-course-video-placeholder" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '16/9',
                backgroundColor: '#f0f0f0',
                borderRadius: '6px',
                color: '#888'
              }}>
                <p>Select a lecture to start watching</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="view-course-reviews-section" style={styles.reviewsSection}>
          <h2 className="view-course-reviews-title" style={styles.reviewsTitle}>Student Reviews</h2>
          
          <div className="view-course-reviews-header" style={styles.reviewsHeader}>
            <div className="view-course-reviews-rating" style={styles.reviewsRating}>{course.rating}</div>
            <div className="view-course-reviews-stats" style={styles.reviewsStats}>
              <div className="view-course-reviews-stars-small" style={styles.reviewsStarsSmall}>
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    size={14}
                    style={{
                      fill: i < Math.floor(course.rating) ? '#ffa500' : '#ddd',
                      color: i < Math.floor(course.rating) ? '#ffa500' : '#ddd'
                    }}
                  />
                ))}
              </div>
              <p className="view-course-reviews-count" style={styles.reviewsCount}>{course.reviews.toLocaleString()} reviews</p>
            </div>
          </div>

          <div className="view-course-reviews-list" style={styles.reviewsList}>
            {DEMO_REVIEWS.map((review, idx) => (
              <div 
                key={review._id} 
                className="view-course-review-item" 
                style={{
                  ...styles.reviewItem,
                  ...(idx === DEMO_REVIEWS.length - 1 ? styles.reviewItemLast : {})
                }}
              >
                <div className="view-course-review-header" style={styles.reviewHeader}>
                  <img 
                    src={review.userImage} 
                    alt={review.userName} 
                    className="view-course-review-user-image"
                    style={styles.reviewUserImage}
                  />
                  <div className="view-course-review-user-info" style={styles.reviewUserInfo}>
                    <p className="view-course-review-user-name" style={styles.reviewUserName}>{review.userName}</p>
                    <p className="view-course-review-date" style={styles.reviewDate}>{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div className="view-course-review-rating" style={styles.reviewRating}>
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={14}
                        style={{
                          fill: i < review.rating ? '#ffa500' : '#ddd',
                          color: i < review.rating ? '#ffa500' : '#ddd'
                        }}
                      />
                    ))}
                  </div>
                </div>
                <h4 className="view-course-review-title" style={styles.reviewTitle}>{review.title}</h4>
                <p className="view-course-review-comment" style={styles.reviewComment}>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewCourse


