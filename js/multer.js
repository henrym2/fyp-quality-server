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
    if (file.mimetype !== 'text/csv') {
        req.fileValidationError = 'goes wrong on the mimetype';
        return cb(null, false, new Error('goes wrong on the mimetype'));
    }
    cb(null, true);
    }

const uploader = multer( { storage: storage,  fileFilter: filter } )

module.exports = uploader