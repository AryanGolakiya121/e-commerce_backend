const multer = require('multer');
const fs = require('fs');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join('./public/categories/', 'temp')
        
        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, {recursive: true})
        }
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, '0'); // Get day with leading zero if needed
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Get month with leading zero if needed
        const year = currentDate.getFullYear().toString();
        const fileName = `${day}${month}${year}_${file.originalname}`;

        cb(null, fileName)
    }

})

const upload = multer({
    storage
})

const uploadCategoryImage = (req, res, next) => {
    upload.single('categoryImage')(req, res, (err) => {
        if(err){
            return res.status(400).json({status:false, message: "Failed to upload image", error:err.message})
        }
        if(!req.file){
            return next()
        }

        const file = req.file;

        const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png']

        if(!allowedTypes.includes(file.mimetype)){
            fs.unlinkSync(file.path)
            return res.status(400).json({ status: false, message: `Invalid file type: ${file.originalname}`});
        }

        req.file = file;
        next();
    })
}


module.exports = {
    uploadCategoryImage
}