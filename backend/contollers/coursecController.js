
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
      creator: req.userId
    })
    return res.status(201).json(course)
  } catch (error) {
    // Error handling logic can be added here
    return res.status(500).json({ message: "CreateCOurse Error" });
  }
}
export  const getPublishedCourses=async(req,res)=>{
    try {
        const courses= await Course.find({isPublished:true})
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
            const courses= await Course.find({creator:req.userId})      
        
        if (!courses || courses.length===0){
            return res.status(404).json({message:"No courses found for this creator"})
        }
        return res.status(200).json(courses)}

    catch (error){
        return res.status(500).json({message:" Failed to find Creator Courses Error"})

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
        const course=await Course.findById(courseId).populate("creator","name email")
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




