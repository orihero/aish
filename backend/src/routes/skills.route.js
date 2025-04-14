import express from 'express';
import Skill from '../models/skill.model.js';

const router = express.Router();

// Get all skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find({});
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills', error: error.message });
  }
});

// Bulk lookup skill icons
router.post('/icons', async (req, res) => {
  try {
    const { skills } = req.body;
    
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills must be an array of skill names' });
    }

    // Normalize skill names to lowercase for case-insensitive matching
    const normalizedSkills = skills.map(s => s.toLowerCase());

    // Find all skills that match either the name or aliases
    const foundSkills = await Skill.find({
      $or: [
        { name: { $in: normalizedSkills.map(s => new RegExp('^' + s + '$', 'i')) } },
        { aliases: { $in: normalizedSkills.map(s => new RegExp('^' + s + '$', 'i')) } }
      ]
    });

    // Create a map of skill names and their aliases to icons
    const iconMap = new Map();
    foundSkills.forEach(skill => {
      // Add the main skill name
      iconMap.set(skill.name.toLowerCase(), skill.icon);
      // Add all aliases
      skill.aliases.forEach(alias => {
        iconMap.set(alias.toLowerCase(), skill.icon);
      });
    });

    // Create the response mapping
    const result = {};
    normalizedSkills.forEach(skillName => {
      result[skillName] = iconMap.get(skillName) || '/default-skill.svg';
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error looking up skill icons', error: error.message });
  }
});

// Search skills by name or alias
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const skills = await Skill.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { aliases: { $regex: query, $options: 'i' } }
      ]
    });

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error searching skills', error: error.message });
  }
});

// Get skill by ID
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skill', error: error.message });
  }
});

export default router; 