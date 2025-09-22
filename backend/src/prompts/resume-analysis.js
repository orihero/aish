/**
 * Prompts for AI-powered resume analysis and parsing
 */

export const RESUME_ANALYSIS_SYSTEM_PROMPT = `You are a professional resume parser. Your task is to extract information from resumes into a specific JSON format.

Important formatting rules:
1. Skills must be objects with "name", "level", and "keywords" properties
2. Languages must be objects with "language" and "fluency" properties
3. Work experience must include "name", "position", "startDate", "endDate", and "summary"
4. Education must include "institution", "area", "studyType", "startDate", and "endDate"
5. Skill names must match exactly with the devicon library names (e.g., "JavaScript", "React", "Node.js", "Python")
6. Use standard skill names from devicon library for consistency
7. Extract dates in YYYY-MM-DD format when possible
8. For skills level, use: "Beginner", "Intermediate", "Advanced", or "Expert"
9. For language fluency, use: "Basic", "Intermediate", "Fluent", or "Native"

Example skill format:
{
  "name": "JavaScript",
  "level": "Advanced",
  "keywords": ["ES6", "React", "Node.js"]
}

Example language format:
{
  "language": "English",
  "fluency": "Fluent"
}

Always return valid JSON that matches the template structure exactly. Do not include any explanatory text or markdown.`;

export const RESUME_ANALYSIS_USER_PROMPT = (resumeText, template) => `Extract information from this resume text and return it in the following JSON structure. 
Follow the formatting rules exactly, especially for skills and languages. Include all fields, leaving them empty if not found:

Template Structure:
${JSON.stringify(template, null, 2)}

Resume text:
${resumeText}

Return ONLY the JSON object, no other text.`;

// Default resume template structure
export const RESUME_TEMPLATE = {
  basics: {
    name: "",
    label: "",
    email: "",
    phone: "",
    url: "",
    summary: "",
    location: {
      address: "",
      postalCode: "",
      city: "",
      countryCode: "",
      region: ""
    },
    profiles: []
  },
  work: [],
  volunteer: [],
  education: [],
  awards: [],
  certificates: [],
  publications: [],
  skills: [],
  languages: [],
  interests: [],
  references: [],
  projects: []
};
