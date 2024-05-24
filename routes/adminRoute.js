//import express module from package.json
const express = require('express')

//admin route to use express()
const admin_route = express();

//required session
const session = require('express-session');

//set config file to session handilling 
const config = require('../config/config')
admin_route.use(session({secret:config.sessionSecret}))

//import bodyparser module
const bodyParser = require('body-parser')


//used to bodyparser to convert the formated into json and url body
admin_route.use(bodyParser.json())
admin_route.use(bodyParser.urlencoded({extended:true}))

const multer = require('multer');
const path = require('path');

admin_route.use(express.static('public'))

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, '../public/userImages'));
    },
    filename: function (req, file, callback) {
        const name = Date.now() + '-' + file.originalname; // Fixed typo here
        callback(null, name);
    }
});
const upload = multer({ storage: storage });

//view engine set
admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin')

//import the middleware to check the session of user
const auth = require('../middleware/adminAuth')

//admin controller route set
const adminController = require('../controllers/adminController')

//this will load the login page of admin
admin_route.get('/',auth.isLogout,adminController.loadLogin)

//it will redirect to admincontroller to verify login
admin_route.post('/',adminController.verifyLogin)

//go to home page route set
admin_route.get('/home',auth.isLogin,adminController.loadDashboard)

//logout setup
admin_route.get('/logout',auth.isLogin,adminController.logout)

//dashboard section
admin_route.get('/dashboard',auth.isLogin,adminController.adminDashboard)

//add New User route setting
admin_route.get('/new-user',auth.isLogin,adminController.newUserLoad)

//user value from the form method using post
admin_route.post('/new-user',upload.single('image'),adminController.addUser)

//for the update user in admin dashboard to view the page of edit-user
admin_route.get('/edit-user',auth.isLogin,adminController.editUserLoad)

//for the post method to update the user details
admin_route.post('/edit-user',adminController.updateUsers);

//delete the user route setting
admin_route.get('/delete-user',adminController.deleteUser);

//prevent to route is missing with any other route set permenent redirect wen admin type this url
admin_route.get('*',function (req,res) {
    res.redirect('/admin')
})

//index.js file use this module to export
module.exports = admin_route

