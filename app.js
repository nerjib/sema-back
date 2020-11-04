const express = require('express')
const http = require('http')
const dotenv = require('dotenv');
const cors = require('cors')
const bodyParser = require('body-parser');
const path = require('path')
const app = express();
//const Users = require('./src/controllers/users')
const multer = require('multer');
const cloudinary = require('cloudinary');
const Chart = require('./src/controllers/chats/chats')
const Users = require('./src/controllers/users')
const Reports = require('./src/controllers/reports')
const Analytics = require('./src/controllers/analytics')
//var request = require('request');
const querystring = require('querystring');



app.use(cors())

http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


dotenv.config();


app.use(express.static(path.join(__dirname, 'public')));


const storage = multer.diskStorage({
  distination: function (req, file, cb) {
    cb(null, './src');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/gif'||'image/png') {
    cb(null, true);
  } else {
    cb(new Error('image is not gif'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});




app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
      res.headers('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE');
      return res.status(200).json({});
    }
    next();
  });
  
app.get('/', function(req,res){
res.send('Welcome to sema')
})

app.get('/push', function(req,res){
  

let data={
  "to": "ExponentPushToken[g4ESOZBNo1O65dnhet3Bbu]",
"sound": "default",
"title": "Original Title ok back",
"body": "And here is the body gone!",
"data": { "data": "goes here" }
}


// POST parameters as query string
const post_data = querystring.stringify(data);

const options = {
  url: 'https://exp.host/--/api/v2/push/send',
  method: 'POST'
};

const request = http.request(options, (response) => {
	// response from server
});

request(data);
request.end();

res.send('ok')

})
app.use('/api/v1/users', Users);
app.use('/api/v1/reports', Reports);
app.use('/api/v1/analytics', Analytics);


app.post('/api/v1/upload', upload.single('image'), (req, res) => {

  // console.log(req.body)
    cloudinary.uploader.upload(req.file.path, function (result) {
     //  console.log(result.secure_url)
       res.send({imgurl:result.secure_url})
   //   Activity.createReport(req, res, result.secure_url);
     });
   }); 

 /* 
  app.post('/api/v1/weeklyactivityform', upload.single('image'), (req, res) => {
    // console.log(req.body)
      cloudinary.uploader.upload(req.file.path, function (result) {
         console.log(result.secure_url)
        // res.send({imgurl:result.secure_url})
        Activity.createWeeklyReport(req, res, result.secure_url);
       });
     });
   
  app.post('/api/v1/upload', upload.single('image'), (req, res) => {
   // console.log(req.body)
     cloudinary.uploader.upload(req.file.path, function (result) {
      //  console.log(result.secure_url)
        res.send({imgurl:result.secure_url})
    //   Activity.createReport(req, res, result.secure_url);
      });
    });
  
//Change daily report image
 app.post('/api/v1/updatedailyreport', upload.single('image'), (req, res) => {
  // console.log(req.body)
    cloudinary.uploader.upload(req.file.path, function (result) {
       console.log(result.secure_url)
      // res.send({imgurl:result.secure_url})
      Activity.UpdateDailyReport(req, res, result.secure_url);
     });
   });

   app.post('/api/v1/updateweeklyreport', upload.single('image'), (req, res) => {
    // console.log(req.body)
      cloudinary.uploader.upload(req.file.path, function (result) {
         console.log(result.secure_url)
        // res.send({imgurl:result.secure_url})
        Activity.UpdateWeeklyReport(req, res, result.secure_url);
       });
     });
  
*/

module.exports = app;