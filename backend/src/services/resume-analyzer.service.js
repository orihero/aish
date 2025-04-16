import axios from 'axios';

// Fetch devicon skills for normalization
async function getDeviconSkills() {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/devicons/devicon/master/devicon.json');
    return response.data.map(icon => ({
      name: icon.name,
      aliases: [...(icon.altnames || []), ...(icon.aliases || [])]
        .filter(alias => typeof alias === 'string')
    }));
  } catch (error) {
    console.error('Failed to fetch devicon skills:', error);
    return [];
  }
}

// Normalize skill name to match devicon
function normalizeSkillName(skillName, deviconSkills) {
  if (!skillName) return '';
  
  const lowerSkillName = skillName.toLowerCase().trim();
  
  // First try exact match
  const exactMatch = deviconSkills.find(skill => 
    skill.name.toLowerCase() === lowerSkillName
  );
  if (exactMatch) return exactMatch.name;
  
  // Then try alias match
  const aliasMatch = deviconSkills.find(skill => 
    skill.aliases.some(alias => alias.toLowerCase() === lowerSkillName)
  );
  if (aliasMatch) return aliasMatch.name;
  
  // If no match found, return original name
  return skillName;
}

export async function analyzeResume(text) {
  if (!text) {
    throw new Error('Resume text is required');
  }

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  // Fetch devicon skills for normalization
  const deviconSkills = await getDeviconSkills();

  const template = {
    basics: {
      name: '',
      label: '',
      image: '',
      email: '',
      phone: '',
      url: '',
      summary: '',
      location: {
        address: '',
        postalCode: '',
        city: '',
        region: '',
        countryCode: ''
      },
      profiles: []
    },
    work: [],
    volunteer: [],
    education: [],
    certifications: [],
    awards: [],
    publications: [],
    skills: [],
    languages: [],
    interests: [],
    projects: [],
    references: []
  };

  try {
    const response = await axios.post(process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions', {
      model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1-distill-llama-70b:free',
      messages: [
        {
          role: 'system',
          content: `You are a professional resume parser. Your task is to extract information from resumes into a specific JSON format.

Important formatting rules:
1. Skills must be objects with "name", "level", and "keywords" properties
2. Languages must be objects with "language" and "fluency" properties
3. Work experience must include "name", "position", "startDate", "endDate", and "summary"
4. Education must include "institution", "area", "studyType", "startDate", and "endDate"
5. Skill names must match exactly with the devicon library names (e.g., "JavaScript", "React", "Node.js", "Python")
6. Use standard skill names from devicon library for consistency

Example skill format:
{
  "name": "JavaScript",
  "level": "Advanced",
  "keywords": ["ES6", "React", "Node.js"]
}

Always return valid JSON that matches the template structure exactly. Do not include any explanatory text or markdown.`
        },
        {
          role: 'user',
          content: `Extract information from this resume text and return it in the following JSON structure. 
Follow the formatting rules exactly, especially for skills and languages. Include all fields, leaving them empty if not found:

${JSON.stringify(template, null, 2)}

Resume text:
${text}

Return ONLY the JSON object, no other text.`
        }
      ],
      temperature: parseFloat(process.env.OPENROUTER_TEMPERATURE || '0.1')
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.SITE_URL || 'http://localhost:5000',
        'X-Title': 'Resume Parser'
      }
    });

    let parsedResponse;
    try {
      const content = response.data.choices[0].message.content.trim();
      
      // Try to extract JSON from markdown code blocks or raw content
      let jsonStr = content;
      
      // Handle markdown code blocks with optional language specifier
      const jsonMatch = content.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      }
      
      // Remove any remaining markdown formatting
      jsonStr = jsonStr.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      
      try {
        const rawResponse = JSON.parse(jsonStr);
        
        // Validate and fix response structure
        parsedResponse = {
          ...template,
          ...rawResponse,
          skills: (rawResponse.skills || []).map(skill => {
            if (typeof skill === 'string') {
              const normalizedName = normalizeSkillName(skill, deviconSkills);
              return {
                name: normalizedName,
                level: 'Intermediate',
                keywords: [normalizedName]
              };
            }
            const normalizedName = normalizeSkillName(skill.name, deviconSkills);
            return {
              name: normalizedName,
              level: skill.level || 'Intermediate',
              keywords: Array.isArray(skill.keywords) ? skill.keywords : [normalizedName]
            };
          }),
          languages: (rawResponse.languages || []).map(lang => {
            if (typeof lang === 'string') {
              return {
                language: lang,
                fluency: 'Conversational'
              };
            }
            return {
              language: lang.language || '',
              fluency: lang.fluency || 'Conversational'
            };
          })
        };
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Attempted to parse:', jsonStr);
        throw new Error(`Failed to parse JSON response: ${parseError.message}`);
      }
      
      // Final validation
      if (!parsedResponse.basics || !Array.isArray(parsedResponse.skills)) {
        console.error('Invalid response structure:', parsedResponse);
        throw new Error('Invalid response structure: missing required fields');
      }
      
      return parsedResponse;
    } catch (error) {
      console.error('Failed to process AI response:', error);
      console.log('Raw AI response:', response.data.choices[0].message.content);
      throw new Error(`Failed to process resume data: ${error.message}`);
    }
  } catch (error) {
    if (error.response?.data) {
      console.error('OpenRouter API error:', error.response.data);
    } else {
      console.error('Resume analysis error:', error.message);
    }
    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
}