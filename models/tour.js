import mongoose from 'mongoose';

const tourSchema = mongoose.Schema({
  title: { type: String },
  description: { type: String },
  name: { type: String },
  author: { type: String },
  tags: { type: [String] },
  imageFile: { type: String },
  likes: { type: [], default: [], index: true },
  createdAt: { type: Date, default: new Date() },
});

tourSchema.index({ likes: 1 });

export default mongoose.model('Tour', tourSchema);
