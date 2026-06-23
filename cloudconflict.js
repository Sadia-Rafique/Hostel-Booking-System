const  cloudinary  = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET 
});

// Setup storage engine for room images
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Roomimages',
        allowedFormats: ['jpg', 'png', 'jpeg'], 
    }, 
}); 

// Setup storage engine for booking files
const booking = new CloudinaryStorage({ 
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folderName = "BookingFolder"; 
        
        if (file.fieldname === "BookingRoom[useridcard]") {
            folderName = "useridcard";
        }
        else if (file.fieldname === "BookingRoom[guardiancard]") {
            folderName = "guardiancard";
        }
        else if (file.fieldname === "BookingRoom[booking]") {
            folderName = "Paymentproof";
        }
        
        return {
            folder: folderName, 
            allowedFormats: ["jpg", "png", "jpeg"] 
        };
    }
});

module.exports = {
    cloudinary,
    storage,
    booking
};
