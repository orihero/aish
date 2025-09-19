# Business Registration Feature

This document describes the business registration feature implemented for the admin panel.

## Overview

The business registration feature allows companies to register on the platform as employers. It includes a comprehensive multi-step form that collects both user account information and detailed company information.

## Features

### Frontend Components

1. **BusinessRegistrationForm** (`admin/src/pages/Register/components/BusinessRegistrationForm.tsx`)
   - Multi-step form with account creation and company details
   - Form validation and error handling
   - Logo upload functionality
   - Dynamic benefits management
   - Social media links
   - Location and contact information

2. **Updated Register Page** (`admin/src/pages/Register.tsx`)
   - Added business registration flow
   - Integrated with existing employee registration
   - Role-based routing

3. **Updated Auth Store** (`admin/src/stores/auth.store.ts`)
   - Added `registerBusiness` function
   - Business registration data interface
   - Error handling and loading states

### Backend Implementation

1. **Auth Controller** (`backend/src/controllers/auth.controller.js`)
   - `registerBusiness` function
   - Creates both user and company records
   - Comprehensive logging
   - Error handling

2. **Routes** (`backend/src/routes/auth.routes.js`)
   - `/api/auth/register-business` endpoint
   - POST method for business registration

## Data Structure

### Business Registration Data

```typescript
interface BusinessRegistrationData {
  // User account details
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  
  // Company details
  company: {
    name: string;
    description: string;
    industry: string;
    size: '1-50' | '51-200' | '201-1000' | '1000-5000' | '5000+';
    founded?: number;
    website?: string;
    location: {
      country: string;
      city: string;
      address?: string;
    };
    contact: {
      email: string;
      phone?: string;
    };
    social?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
    };
    benefits: string[];
  };
}
```

## Form Steps

### Step 1: Account Creation
- First Name (required)
- Last Name (required)
- Email Address (required)
- Phone Number (optional)
- Password (required)

### Step 2: Company Information
- Company Logo (optional)
- Company Name (required)
- Industry (required)
- Company Size (optional)
- Founded Year (optional)
- Company Description (optional)
- Website (optional)

### Step 3: Location
- Country (optional)
- City (optional)
- Address (optional)

### Step 4: Contact Information
- Contact Email (optional)
- Contact Phone (optional)

### Step 5: Social Media (Optional)
- LinkedIn
- Twitter
- Facebook
- Instagram

### Step 6: Company Benefits
- Dynamic list of benefits
- Add/remove functionality

## API Endpoint

### POST `/api/auth/register-business`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@company.com",
  "password": "password123",
  "phone": "+1234567890",
  "company": {
    "name": "Acme Corporation",
    "description": "A leading technology company",
    "industry": "Technology",
    "size": "1-50",
    "founded": 2020,
    "website": "https://acme.com",
    "location": {
      "country": "United States",
      "city": "San Francisco",
      "address": "123 Main Street"
    },
    "contact": {
      "email": "contact@acme.com",
      "phone": "+1234567890"
    },
    "social": {
      "linkedin": "https://linkedin.com/company/acme",
      "twitter": "https://twitter.com/acme"
    },
    "benefits": ["Health Insurance", "Remote Work"]
  }
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "john@company.com",
    "phone": "+1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "role": "employer"
  },
  "company": {
    "id": "company_id",
    "name": "Acme Corporation",
    "status": "pending"
  },
  "token": "jwt_token"
}
```

## Validation Rules

### User Account
- First Name: Required, non-empty string
- Last Name: Required, non-empty string
- Email: Required, valid email format
- Password: Required, minimum 8 characters
- Phone: Optional, valid phone format

### Company Information
- Company Name: Required, non-empty string
- Industry: Required, must be from predefined list
- All other fields: Optional

## Error Handling

The system handles various error scenarios:

1. **Duplicate User**: If email or phone already exists
2. **Validation Errors**: Invalid form data
3. **Server Errors**: Database or server issues
4. **Network Errors**: Connection problems

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt
2. **JWT Tokens**: Secure authentication tokens
3. **Input Validation**: Server-side validation
4. **SQL Injection Protection**: Using Mongoose ODM

## Testing

A test script is provided (`backend/test-business-registration.js`) to verify the endpoint functionality.

To run the test:
```bash
cd backend
node test-business-registration.js
```

## Usage

1. Navigate to the registration page
2. Click "Join as Business"
3. Fill in account details
4. Complete company information
5. Submit the form
6. User is automatically logged in and redirected to dashboard

## Future Enhancements

1. **Email Verification**: Send verification emails
2. **Company Approval**: Admin approval workflow
3. **Logo Upload**: File upload functionality
4. **Multi-language Support**: Internationalization
5. **Advanced Validation**: More sophisticated validation rules
6. **Analytics**: Track registration metrics
