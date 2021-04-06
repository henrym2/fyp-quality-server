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

function filter(req, file, cb) {
    console.log(file)
    if (file.mimetype !== 'text/csv') {
        req.fileValidationError = 'Non CSV file cannot be uploaded';
        cb(null, false, new Error('Non CSV file cannot be uploaded'));
        return
    }
    cb(null, true);
    }

const uploader = multer( { storage: storage,  fileFilter: filter } )

module.exports = uploader