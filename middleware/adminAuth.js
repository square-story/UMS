const isLogin = async(req,res,next)=>{
    try {
        //that user is there it will do nothing
        if(req.session.user_id){

        }else{
            //that user is not there it will distroy and will redirect the admin panel
            res.redirect('/admin')
        }
        //the next use to compalsory to pass next middleware or callback
        next()

    } catch (error) {
        console.log(error.message)
    }
}

const isLogout = async(req,res,next)=>{
    try {
        if (req.session.user_id) {
            res.redirect('/admin/home')
        } else {
            
        }
        next()
    } catch (error) {
        console.log(error.message)
    }
}

//module sent as middleware
module.exports = {isLogin,isLogout}