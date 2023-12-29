const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');

//image upload 
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './uploads');
    },
    filename: function(req,file,cb){
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
});

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
        }
    },
    limits: {
        fileSize: 1024 * 1024, // 1 MB
    },
}).single('image');


//insert a user into database route
router.post('/add', upload, (req, res)=>{
    console.log('Req File:', req.file);
    if (!req.file) {
        // Handle the case where file upload failed
        return res.status(400).json({ message: 'Image upload failed', type: 'danger' });
    }
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    });
    user.save((err)=>{
        if(err){
            res.json({message: err.message, type: "danger"});
        }
        else{
            req.session.message = {
                type: 'success',
                message: 'User added Successfully',
            };
            res.redirect('/');
        }
    })
});
router.get("/", (req,res)=>{
    res.render("index", {title: "Home Page"});
});

router.get("/add",(req,res)=>{
    res.render("add_users", {title:"Add Users"});
});

module.exports = router;