import { body, param, query, validationResult } from 'express-validator';

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      message: 'Validation Error',
      errors: errors.array()
    });
  };
};

export const vacancyValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('salary.min').isNumeric().withMessage('Minimum salary must be a number'),
  body('salary.max').isNumeric().withMessage('Maximum salary must be a number'),
  body('employmentType').isIn(['full-time', 'part-time', 'contract']).withMessage('Invalid employment type'),
  body('workType').isIn(['remote', 'hybrid', 'onsite']).withMessage('Invalid work type')
];

export const resumeValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
];

export const applicationStatusValidation = [
  body('status').isIn(['pending', 'reviewed', 'accepted', 'rejected']).withMessage('Invalid status')
];