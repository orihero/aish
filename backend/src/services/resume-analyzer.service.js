import axios from 'axios';

export async function analyzeResume(text) {
  if (!text) {
    throw new Error('Resume text is required');
  }

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

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
      
      // Try to extract JSON if it's wrapped in backticks
      const jsonMatch = content.match(/```json\n?(.*)\n?```/s);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content;
      
      const rawResponse = JSON.parse(jsonStr);
      
      // Validate and fix response structure
      parsedResponse = {
        ...template,
        ...rawResponse,
        skills: (rawResponse.skills || []).map(skill => {
          if (typeof skill === 'string') {
            return {
              name: skill,
              level: 'Intermediate',
              keywords: [skill]
            };
          }
          return {
            name: skill.name || '',
            level: skill.level || 'Intermediate',
            keywords: Array.isArray(skill.keywords) ? skill.keywords : [skill.name || '']
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

      // Final validation
      if (!parsedResponse.basics || !Array.isArray(parsedResponse.skills)) {
        console.error('Invalid response structure:', parsedResponse);
        throw new Error('Invalid response structure');
      }
      
      return parsedResponse;
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.log('Raw AI response:', response.data.choices[0].message.content);
      throw new Error('Failed to parse resume data');
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