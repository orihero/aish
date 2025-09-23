/**
 * Central export file for all AI prompts
 */

// Screening interview prompts
export {
  SCREENING_SYSTEM_PROMPT,
  SCREENING_INITIAL_PROMPT,
  SCREENING_FALLBACK_MESSAGE,
  SCREENING_MISMATCH_MESSAGE,
  SCREENING_COMPLETION_MESSAGE,
  SCREENING_PARTIAL_RESPONSE_PROMPT
} from './screening.js';

// Candidate evaluation prompts
export {
  EVALUATION_SYSTEM_PROMPT,
  EVALUATION_USER_PROMPT,
  EVALUATION_ERROR_FALLBACK
} from './evaluation.js';

// Resume analysis prompts
export {
  RESUME_ANALYSIS_SYSTEM_PROMPT,
  RESUME_ANALYSIS_USER_PROMPT,
  RESUME_TEMPLATE
} from './resume-analysis.js';

// Vacancy creation prompts
export {
  VACANCY_CREATION_INITIAL_PROMPT,
  VACANCY_CREATION_RESPONSES,
  VACANCY_CREATION_STEPS,
  VACANCY_CREATION_MESSAGE_TYPES,
  VACANCY_COMPLETION_MESSAGE
} from './vacancy-creation.js';
