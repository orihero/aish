import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  icon: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  aliases: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create text index for searching
skillSchema.index({ name: 'text', aliases: 'text' });

// Method to find skill by name or alias
skillSchema.statics.findByNameOrAlias = async function(query) {
  const normalizedQuery = query.toLowerCase().trim();
  return this.findOne({
    $or: [
      { name: { $regex: new RegExp('^' + normalizedQuery + '$', 'i') } },
      { aliases: { $regex: new RegExp('^' + normalizedQuery + '$', 'i') } }
    ]
  });
};

const Skill = mongoose.model('Skill', skillSchema);

export { Skill }; 