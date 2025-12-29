import bcrypt from "bcryptjs";
import validator from "validator";
import User from "../model/userModel.js";
import genToken from "../config/token.js";
import { sendOtpEmail, sendResetSuccessEmail } from "../config/sendmail.js";

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const signUp = async (req, res) => {
    try{
        const {name, email , password , role}=req.body
        let existUser= await User.findOne({email})
        if (existUser){
            return res.status(400).json({message:"User already exists"})   

        }
        if (!validator.isEmail(email)){
            return res.status(400).json({message:"Invalid email"})
        }
        if (password.length < 8){
            return res.status(400).json({message:"Password must be at least 6 characters"})
        }

        let hashedPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            name,password:hashedPassword, role,
            email,}) 
        let token= await genToken(user._id) 
        res.cookie("token", token,{ 
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:"strict",
            maxAge:7*24*60*60*1000,   

    })
    return res.status(201).json({user})

  }  catch(error){   
        console.log(error)
        res.status(500).json({message:"Server Error"})
    }           
}

export const login = async (req,res)=>{
    try{
        const{email,password}=req.body
        const user= await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid email or password"})
        }
        let isMatch= await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid email or password"})
        }         
        let token= await genToken(user._id)
        res.cookie("token", token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:"strict",
            maxAge:7*24*60*60*1000,   
        })
        return res.status(200).json({user})   


    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Login Error"})
    }}

export const logOut= async (req,res)=>{
        try{
            await res.clearCookie("token")
            return res.status(200).json({message:"Logged out successfully"})        
            
        }catch(error){
            console.log(error)
            res.status(500).json({message:"Logout Error"})
        }
           }

// Forget Password - Step 1: Send OTP
export const forgetPasswordSendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.resetOtp = otp;
        user.resetOtpExpiry = otpExpiry;
        await user.save();

        try {
            await sendOtpEmail(email, otp);
        } catch (emailError) {
            console.log("Email error:", emailError);
            return res.status(500).json({ message: "Failed to send OTP email" });
        }

        return res.status(200).json({
            message: "OTP sent successfully to your email",
            email: email
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Forget Password - Step 2: Verify OTP
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Check if OTP exists and hasn't expired
        if (!user.resetOtp) {
            return res.status(400).json({ message: "OTP not requested or expired" });
        }

        if (new Date() > user.resetOtpExpiry) {
            user.resetOtp = null;
            user.resetOtpExpiry = null;
            await user.save();
            return res.status(400).json({ message: "OTP has expired" });
        }

        if (user.resetOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        return res.status(200).json({ message: "OTP verified successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Forget Password - Step 3: Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;

        if (!email || !otp || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Verify OTP again
        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        if (new Date() > user.resetOtpExpiry) {
            user.resetOtp = null;
            user.resetOtpExpiry = null;
            await user.save();
            return res.status(400).json({ message: "OTP has expired" });
        }

        // Hash new password and save
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = null;
        user.resetOtpExpiry = null;
        await user.save();

        try {
            await sendResetSuccessEmail(email);
        } catch (emailError) {
            console.log("Email error:", emailError);
        }

        return res.status(200).json({ message: "Password reset successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};


