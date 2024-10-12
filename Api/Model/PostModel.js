const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true, // This option adds createdAt and updatedAt fields
  }
);

// Export the model
const PostModel = mongoose.model('PostModel', PostSchema);
module.exports = PostModel;
