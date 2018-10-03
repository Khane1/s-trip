const express = require("express");
const router = express.Router();
const multer = require('multer');
const mongoose = require("mongoose")
const path = require("path");
const crypto = require('crypto'),


GridFsStorage = require('multer-gridfs-storage'),
Grid = require('gridfs-stream');



let gfs;

const mongoURI = 'mongodb://localhost/Aheru';
const conn = mongoose.createConnection(mongoURI);
conn.once('open', () => {
    //init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})



//create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                }
                resolve(fileInfo);
            });
        });
    }
});


const upload = multer({ storage });


router.get("/home", (req, res) => {
    gfs.files.find().toArray((err, files) => {
        //check if files
        if (!files || files.length === 0) {

            res.render('travel/home', { files: false })
        } else {
            files.map(file => {
                if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                    file.isImage = true;
                } else {
                    file.isImage = false;
                }
            });
            res.render('travel/home', { files: files });
        }

    })
});
//delete file
router.delete('/files/:id', (req, res) => {
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
        if (err) {
            return res.status(404).json({ err: err });
        }
        res.redirect('/home');
    });
});
router.post('/upload', upload.single("file"), (req, res) => {
    res.redirect('/home');
});
// see files
router.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        //check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'no files exist'
            })
        }
        return res.json(files);
    })
})
//see one image
// see files/:filename
router.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'no file exists'
            })
        }
        //files exist
        return res.json(file)
    })
})

//see one image
// see image/:filename
router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'no file exists'
            })
        }
        //check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'img/png') {
            //read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res)
        } else {
            res.status(404).json({
                err: 'not an image'
            })
        }
    });
});

module.exports = router;