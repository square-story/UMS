//user model for mongodb user model style
const User = require('../models/userModel')

//bcrypt import for password is converted into hash
const bcrypt = require('bcrypt')

//use randomstring to password
const randomstring = require('randomstring')

//for config file to session handilling
// const config = require('../config/config')

//for creating secure password
const securePassword = async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash
    } catch (error) {
        console.log(error.message);
    }
}

//load the login page when user in want admin login
const loadLogin = async(req,res)=>{
    try {
        res.render('login',{ dashboardType: 'admin-login' })
    } catch (error) {
        console.log(error.message)
    }
}

//verify the login details wen admin is provided
const verifyLogin = async(req,res)=>{
    try {
        //import the email and password from admin panel to check the given details
        const email = req.body.email
        const password = req.body.password

        //check the match the email is given email
        const userData = await User.findOne({email:email})
        console.log(userData)

        //check the email valid or nor
        if (userData) {
            //check the password also match or not and it will check the bcrypt file to compare
            const passwordMatch = await bcrypt.compare(password,userData.password)
            //if the unauthorized user come to type this it will prevent to login in admin panel
            if (passwordMatch) {
                //the given datebase check the admin key then decided
                if (userData.is_admin === 0) {
                    //this will prevent the authorization and it will sent a message to user
                    res.render('login',{message:'you are not authorized for this',dashboardType: 'admin-login'})
                } else {
                    //session is assign with user_id
                    req.session.user_id = userData._id

                    //it will redirect to the home page of admin
                    res.redirect("/admin/home")
                }
            } else {
                res.render('login',{message:"the password is incorrect please check your password again",dashboardType: 'admin-login'})
            }

        } else {
            res.render('login',{message:"email and password is incorrect",dashboardType: 'admin-login'})
        }


    } catch (error) {
        console.log(error.message)
    }
}

//home route set it
const loadDashboard = async(req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id})
        res.render('home',{admin:userData,dashboardType: 'admin-home'})
    } catch (error) {
        console.log(error.message)
    }
}

//logout route set
const logout = async(req,res)=>{
    try {
        req.session.destroy()
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message)
    }
}

//admin dashboard
const adminDashboard = async(req,res)=>{
    try {
        const userData = await User.find({is_admin:{$ne:1}})
        res.render('dashboard',{users:userData,dashboardType: 'admin-dashboard'})
    } catch (error) {
        console.log(error.message)
    }
}

//add user window render
const newUserLoad = async(req,res)=>{
    try {
        res.render('new-user',{dashboardType: 'admin-new-user'})
    } catch (error) {
        console.log(error.message)
    }
}

//user details collection
const addUser = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const mno = req.body.mno;
        const image = req.file.filename;

        const password = randomstring.generate(8) // Generating a random password
        const spassword = await securePassword(password); // Hashing the random password

        const user = new User({
            name: name,
            email: email,
            mobile: mno,
            image: image,
            password: spassword,// Setting the hashed password
            is_admin:0
        });
        
        const userData = await user.save(); // Saving the user to the database
        if (userData) {
            res.redirect('/admin/dashboard');
        } else {
            res.render('new-user', { message: 'something wrong' ,dashboardType: 'admin-new-user'});
        }
    } catch (error) {
        console.log(error.message);
    }
};

//edit to user from dashboard
const editUserLoad = async(req,res)=>{
    try {
        //use the id from query for identify usr id
        const id = req.query.id;
        //user find by the id when the id from query
        const userData = await User.findById({_id:id});
        if (userData) {
            //render the edit-user page and pass the userData to the render page for specifid edit
            res.render('edit-user',{user:userData,dashboardType: 'admin-edit-user'});
        }else{
            res.redirect('/admin/dashboard')
        }

    } catch (error) {
        console.log(error.message);
    }
}

//update user
const updateUsers = async(req,res)=>{
    try {
        
        const userData = await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno}})
        res.redirect('/admin/dashboard')

    } catch (error) {
        console.log(error.message)
    }
}

//delete user
const deleteUser = async(req,res)=>{
    try {
        //import the id from query selector
        const id = req.query.id;
        //the user is delete using the id selection
        await User.deleteOne({_id:id})
        //redirect to the dashboard for reflection on the remaning data
        res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser
}
