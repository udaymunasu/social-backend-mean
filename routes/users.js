const express = require('express');
let User = require('../models/user');
const fs = require('fs');

const router = express.Router();

// Route to handle user registration
router.post("/register", async (req, res) => {
  try {
    let body = req.body;
    let user = new User();

    user.name = body.name;
    user.email = body.email;
    user.password = body.password;
    let base64image = body.profilePic;
    console.log("base64image",body.profilePic, base64image);
    
    if (base64image) {
      const randomname = (Math.random() + 1).toString(36).substring(7);
      const imageData = base64image.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(imageData, 'base64');
      user.profilePic = `profilePic/${randomname}.jpg`;
      fs.writeFile(`assets/${user.profilePic}`, imageBuffer, (err) => {
        if (err) {
          console.log('Error while saving image:', err);
          return res.status(500).json({ status: 'failed', data: 'Failed to save image' });
        }
      });
    }

    console.log(user, user.profilePic);
    user.save().then(result => {
      res.end(JSON.stringify({ status: "success", data: result }));
    }).catch(err => { // Use .catch() for promise rejection
      res.end(JSON.stringify({ status: "failed", data: err }));
    });
  }
  catch (err) { // Include the error parameter in the catch block
    console.error(err);
    res.end(JSON.stringify({ status: "failed", data: "Something went wrong" }));
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      // User not found
      return res.status(404).json({ status: 'failed', data: 'User not found' });
    }

    // For a real application, use a proper password hashing library
    if (user.password !== password) {
      // Passwords don't match
      return res.status(401).json({ status: 'failed', data: 'Invalid password' });
    }

    // Passwords match, you can consider generating and returning a JWT token here for authentication
    // For example:
    // const token = generateAuthToken(user);

    res.status(200).json({ status: 'success', data: 'Login successful', user: user /*, token */ });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'failed', data: 'Login failed' });
  }
});


// Define a route to get all users
router.get('/list', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database

    // Modify each user object to include the image URL relative to the 'uploads' folder
    const usersWithImages = users.map(user => {
      const userWithImage = user.toJSON();
      userWithImage.profilePic = `http://localhost:3000/${user.profilePic}`;
      return userWithImage;
    });
    res.status(200).json(usersWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ status: 'success', data: user });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});



module.exports = router;
