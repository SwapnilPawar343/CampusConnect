import multer from 'multer'

// Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();

// File filter to accept only specific file types
const fileFilter = (req, file, callback) => {
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp',
        'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm',
        'application/pdf',
        'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/webm'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error('Invalid file type. Only images, videos, PDFs, and audio files are allowed.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});

export default upload;