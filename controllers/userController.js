const User = require('../models/userModel')

const bcrypt = require('bcrypt')

const securePassword = async(password)=>{
    try {
       const passwordHash =  await bcrypt.hash(password,10);
       return passwordHash;

    } catch (error) {
        
    }
}

const loadRegister = async(req,res)=>{
    try {
        res.render('registration',{dashboardType: 'user-registration'})
    } catch (error) {
        console.log(error.message)
    }
}

const insertUser = async (req,res)=>{
    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mno,
            image:req.file.filename,
            password:spassword,
            is_admin:0 
        })
        const userData = await user.save();

        if (userData) {
            res.render('registration',{message:"user registeration has been success",dashboardType: 'user-registration'});

        }
        else{
            res.render('registration',{message:"user registeration has been failed",dashboardType: 'user-registration'});
        }
    } catch (error) {
        console.log(error.message)
    }
}

//login-system

const loginload = async(req,res)=>{
    try {
        // Check if the user is already logged in
        if (req.session.user_id) {
            // Redirect to the home page if logged in
            res.redirect('/home');
        } else {
            // Render the login page if not logged in
            res.render('login',{ dashboardType: 'user' });
        }
    } catch (error) {
        console.log(error.message);
    }
}


const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });

        if (userData) {
            // Check the password also
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                req.session.user_id = userData._id;
                // Redirect to the home page after successful login
                res.redirect('/home');
            } else {
                res.render('login', { message: "Password is incorrected",dashboardType: 'user'});
            }
        } else {
            res.render('login', { message: "Email and password are incorrect",dashboardType: 'user'});
        }
    } catch (error) {
        console.log(error.message);
    }
};


const loadHome = async (req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id})
        res.render('home',{user:userData,dashboardType: 'user-home'})
    } catch (error) {
        console.log(error.message)
    }
}

const userLogout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                res.status(500).send('Error destroying session');
                return;
            }
            // Redirect to a different page after logout
            res.redirect('/login');
        });
    } catch (error) {
        console.log('Error during logout:', error.message);
        res.status(500).send('Error during logout');
    }
};

//userprofile edit and update
const editLoad = async(req,res)=>{
    try {
        const id = req.query.id;
        const userData = await User.findById({_id:id})

        if (userData) {
            res.render('edit',{user:userData,dashboardType: 'user-edit'})
        } else {
            res.redirect('/home',{message:"something is wrong"})
        }
    } catch (error) {
        console.log(error.message)
    }
}

const updateProfile = async(req,res)=>{
    try {
        if (req.file) {
            const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno,image:req.file.filename}})
        } else {
           const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno}})
        }
        res.redirect('/home')
    } catch (error) {
        console.log(error.message)
    }
}


module.exports = {
    loadRegister,
    insertUser,
    loginload,
    verifyLogin,
    loadHome,
    userLogout,
    editLoad,
    updateProfile
}