var express       =require("express");
var app           =express();
var mongoose      =require("mongoose");
const path        =require("path");
const crypto      =require('crypto'),
      multer      =require('multer'),
      GridFsStorage=require('multer-gridfs-storage'),
      Grid         =require('gridfs-stream'),
      methodOverride=require('method-override'),
      bodyParser    =require('body-parser');

// var passport      = require("passport"),
//     LocalStrategy = require("passport-local").Strategy;

app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + "/public"));
console.log(__dirname + "/public")

//init gfs
let gfs;

const mongoURI ='mongodb://localhost/Aheru';
const conn = mongoose.createConnection(mongoURI);
conn.once('open',()=>{
    //init stream
     gfs=Grid(conn.db,mongoose.mongo);
     gfs.collection('uploads');
})
     //create storage engine
     const storage=new GridFsStorage({
         url:mongoURI,
         file:(req,file) => {
             return new Promise((resolve,reject)=>{
                 crypto.randomBytes(16,(err,buf)=>{
                     if(err){
                         return reject(err);
                     }
                     const filename=buf.toString('hex')+path.extname(file.originalname);
                     const fileInfo={
                         filename:filename,
                         bucketName:'uploads'
                     }
                     resolve(fileInfo);
                 });
             });
         }
     });
     const upload=multer({storage});


app.set("view engine", "ejs");

    app.use(express.static(__dirname + "/public"));
        app.get("/", function (req, res) {
        res.render("landing");
 })
app.get("/landing", function (req, res) {
    res.render("landing");
})
    app.get("/study",function(req,res){
        res.render("study/index")
   })
    app.get("/travel",function(req,res){
        res.render("travel/index")
   });
   app.get("/home",(req,res)=>{
       gfs.files.find().toArray((err, files) => {
           //check if files
           if (!files || files.length === 0) {
             
               res.render('travel/home',{files:false})
           }else{
               files.map(file=>{
                   if(file.contentType==='image/jpeg'||file.contentType==='image/png'){
                       file.isImage=true;
                   }else{
                       file.isImage=false;  
                   }
               });
               res.render('travel/home', { files: files });
           }
          
       })
   });
   //delete file
   app.delete('/files/:id',(req,res)=>{
    gfs.remove({ _id:req.params.id, root:'uploads'},(err,gridStore)=>{
        if(err){
            return res.status(404).json({err:err});
        }
        res.redirect('/home');
    });
    });
   app.post('/upload',upload.single("file"),(req,res)=>{
       res.redirect('/home');
   });
// see files
   app.get('/files',(req,res)=>{
       gfs.files.find().toArray((err,files)=>{
           //check if files
           if(!files||files.length===0){
               return res.status(404).json({
                   err:'no files exist'
               })
           }
           return res.json(files);
       })
   })
   //see one image
// see files/:filename
app.get('/files/:filename', (req, res) => {
    gfs.files.findOne( {filename:req.params.filename},(err,file)=>{
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
app.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'no file exists'
            })
        }
        //check if image
        if(file.contentType ==='image/jpeg'||file.contentType==='img/png'){
            //read output to browser
            const readstream=gfs.createReadStream(file.filename);
            readstream.pipe(res)
        }else{
            res.status(404).json({
                err:'npt an image'
            })
        }
    })
})
   app.get("/login",(req,res)=>{
       res.render("login")
   })
    //mongoose.connect("mongodb://localhost/");
    app.listen(3000,function(){
        console.log("Aheru success")
    });