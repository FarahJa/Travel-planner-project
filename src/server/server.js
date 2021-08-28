var path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Endpoint for all routes
let projectData = {};

// BodyParser config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

app.use(express.static('dist'));

//Get route
app.get('/', function (req, res) {
  res.sendFile('dist/index.html')
})

// Post Route
app.post('/postData', addInfo);

function addInfo(req, res) {
  projectData['fromText'] = req.body.fromText;
  projectData['toText'] = req.body.toText;
  projectData['maxTemp'] = req.body.maxTemp;
  projectData['minTemp'] = req.body.minTemp;
  projectData['summary'] = req.body.summary;
  projectData['daysLeft'] = req.body.daysLeft;
  projectData['fullDate'] = req.body.fullDate;
  projectData['cityImage'] = req.body.cityImage;
  projectData['language'] = req.body.language;
  projectData['region'] = req.body.region;
  projectData['curr'] = req.body.curr;
  projectData['flag'] = req.body.flag;
  res.send(projectData);
}

// Setup Server

const port = 3500;
const server = app.listen(port, listening);

function listening() {
  console.log(`Server is running on localhost: ${port}`);
};
