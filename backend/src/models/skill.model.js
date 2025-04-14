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
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Programming Languages',
      'Frontend',
      'Backend',
      'DevOps',
      'Design',
      'Cloud',
      'Mobile',
      'Data Science',
      'Security',
      'Other'
    ]
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

// Create text index for search
skillSchema.index({ 
  name: 'text',
  aliases: 'text'
});

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

export default Skill; 