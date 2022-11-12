const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const verifyToken = require('../middleware/auth');

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
        if(userName){
			return res.status(400).json({ success: false, message: 'Username đã tồn tại' });
        }
		
		
        const hashedPassword = await argon2.hash(password);
        const newUser = new User({ email, password: hashedPassword ,username,birthday,gender , avt})
        await newUser.save();

        const accessToken = jwt.sign({ userId: newUser._id},process.env.ACCESS_TOKEN_SECRET_KEY)

        res.json({success: true, message: 'User saved successfully', accessToken})
    }
    catch(err){
        console.log(err)
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

	const {username,passwordOld , passwordNew} = req.body

	try{

        const user = await User.findOne({ username })

		const passwordValid = await argon2.verify(user.password, passwordOld)
        if(!passwordValid){
            return res.status(400).json({ success: false, message: 'Mật khẩu không khớp' });
        }

		const hashedPassword = await argon2.hash(passwordNew);

		const postUpdateCondition = {username: username}
		const userUpdate = await User.findOneAndUpdate(postUpdateCondition, { 
			$set:{"password": hashedPassword}
		}
		, { new: true })

		res.json({success: true, message: 'Đổi mật khẩu thành công'})
	}
	catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})


module.exports = router;