// controllers/userController.js

const bcrypt = require('bcrypt');
const User = require('../models/user');

//Files management
var fs = require('fs');
var path = require('path');

//TESTS
function testing(req, res) {
  res.status(200).send({
    message: 'Test page'
  });
};


//SAVE USER
async function saveUser(req, res) {
  try {
    const params = req.body;
    const user = new User();


    user.name = params.name;
    user.surname = params.surname;
    user.nick = params.nick;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = null;

    console.log("users", user)

    const existingUser = await User.findOne({
      $or: [{ email: user.email.toLowerCase() }, { nick: user.nick.toLowerCase() }],
    });

    if (existingUser) {
      return res.status(200).send({ message: 'The user already exists. Try another nickname or email.' });
    }

    const hash = await bcrypt.hash(params.password, 10);
    user.password = hash;

    const userStored = await user.save();

    if (userStored) {
      return res.status(200).send({ user: userStored });
    } else {
      return res.status(404).send({ message: 'User not saved' });
    }
  } catch (error) {
    return res.status(500).send({ message: 'Error in the request' });
  }
}

async function loginUser(req, res) {
  try {
    const params = req.body;
    const email = params.email;
    const password = params.password;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: 'The user doesn´t exist' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      if (params.gettoken) {
        // Return Token
        const token = jwt.createToken(user);
        return res.status(200).send({ token });
      } else {
        // SECURITY MEASURE: DO NOT SEND USER PASSWORDS
        user.password = undefined;
        return res.status(200).send({ user });
      }
    } else {
      // The password is incorrect
      return res.status(404).send({ message: 'The password doesn´t match' });
    }
  } catch (error) {
    return res.status(500).send({ message: 'An error has occurred' });
  }
}

async function getUser(req, res) {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: 'User doesn´t exist' });
    }

    const value = await followThisUser(req.user.sub, userId);

    // SECURITY MEASURE: DO NOT SEND USER PASSWORDS
    user.password = undefined;

    return res.status(200).send({
      user,
      following: value.following,
      followed: value.followed,
    });
  } catch (error) {
    return res.status(500).send({ message: 'Request error' });
  }
}


module.exports = {
  saveUser,
  loginUser,
  getUser,
};