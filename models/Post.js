const mongoose = require('mongoose');

// Define the schema for Post model
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topic: { type: String, enum: ['Politics', 'Health', 'Sport', 'Tech'], required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expirationTime: { type: Date, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Live', 'Expired'], default: 'Live' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

// Middleware to set status to "Expired" when the expiration time is reached
postSchema.pre('save', function (next) {
  if (this.expirationTime < Date.now()) {
    this.status = 'Expired';
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
