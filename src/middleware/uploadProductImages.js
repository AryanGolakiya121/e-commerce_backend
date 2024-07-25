const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join('./public/products/', 'temp');
        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true})
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
});

const upload = multer({ storage });

const uploadProductImages = (req, res, next) => {
    upload.array('productImages', 5)(req, res, next, (err) => {
        if(err){
            return res.status(400).json({ status: false, message: "Failed to upload images", error: err.message })
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ status: false, message: "No images uploaded" });
        }

        // Validate file types
        const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
        for(const file of req.files){
            if(!allowedTypes.includes(file.mimetype)){
                req.files.forEach((file) => fs.unlinkSync(file.path));
                return res.status(400).json({ status: false, message: `Invalid file type: ${file.originalname}` });
            }
        }
        next();
    })
}

module.exports = {
    uploadProductImages,
}