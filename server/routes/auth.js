const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const User = require('../models/User')


router.post('/register', async (req, res) => {

    const {  email  ,password } = req.body


    if(  !email || !password) 
        return res
            .status(400)
            .json({ success: false, message: 'Chưa nhập email or password' })

    try{
        const user = await User.findOne({ email })
        
        if(user){
            return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
        }
        const hashedPassword = await argon2.hash(password);
        const newUser = new User({ email, password: hashedPassword })
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
				.json({ success: false, message: 'Incorrect email' })

		// Username found
		const passwordValid = await argon2.verify(user.password, password)
		if (!passwordValid)
			return res
				.status(400)
				.json({ success: false, message: 'Incorrect password' })

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


module.exports = router;