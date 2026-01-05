
import { v2 as cloudinary } from 'cloudinary';
import e from 'express';
import fs from 'fs';


const uploadToCloudinary = async (fileObj, folder = 'lms_videos') => {
    cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});      
    try{
        if (!fileObj) {
            throw new Error('File is required');
        }

        // Handle multer file object
        let filePath = fileObj.path || fileObj;
        
        if (!filePath) {
            throw new Error('File path is required');
        }

        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder, 
            resource_type: 'auto',
        });

        // Delete file after upload if it's from multer (has path property)
        if (fileObj.path && fs.existsSync(fileObj.path)) {
            fs.unlinkSync(fileObj.path);    
        }

        return result.secure_url;
    }
    catch(error){
        console.error('Cloudinary upload error:', error);
        throw error;
    }
}
export default uploadToCloudinary;
