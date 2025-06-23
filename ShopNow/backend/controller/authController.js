import catchAsyncError from "../middleware/catchAsyncError.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import validator from "validator";
import sendToken from "../utils/sendToken.js";
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import { delete_file, uploadImage } from "../utils/cloudinary.js";

//register the user => api/v1/register
export const registerUser = catchAsyncError( async (req, res, next) => {

    const { name, email, password} = req.body;

    if(!validator.isEmail(email)){
        return next(new ErrorHandler("Please enter a valid email", 401));
    }

    if(!validator.isStrongPassword(password)){
        return next(new ErrorHandler("Please enter a strong password", 401));
    }

    const isExist = await User.findOne({email});

    if(isExist) {
        return next(new ErrorHandler("The email address is already in use"));
    }

    const isNameExist = await User.findOne({ name });
    if(isNameExist) {
        return next(new ErrorHandler("The name is already in use", 400));
    }

    const user = await User.create({
        name, email, password
    })

    sendToken(user, 201, res);
});

//login the user => api/v1/login
export const loginUser = catchAsyncError( async (req, res, next) => {

    const {email, password} = req.body;

    if(!email || !password){
		return next(new ErrorHandler("Please enter Email and Password", 401))
	}

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    const isPasswordMatch = await user.comparePassword(password);

    if(!isPasswordMatch){
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
});


//logout the user => api/v1/logout
export const logoutUser = catchAsyncError(async(req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        message: "User logged out"
    })
})

//forgotPassword => api/v1/password/reset
export const forgotPassword = catchAsyncError( async (req, res, next) => {

   //find the user in the database
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found with this email", 404))
    }

    const resetToken = user.getResetPasswordToken();

    await user.save();

    //create reset password url
    /*const resetURL = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`; for backend testing */ 
    
    const resetURL = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    //message, and pass the name and reset URL
    const message = getResetPasswordTemplate(user?.name, resetURL);

    try {
        await sendEmail({
            email: user.email,
            subject: "ShopNa Password Recovery",
            message: message,
        });
        
        res.status(200).json({
            message: `Email sent to: ${user.email}`
        })
        
    } catch (error) {
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;

        await user.save();
        return next(new ErrorHandler(error?.message, 500))
    }
});


//resetPassword => /api/v1/password/reset/:token
export const resetPassword = catchAsyncError(async (req, res, next) => {

    //has the password reset
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    //find the user
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    })

    if(!user) {
        return next(new ErrorHandler("Password token is Invalid or has been Expired", 404))
    }

    //check if the password and confirmpassword are same
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 404))
    }

    //set the new password
    user.password = req.body.password

    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();
    sendToken(user, 200, res);
})

//get current user profile => /api/v1/user
export const getCurrentUserProfile = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req?.user?._id);

    res.status(200).json({
        user,
    })

})

//upload avatar => /api/v1/user/upload_avatar
export const upload_Avatar = catchAsyncError(async (req, res, next) => {
    const avatarResponse= await uploadImage(req.body.avatar, "Ecommerce_V1/avatar")

    //remove previous user avatar
    if(req?.user?.avatar?.url){
        await delete_file(req?.user?.avatar?.public_id);
    }

    const user = await User.findByIdAndUpdate(req?.user?._id, {
        avatar: avatarResponse,
    })

    res.status(200).json({
        user,
    })
})

//update password => /api/v1/password/update
export const updatePassword = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req?.user._id).select('+password');

    //check the current password of the user
    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatch){
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    user.password = req.body.password;
    await user.save();

    res.status(200).json({
        success: true,
    })
});

//update profile => api/v1/user/updateProfile
export const updateProfile = catchAsyncError(async (req, res, next) => {
    
    //for new user data
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {new: true});

    res.status(200).json({
        user,
    })
});

//get all user - ADMIN => api/v1/admin/users
export const getAllUsers = catchAsyncError( async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        users,
    })
});


//find user by ID - ADMIN => api/v1/admin/users/:id
export const getUserDetails = catchAsyncError( async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with this id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        user,
    })
})

//find user by ID and UPDATE - ADMIN => api/v1/admin/users/:id
export const updateUser = catchAsyncError(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {new: true});

    res.status(200).json({
        user,
    })
})

//find user by ID and DELETE - ADMIN => api/v1/admin/users/:id
export const deleteUser = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with this id:${req.params.id}`, 404))
    }

    // also delete user image
    if(user?.avatar?.public_id){
        await delete_file(user?.avatar?.public_id);
    }

    await user.deleteOne()

    res.status(200).json({
        success: true,
    })

})
