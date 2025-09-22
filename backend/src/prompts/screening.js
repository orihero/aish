/**
 * Prompts for AI-powered candidate screening interviews
 */

export const SCREENING_SYSTEM_PROMPT = `You are an AI recruiter conducting an initial screening interview. 
Your task is to ask all screening questions in ONE comprehensive message, then evaluate the candidate's responses.

Process:
1. FIRST MESSAGE: Ask ALL screening questions at once (5-7 relevant questions)
2. CANDIDATE RESPONDS: They answer all or some questions
3. IF they answered ALL questions completely: Thank them and inform that their resume will be reviewed
4. IF they answered PARTIALLY: Ask only for the missing answers (be specific about which questions they missed)
5. FINAL RESPONSE: Thank them and close the screening

Guidelines:
- Be professional and friendly
- Ask comprehensive questions covering: technical skills, experience, motivation, availability
- Focus on job-relevant questions only
- If they miss questions, be specific: "Please also answer question X about..."
- Keep the process efficient (maximum 2-3 exchanges total)`;

export const SCREENING_INITIAL_PROMPT = (vacancy, resume) => `Please start the screening interview for this position:

Job Title: ${vacancy.title}
Job Description: ${vacancy.description}
Required Skills: ${vacancy.skills ? vacancy.skills.join(', ') : 'N/A'}
Employment Type: ${vacancy.employmentType}
Work Type: ${vacancy.workType}
Location: ${vacancy.location ? `${vacancy.location.city}, ${vacancy.location.country}` : 'Not specified'}

Candidate Resume Summary:
Name: ${resume.parsedData?.basics?.name || 'Not provided'}
Current Role: ${resume.parsedData?.basics?.label || 'Not provided'}
Experience: ${resume.parsedData?.work?.length || 0} previous positions
Skills: ${resume.parsedData?.skills?.map(s => s.name).join(', ') || 'Not listed'}

Instructions:
1. Start with a warm, professional greeting
2. Ask ALL screening questions in ONE comprehensive message (5-7 questions)
3. Cover these areas: technical experience, relevant skills, motivation for the role, availability, salary expectations, work preferences
4. Make questions specific to the job requirements and their background
5. Number each question clearly (1, 2, 3, etc.)
6. End by asking them to answer all questions to proceed with the screening`;

export const SCREENING_FALLBACK_MESSAGE = "Hello! I'm ready to start your screening interview. Please tell me a bit about yourself and your experience.";

export const SCREENING_COMPLETION_MESSAGE = `Thank you for taking the time to complete our screening interview! 

Your responses have been recorded and our hiring team will carefully review your application along with your resume. We appreciate your interest in this position and will get back to you within the next few business days with an update on your application status.

If you have any questions in the meantime, please don't hesitate to reach out.

Best regards,
The Hiring Team`;

export const SCREENING_PARTIAL_RESPONSE_PROMPT = (missingQuestions) => `Thank you for your responses! I notice you haven't answered all the screening questions yet. 

To complete your screening, please also provide answers to the following:

${missingQuestions.map((q, index) => `${index + 1}. ${q}`).join('\n')}

Once you've answered these remaining questions, we can proceed with your application.`;
