const multer = require('multer');
const express = require('express');
const fs = require('fs');
const PostModel = require('../Model/PostModel');
//const { default: Post } = require('../../Frontend/src/Component/Post');
const jwt = require('jsonwebtoken');
const { console } = require('inspector');
// Create an instance of express router
const router1 = express.Router();

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to save the uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

// Initialize Multer with the storage configuration
const uploadmiddleware = multer({ storage: storage });

// Define the route for file upload
router1.post('/post', uploadmiddleware.single('file'), async (req, res) => {
  const { originalname, path } = req.file;
  // console.log(originalname);
  const parts = originalname.split('.');
  //console.log(parts);
  const ext = parts[parts.length - 1];
  const newpath = path + '.' + ext;
  fs.renameSync(path, newpath);
  const { token } = req.cookies;
  //console.log(token);
  jwt.verify(token, process.env.SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const newpost = await PostModel.create({
      title,
      summary,
      content,
      cover: newpath,
      author: info.id,
    });
    //await (await newpost).save();
    //console.log(info);
    res.status(200).json(info);
  });

  // await (await newpost).save();
  //await newpost.save();
  //res.json('ok');
});
router1.get('/get_post', async (req, res) => {
  res.json(await PostModel.find().populate('author', ['username']));
});

router1.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  //const newpost = await PostModel.findById(id).populate('author', ['Username']);
  const newpost = await PostModel.findById(id).populate('author', 'username'); // Use space to separate fields
  console.log(newpost);
  res.json(newpost);
});

// Export the router
module.exports = router1;
