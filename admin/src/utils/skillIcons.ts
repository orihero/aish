// Default icon will be handled via URL

// This is a temporary mapping. In the future, this could be fetched from an API or CDN
export const skillIconMap: { [key: string]: string } = {
  'javascript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'typescript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'react': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'node': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'html5': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'css3': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
};

export function getSkillIcon(skillName: string): string {
  const normalizedSkillName = skillName.toLowerCase().trim();
  return skillIconMap[normalizedSkillName] || '/default-skill.svg';
}

// Function to check if an icon exists for a skill
export function hasSkillIcon(skillName: string): boolean {
  const normalizedSkillName = skillName.toLowerCase().trim();
  return normalizedSkillName in skillIconMap;
} 