// models/Post.ts

import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
