const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination : (req, file, cb) =>{
        cb(null, 'uploads/');
    },
    filename : (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLocaleLowerCase();

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

    if(file.mimetype.startsWith('image/') || allowedExtensions.includes(ext)){
        cb(null, true)
    }
    else{
        cb(new Error('Only images (jpg, jpeg, png, webp) are allowed!'), false);
    }
}

const upload = multer({
    storage : storage,
    fileFilter : fileFilter,
    limits : {
        fileSize : 5 * 1024 * 1024
    }
});

module.exports = upload;