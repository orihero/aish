import mongoose from 'mongoose';
import { Skill } from '../models/skill.model.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const deviconJsonUrl = 'https://raw.githubusercontent.com/devicons/devicon/master/devicon.json';

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear skills collection
    await Skill.deleteMany({});
    console.log('Cleared skills collection');

    // Fetch devicon.json
    const response = await axios.get(deviconJsonUrl);
    const devicons = response.data;

    // Transform devicons into skills
    const skills = devicons.map(icon => {
      const baseUrl = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';
      const iconName = icon.name;
      const version = icon.versions.svg[0]; // Use the first available SVG version
      const iconUrl = `${baseUrl}/${iconName}/${iconName}-${version}.svg`;

      // Filter aliases to only include string values
      const stringAliases = [...(icon.altnames || []), ...(icon.aliases || [])]
        .filter(alias => typeof alias === 'string');

      return {
        name: icon.name,
        icon: iconUrl,
        category: icon.tags[0] || 'Other', // Use first tag as category
        aliases: stringAliases
      };
    });

    // Create skills
    await Skill.create(skills);
    console.log(`Created ${skills.length} skills`);

    console.log('Icon seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Icon seed failed:', error);
    process.exit(1);
  }
}

seed(); 