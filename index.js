const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const ExifImage = require('exif').ExifImage;
const multer = require('multer');
const fs = require('fs');

app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyparser.json());
port = 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/Images');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.render('index.ejs')
});

app.post('/submit', upload.single('filename'), (req, res) => {
  if (req.file) {
    const image = req.file.path;
    new ExifImage({ image: image }, function (error, exifData) {
      if (error) {
        console.log('Error:' + error.message);
        removeImage(image);
        return res.render('index.ejs',{
          error: error.message,
        });
      }
      removeImage(image);
      // console.log(exifData8);
      res.render('index.ejs', {
        exifData: exifData,
      });
    });
  } else {
    res.render('index.ejs',{
      error: 'No image selected',
    });
  }
});
app.listen(port, () => console.log(`Server is listening on port ${port}`));

function removeImage(imagePath) {
  fs.unlink(imagePath, err => {
    if (err) {
      console.log('Error deleting the file : ' + err);
      return;
    }
  });
}
