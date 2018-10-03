const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const crypto = require('crypto'),
    multer = require('multer'),
    GridFsStorage = require('multer-gridfs-storage'),
    Grid = require('gridfs-stream'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser');


mongoose.connect(mongoDbUri).then(db => {
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + "/public"));
console.log(__dirname + "/public")

//init gfs
let gfs;