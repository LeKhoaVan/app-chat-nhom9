const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Otp = require('../models/Otp')
const verifyToken = require('../middleware/auth');
const nodemailer = require('nodemailer');

const dotenv = require("dotenv");
 
dotenv.config();

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: process.env.GMAIL,
	  pass: process.env.PASSWORD_APP
	}
  });


router.get('/', verifyToken, async (req, res) => {
	try {
		const user = await User.findById(req.userId).select('-password')
		if (!user)
			return res.status(400).json({ success: false, message: 'User not found' })
		res.json({ success: true, user })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})




router.post('/register', async (req, res) => {

    const {   emailRe  ,
			passwordRe  ,
		 username , birthday , gender , avt} = req.body
	const email = emailRe
	const password = passwordRe
	const status = 1

    if(  !email || !password ||  !username || !birthday  || !gender ) 
        return res
            .status(400)
            .json({ success: false, message: 'Chưa nhập đủ dữ liệu' })

    try{
        const user = await User.findOne({ email })
        if(user){
            return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
        }
		const userName = await User.findOne({ username })
        
		

		const otp = Math.floor(Math.random() * 9000 + 1000) + "";
		
		var mailOptions = {
			from: process.env.GMAIL,
			to: emailRe,
			subject: 'Xác thực tài khoản CynoChat',
			html: '<p>Không cung cấp mã xác thực cho bất cứ ai</p><h4>Mã xác thực: '+ otp + '</h4>'
		  };
		


		transporter.sendMail(mailOptions,async function(error, info){
			if (error) {
				return res.status(400).json({ success: false, message: error });
			} else {
				const hashedOtp = await argon2.hash(otp);
				const newOtp = new Otp({email,otp:hashedOtp})
				newOtp.save();

				const hashedPassword = await argon2.hash(password);
				const newUser = new User({ email, password: hashedPassword ,username,birthday,gender , avt,status,isActive:true})
				await newUser.save();

		
				res.json({success: true, message: 'Tạo tài khoản thành công'})
			}
		  });

       
    }
    catch(err){
        console.log(err)
		res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

router.put('/verifyOtp',async (req,res) => {
	const {  email , otp } = req.body
	try{
		const getotp = await Otp.findOne({email:email})
		if(!getotp) {
			return res
				.status(400)
				.json({ success: false, message: 'OTP hết hạn' })
		}
		const otpValid = await argon2.verify(getotp.otp, otp)
		if (!otpValid)
				return res
					.status(400)
					.json({ success: false, message: 'OTP không chính xác' })
		

		const postUpdateCondition = {email}
		const userUpdate = await User.findOneAndUpdate(postUpdateCondition, { 
			$set:{"status": 0}
		}
		, { new: true })
		const accessToken = jwt.sign({ userId: userUpdate._id},process.env.ACCESS_TOKEN_SECRET_KEY)

		res.json({success: true, message: 'Xác thực tài khoản thành công', accessToken})
	}
	catch(error) {
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

router.post('/login', async (req, res) => {
	const {  email , password } = req.body

	// Simple validation
	if ( !email || !password)
		return res
			.status(400)
			.json({ success: false, message: 'Chưa nhập email or password' })

	try {
		// Check for existing user
		const user = await User.findOne({ email })
		if (!user)
			return res
				.status(400)
				.json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' })
		if (user.status === 1)
			return res
				.status(400)
				.json({ success: false, message: 'Tài khoản chưa được xác thực' })

		// Username found
		const passwordValid = await argon2.verify(user.password, password)
		if (!passwordValid)
			return res
				.status(400)
				.json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' })

		// All good
		// Return token
		const accessToken = jwt.sign(
			{ userId: user._id },
			process.env.ACCESS_TOKEN_SECRET_KEY
		)

		res.json({
			success: true,
			message: 'User logged in successfully',
			accessToken
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

router.put('/changePassword', async (req, res) => {

	const {emailChange,passwordOld , passwordNew, cfpassword} = req.body
	const email = emailChange
	if(  !email || !passwordOld ||  !passwordNew || !cfpassword ) 
        return res
            .status(400)
            .json({ success: false, message: 'Chưa nhập đủ dữ liệu' })
	try{

        const user = await User.findOne({ email })

		const passwordValid = await argon2.verify(user.password, passwordOld)
        if(!passwordValid){
            return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng' });
        }

		if( passwordNew === cfpassword){
			const hashedPassword = await argon2.hash(passwordNew);

			const postUpdateCondition = {email: email}
			const userUpdate = await User.findOneAndUpdate(postUpdateCondition, { 
				$set:{"password": hashedPassword}
			}
			, { new: true })
	
			res.json({success: true, message: 'Đổi mật khẩu thành công'})
		}
		else{
			return res.status(400).json({ success: false, message: 'Mật khẩu mới nhập lại không đúng' });
		}


	}
	catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})


module.exports = router;