const multer = require('multer');

const path = require('path');

// Multer Configurations
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('profileImg');

// Check File Type
let checkFileType = (file, callback) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return callback(null,true);
  } else {
    console.log('Images only');
    const errors = {};
    errors.profileImg = { msg: 'Image formats allowed are jpeg, jpg, png, gif' };
    callback(errors);
  }
};

module.exports = { upload };
