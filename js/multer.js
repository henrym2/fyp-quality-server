const multer = require("multer");

const storage = multer.diskStorage(
    {
        destination: './data/',
        filename: function ( req, file, cb ) {
            cb( null, Date.now()+ '-' + file.originalname);
        }
    }
);

const uploader = multer( { storage: storage })

module.exports = uploader