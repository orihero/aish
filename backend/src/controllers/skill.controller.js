import { Skill } from '../models/skill.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';

// Helper function to normalize skill data
const normalizeSkillData = (data) => {
  const normalized = { ...data };
  if (normalized.name) {
    normalized.name = normalized.name.toLowerCase().trim();
  }
  if (normalized.aliases) {
    normalized.aliases = normalized.aliases.map(alias => alias.toLowerCase().trim());
  }
  return normalized;
};

// Create a new skill
export const createSkill = async (req, res) => {
  try {
    const normalizedData = normalizeSkillData(req.body);
    const skill = new Skill(normalizedData);
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all skills
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({});
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single skill by ID
export const getSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a skill
export const updateSkill = async (req, res) => {
  try {
    const normalizedData = normalizeSkillData(req.body);
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      normalizedData,
      { new: true, runValidators: true }
    );
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a skill
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get icon URLs for a list of skills
export const getSkillIcons = async (req, res) => {
  try {
    const { skills } = req.body;
    
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills must be provided as an array' });
    }

    // Normalize all skill names to lowercase
    const normalizedSkills = skills.map(skill => skill.toLowerCase().trim());

    // Find skills by name or aliases
    const skillDocs = await Skill.find({
      $or: [
        { name: { $in: normalizedSkills } },
        { aliases: { $in: normalizedSkills } }
      ]
    });

    // Create a map of all possible matches (name and aliases)
    const iconMap = {};
    skillDocs.forEach(skill => {
      // Add the main skill name
      iconMap[skill.name] = skill.icon;
      // Add all aliases
      skill.aliases.forEach(alias => {
        iconMap[alias] = skill.icon;
      });
    });

    // Create response with original case preserved
    const response = {};
    skills.forEach(skill => {
      const normalized = skill.toLowerCase().trim();
      response[skill] = iconMap[normalized] || null;
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 