const multer = require("multer");

//Handler to force the addition of a unix timestamp on uploaded csv
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