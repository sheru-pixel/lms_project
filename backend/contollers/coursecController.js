
import Course from "../model/courseModel.js"
import uploadToCloudinary from "../config/cloudinary.js"

export const createCourse = async (req, res) => {
  try {
    const { title, category, description } = req.body
    if (!title || !category) {
      return res.status(400).json({ message: "title or Category is required" })
    }
    const course = await Course.create({
      title,
      category,
      description,
      educator: req.userId
    })
    return res.status(201).json(course)
  } catch (error) {
    // Error handling logic can be added here
    return res.status(500).json({ message: "CreateCOurse Error" });
  }
}
export  const getPublishedCourses=async(req,res)=>{
    try {
        const courses= await Course.find({isPublished:true}).populate('educator', 'name email role')
        if (!courses || courses.length===0){
            return res.status(404).json({message:"No published courses found"})
        }
        return res.status(200).json(courses)
    }
    catch (error){
        return res.status(500).json({message:" Failed to find isPublished Courses Error"})
    }   }

export const getCreatorCourses=async(req,res)=>{
        try {
            console.log('getCreatorCourses - req.userId:', req.userId)
            const courses= await Course.find({educator:req.userId})      
        
            // Debug: check all courses and their educator fields
            const allCourses = await Course.find({})
            console.log('All courses in DB:', allCourses.map(c => ({ id: c._id, title: c.title, educator: c.educator })))
        
            console.log('Found courses for this educator:', courses.length)
            return res.status(200).json(courses)}

    catch (error){
        return res.status(500).json({message:" Failed to find educator courses Error"})

    }   
    }
export const editCourse=async(req,res)=>{
    try {
        const courseId=req.params.courseId
        const {title, subTitle,description,category,level,isPublished,price}=req.body
        let thumbnail 
        if (req.file) {
            thumbnail=await uploadToCloudinary(req.file.path)
        }
        let course =await Course.findById(courseId) 
        if (!course){
            return res.status(404).json({message:"Course not found"})
        }
        const updatedData={
            title,
            subTitle,
            description,
            category,
            level,
            isPublished,
            price}
        if (thumbnail) {
            updatedData.thumbnail = thumbnail
        }
        course=await Course.findByIdAndUpdate(courseId,updatedData,{new:true})
        return res.status(200).json(course)
    }
    catch (error){
        console.error('Error updating course:', error.message)
        console.error('Full error:', error)
        return res.status(500).json({
            message:"Failed to update course",
            error: error.message
        })
    }

}
export const getCourseById=async(req,res)=>{
    try{
        const courseId=req.params.courseId
        const course=await Course.findById(courseId).populate('educator','name email role').populate('lectures').populate({
            path: 'reviewsList',
            select: 'userName rating comment title date user'
        })
        if (!course){
            return res.status(404).json({message:"Course not found"})
        }
        return res.status(200).json(course)
        
    }
    catch (error){
        console.error('Error getting course:', error)
        return res.status(500).json({message:"Failed to get course by ID"})
    }   
}
export const removeCourse=async(req,res)=>{
    try{
        const courseId=req.params.courseId
        let course=await Course.findById(courseId)
        if (!course){
            return res.status(404).json({message:"Course not found"})
        }
        course = await Course.findByIdAndDelete(courseId,{new:true})
        return res.status(200).json({message:"Course deleted successfully"})
    }   
    catch (error){
        return res.status(500).json({message:"Failed to delete course"})
    }       }

export const createLecture=async(req,res)=>{
    try {
        const {lectureTitle,videoUrl,isPreviewfree}=req.body
        const courseId=req.params.courseId
        const course=await Course.findById(courseId)
        if (!(lectureTitle || courseId)){
            return res.status(400).json({message:"Lecture title and courseId are required"})
        }
        const lecture =await Lecture.create({
            title:lectureTitle,
            videoUrl,   }
        )
        
        if (course) {
            course.lectures.push(lecture._id)
        }
        await course.populate("lectures")
        await course.save()
        return res.status(201).json({message:"Lecture created successfully",lecture})
    }   
    catch (error){
            return res.status(500).json({message:"Failed to create lecture"}    )
    }       
}

export const getCourseLectures=async(req,res)=>{
    try {
        const courseId=req.params.courseId
        const course=await Course.findById(courseId).populate("lectures")
        if (!course){
            return res.status(404).json({message:"Course not found"})
        }   
        await course.populate("lectures")
        await course.save()
        return res.status(200).json(course)

    }
    catch (error){
        return res.status(500).json({message:"Failed to get course lectures"})
    }   
}

// Get courses enrolled by student
export const getEnrolledCourses = async (req, res) => {
    try {
        const studentId = req.userId;
        const courses = await Course.find({ enrolledStudents: studentId })
            .populate('educator', 'name email role')
            .populate('lectures');
        
        if (!courses || courses.length === 0) {
            return res.status(200).json({ 
                message: "No enrolled courses found", 
                courses: [],
                success: true 
            });
        }
        
        return res.status(200).json({ 
            message: "Enrolled courses retrieved successfully",
            courses: courses,
            success: true 
        });
    } catch (error) {
        console.error('Error getting enrolled courses:', error);
        return res.status(500).json({ 
            message: "Failed to get enrolled courses", 
            error: error.message,
            success: false 
        });
    }
};

// Check if course is free
export const isCourseFree = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        
        return res.status(200).json({ isFree: course.price === 0 || course.price === undefined });
    } catch (error) {
        console.error('Error checking if course is free:', error);
        return res.status(500).json({ message: "Failed to check course", error: error.message });
    }
};




