const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const ExifImage = require('exif').ExifImage;
const multer = require('multer');

app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyparser.json());
port = 3000;

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.render('index.ejs')
});

app.post('/submit', upload.single('filename'), (req, res) => {
  if (req.file) {
    const image = req.file.buffer;
    new ExifImage({ image: image }, function (error, exifData) {
      if (error) {
        console.log('Error:' + error.message);
        return res.render('index.ejs',{
          error: error.message,
        });
      }
      if (exifData.gps.GPSLatitude && exifData.gps.GPSLongitude) {
        exifData.gps.GPSLatitude = convert2Decimal(exifData.gps.GPSLatitude);
        exifData.gps.GPSLongitude = convert2Decimal(exifData.gps.GPSLongitude); 
      }
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

function convert2Decimal(dms) {
  return (dms[0] + (dms[1]/60) +(dms[2]/3600))
}

