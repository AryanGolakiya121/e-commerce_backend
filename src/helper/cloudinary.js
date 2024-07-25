const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadCatImgOnCloudinary = async(localFilePath) => {
    try{
        if (!localFilePath){
            console.log('could not find the path');
            return null;
        }

        //upload the file to the cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            unique_filename: false,
            use_filename: true,
            resource_type: 'auto',
            folder: 'category_images'
        })

        fs.unlinkSync(localFilePath);
        //file has been uplaoded successfully
        console.log("file has been uplaoded successfully on cloudinary: ");
        return response;

    }catch(err){
        fs.unlinkSync(localFilePath)  //remove the locally saved temproary file as the upload operation got failed
        console.error("Error uploading category image file to Cloudinary:", err);
        return null
    }
}

const uploadProductImgOnCloudinary = async(localFilePath, category) => {
    try{
        if(!localFilePath){
            console.log("Cloud not find the path");
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            unique_filename: false,
            use_filename: true,
            resource_type: 'auto',
            folder: category
        })

        // console.log("response=> ",response);
        fs.unlinkSync(localFilePath);
        console.log('Product image has been uploaded successfully on cloudinary')

        return response;
    }catch(error){
        fs.unlinkSync(localFilePath);
        console.log("Error uploading product image file to Cloudinary:", error);
        return null;
    }
}
module.exports = {
    uploadCatImgOnCloudinary,
    uploadProductImgOnCloudinary,
}