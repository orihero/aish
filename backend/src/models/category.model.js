import mongoose from 'mongoose';

const translationSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

const categorySchema = new mongoose.Schema({
  title: [translationSchema],
  icon: {
    type: String,
    required: true
  },
  subcategories: [{
    title: [translationSchema],
    icon: String
  }]
}, {
  timestamps: true
});

export const Category = mongoose.model('Category', categorySchema);