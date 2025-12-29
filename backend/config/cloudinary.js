
import { v2 as cloudinary } from 'cloudinary';
import e from 'express';
import fs from 'fs';


const uploadToCloudinary = async (filePath, folder) => {
    cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});      
    try{
        if (!filePath) {
            throw new Error('File path is required');
        }
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder, resource_type: 'auto',
        });
        fs.unlinkSync(filePath);    
        return result.secure_url;
    }
    catch(error){
        console.error('Cloudinary upload error:', error);
        throw error;
    }
}
export default uploadToCloudinary;
