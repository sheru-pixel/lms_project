import Review from "../model/reviewModel.js"
import Course from "../model/courseModel.js"
import User from "../model/userModel.js"

// Add a review to a course
export const addReview = async (req, res) => {
  try {
    const { courseId } = req.params
    const { rating, comment, title } = req.body
    const userId = req.userId

    // Validate input
    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" })
    }

    // Check if course exists
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Check if user has already reviewed this course
    const existingReview = await Review.findOne({ course: courseId, user: userId })
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this course" })
    }

    // Check if user is enrolled in the course
    const isEnrolled = course.enrolledStudents.includes(userId)
    if (!isEnrolled) {
      return res.status(403).json({ message: "You must be enrolled in this course to review it" })
    }

    // Get user details
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Create review
    const review = new Review({
      course: courseId,
      user: userId,
      userName: user.name || user.email,
      rating: parseInt(rating),
      comment,
      title: title || "",
      date: new Date()
    })

    await review.save()

    // Add review to course's reviewsList
    course.reviewsList.push(review._id)

    // Update course rating (simple average)
    const allReviews = await Review.find({ course: courseId })
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0) + parseInt(rating)
    course.rating = (totalRating / (allReviews.length + 1)).toFixed(1)
    course.reviewCount = allReviews.length + 1

    await course.save()

    return res.status(201).json({
      message: "Review added successfully",
      review,
      courseRating: course.rating,
      reviewCount: course.reviewCount
    })
  } catch (error) {
    console.error("Error adding review:", error)
    return res.status(500).json({ message: "Failed to add review", error: error.message })
  }
}

// Get all reviews for a course
export const getReviews = async (req, res) => {
  try {
    const { courseId } = req.params

    const reviews = await Review.find({ course: courseId })
      .populate('user', 'name email')
      .sort({ date: -1 })

    return res.status(200).json({
      message: "Reviews fetched successfully",
      reviews
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return res.status(500).json({ message: "Failed to fetch reviews", error: error.message })
  }
}

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params
    const { rating, comment, title } = req.body
    const userId = req.userId

    // Find review
    const review = await Review.findById(reviewId)
    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    // Check if user is the review author
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only edit your own reviews" })
    }

    // Update review
    if (rating) review.rating = parseInt(rating)
    if (comment) review.comment = comment
    if (title) review.title = title

    await review.save()

    // Recalculate course rating
    const course = await Course.findById(review.course)
    const allReviews = await Review.find({ course: review.course })
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0)
    course.rating = (totalRating / allReviews.length).toFixed(1)

    await course.save()

    return res.status(200).json({
      message: "Review updated successfully",
      review,
      courseRating: course.rating
    })
  } catch (error) {
    console.error("Error updating review:", error)
    return res.status(500).json({ message: "Failed to update review", error: error.message })
  }
}

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params
    const userId = req.userId

    // Find review
    const review = await Review.findById(reviewId)
    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    // Check if user is the review author
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own reviews" })
    }

    const courseId = review.course

    // Delete review
    await Review.deleteOne({ _id: reviewId })

    // Remove from course's reviewsList
    await Course.findByIdAndUpdate(courseId, {
      $pull: { reviewsList: reviewId }
    })

    // Recalculate course rating
    const course = await Course.findById(courseId)
    const allReviews = await Review.find({ course: courseId })
    
    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0)
      course.rating = (totalRating / allReviews.length).toFixed(1)
      course.reviewCount = allReviews.length
    } else {
      course.rating = 0
      course.reviewCount = 0
    }

    await course.save()

    return res.status(200).json({
      message: "Review deleted successfully",
      courseRating: course.rating,
      reviewCount: course.reviewCount
    })
  } catch (error) {
    console.error("Error deleting review:", error)
    return res.status(500).json({ message: "Failed to delete review", error: error.message })
  }
}
