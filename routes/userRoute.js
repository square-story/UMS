const express = require('express');
const user_route = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const session = require('express-session')
const config = require('../config/config')


user_route.use(session({secret:config.sessionSecret}))

const auth = require('../middleware/auth')

user_route.use(express.static('public'))

// Middleware setup
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

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

// View engine setup
user_route.set('view engine', 'ejs');
user_route.set('views', './views/users');

// Controller setup
const userController = require('../controllers/userController');

// Routes
user_route.get('/register', auth.isLogout,userController.loadRegister);
user_route.post('/register', upload.single('image'), userController.insertUser);

user_route.get('/',auth.isLogout,userController.loginload);
user_route.get('/login',auth.isLogout,userController.loginload);

user_route.post('/login',userController.verifyLogin);

user_route.get('/logout',userController.userLogout)

user_route.get('/home',auth.isLogin,userController.loadHome)

user_route.get('/edit',auth.isLogin,userController.editLoad)

user_route.post('/edit',upload.single('image'),userController.updateProfile)


module.exports = user_route;
