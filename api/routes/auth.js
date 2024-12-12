// routes/register.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

// Register route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, gender, photo } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            gender,
            photo,
            qualifications: [],
            experiences: [],
            timeSlots: [],
            reviews: [],
            averageRating: 0,
            totalRating: 0,
            isApproved: 'pending',
            appointments: []
        });

        // Save the user to the database
        user = await newUser.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // User authenticated, create JWT token
        const payload = {
            id: user._id,
            role: user.role
        };

        // Sign the token
        const token = jwt.sign(payload, 'test', { expiresIn: '6d' });

        // Respond with user data
        console.log(user.role);
        res.status(200).json({
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                image: user.image,
                rating: user.rating,
                isApproved: user.isApproved,
                appointments: user.appointments,
                totalRating: user.totalRating,
                noOfRating: user.noOfRating,
                createdAt: user.createdAt,
            },
            message: 'Successful login',
            role: user.role,
            token: token,
            status: true
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // Check if token exists
    if (!token) {
        console.log('token not found');
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        console.log('token found');
        // Verify token
        const decoded = jwt.verify(token, 'test');
        console.log(decoded);
        // Add user from payload
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token is not valid' });
    }
};

// Route to get user data with token
router.get('/get-profile', verifyToken, async (req, res) => {
    try {
        // Find user by ID from token payload
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with user data
        res.json({ "data": user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/update-profile', async (req, res) => {
    try {
        const { email, name, phone, bio, about, experiences, gender, photo, qualifications, specialization, ticketPrice, timeSlots } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        // If the user doesn't exist, return an error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's profile fields
        user.name = name;
        user.phone = phone;
        user.bio = bio;
        user.about = about;
        user.experiences = experiences;
        user.gender = gender;
        user.photo = photo;
        user.qualifications = qualifications;
        user.specialization = specialization;
        user.ticketPrice = ticketPrice;
        user.timeSlots = timeSlots;

        // Save the updated user profile
        await user.save();

        res.json({ message: 'Profile updated successfully', data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// Route to get doctors
router.get('/doctors', async (req, res) => {
    try {
        // Find users with role 'doctor'
        const doctors = await User.find({ role: 'doctor' }).select('-password');

        res.status(200).json({ "data": doctors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Route to get a doctor by ID
router.get('/doctor/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user by ID
        const doctor = await User.findById(id).select('-password');

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({ "data": doctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/bookappointment', async (req, res) => {
    const { id, name, gender, payment, price } = await req.body;
    try {
        const user = await User.findById(id);
        user.appointments.push({ name, gender, payment, price });
        await user.save();
        res.status(200).json({ message: 'Appointment booked successfully', user });
    } catch (err) {
        res.status(401).json("Internal server error")
    }

})
module.exports = router;
