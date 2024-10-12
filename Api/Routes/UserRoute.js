const mongoose = require('mongoose');

const express = require('express');
const User = require('../Model/UserModel');
const app = express();
const jwt = require('jsonwebtoken');
const router = express.Router();
const cookieparser = require('cookie-parser');
const bcrypt = require('bcrypt');
//const PostModel = require('../Model/PostModel');
app.use(cookieparser());
//const salt = bcrypt.genSalt(10);
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const isexist = await User.findOne({
      username,
    });

    if (isexist) {
      return res.status(404).json({
        message: 'duplicate username',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    //console.log(req.body);
    const User1 = new User({
      username,
      password: hashedPassword,
    });
    const newuser = await User1.save();
    res.status(201).json({
      message: 'user added successfuly',
      newuser,
    });
  } catch (err) {
    //console.log(err);
    res.status(500).json({
      message: 'inter error',
    });
  }
});
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const isexist = await User.findOne({ username });
  //console.log(isexist);
  if (!isexist) {
    return res.status(400).json({
      message: 'not found',
    });
  }
  const passok = await bcrypt.compare(password, isexist.password);
  //console.log(passok);
  if (passok) {
    jwt.sign(
      { username, id: isexist._id },
      process.env.SECRET_KEY,
      {},
      (err, token) => {
        //console.log(token);
        if (err) throw err;
        res.cookie('token', token).json({
          id: isexist._id,
          username,
        });
        //return res.json(token);
      }
    );
  } else {
    res.status(404).json({
      message: 'wrong crendials',
    });
  }
});

router.get('/profile', (req, res) => {
  const { token } = req.cookies;
  //console.log(token);
  jwt.verify(token, process.env.SECRET_KEY, {}, (err, info) => {
    if (err) throw err;
    //console.log(info);
    res.status(200).json(info);
  });
});

router.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
});

module.exports = router;
