import { ArrowRight, Building2, Facebook, Github, Loader2, Mail, Twitter, User2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'
import { api } from '../lib/axios'
import { useAuthStore } from '../stores/auth.store'
import { ResumeUpload } from './Profile/components/ResumeUpload'
import { ManualResumeForm } from './Register/components/ManualResumeForm'
import { ResumePreview } from './Register/components/ResumePreview'

type Step = 'role' | 'upload' | 'manual' | 'preview' | 'account' | 'details' | 'resume'

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'employer' | 'employee';
  resumeData?: ResumeData;
  resumeFile?: {
    url: string;
    filename: string;
  };
}

interface Profile {
  network: string;
  username: string;
  url: string;
}

interface Certification {
  name: string;
  date: string;
  issuer: string;
  url: string;
}

interface Award {
  title: string;
  date: string;
  awarder: string;
  summary: string;
}

interface Publication {
  name: string;
  publisher: string;
  releaseDate: string;
  url: string;
  summary: string;
}

interface Interest {
  name: string;
  keywords: string[];
}

interface Reference {
  name: string;
  reference: string;
}

interface ResumeAnalysisResponse {
  basics: {
    name: string;
    label: string;
    image: string;
    email: string;
    phone: string;
    url: string;
    summary: string;
    location: {
      address: string;
      postalCode: string;
      city: string;
      region: string;
      countryCode: string;
    };
    profiles: Profile[];
  };
  work: Array<{
    name: string;
    position: string;
    startDate: string;
    endDate: string;
    summary: string;
  }>;
  volunteer: Array<{
    organization: string;
    position: string;
    startDate: string;
    endDate: string;
    summary: string;
  }>;
  education: Array<{
    institution: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate: string;
  }>;
  certifications: Certification[];
  awards: Award[];
  publications: Publication[];
  skills: Array<{
    name: string;
    level: string;
    keywords: string[];
  }>;
  languages: Array<{
    language: string;
    fluency: string;
  }>;
  interests: Interest[];
  projects: Array<{
    name: string;
    description: string;
    highlights: string[];
    keywords: string[];
    startDate: string;
    url: string;
  }>;
  references: Reference[];
}

export interface ResumeData {
  basics: {
    name: string;
    label: string;
    email: string;
    phone: string;
    summary?: string;
    image?: string;
    location: {
      city: string;
      countryCode: string;
    };
  };
  work: Array<{
    name: string;
    position: string;
    startDate: string;
    endDate: string;
    summary: string;
    highlights: string[];
    technologies: string[];
  }>;
  education: Array<{
    institution: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
  skills: Array<{
    name: string;
    level: string;
    keywords: string[];
  }>;
  projects?: Array<{
    name: string;
    description?: string;
    highlights?: string[];
    keywords?: string[];
    startDate?: string;
    url?: string;
  }>;
  cvFile?: {
    url: string;
    filename: string;
  };
}

const initialResumeData: ResumeData = {
  basics: {
    name: '',
    label: '',
    email: '',
    phone: '',
    location: {
      city: '',
      countryCode: ''
    },
  },
  work: [],
  education: [],
  skills: [],
  projects: []
};

export function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>('role')
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'employee'
  })
  const { register, isLoading, error, clearError } = useAuthStore()
  const { t } = useTranslation()
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeFile, setResumeFile] = useState<{ url: string; filename: string } | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!resumeFile?.url || !resumeFile?.filename) {
        throw new Error('Resume file information is missing')
      }
      await register({
        ...formData,
        resumeData,
        resumeFile
      })
      navigate('/dashboard')
    } catch (error) {
      // Error is handled by the store
    }
  }

  const handleUploadResume = async (file: File) => {
    try {
      setIsAnalyzing(true);
      const formData = new FormData();
      formData.append('cvFile', file);

      const response = await api.post<{ 
        success: boolean; 
        data?: ResumeAnalysisResponse; 
        fileUrl?: string; 
        fileName?: string;
        error?: string;
      }>('/resumes/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to analyze resume');
      }

      if (!response.data.fileUrl || !response.data.fileName) {
        throw new Error('Failed to get file information from server')
      }

      const fileInfo = {
        url: response.data.fileUrl,
        filename: response.data.fileName
      };
      setResumeFile(fileInfo);

      // Transform the API response to match our ResumeData structure
      const parsedData: ResumeData = {
        basics: {
          name: response.data.data?.basics?.name || 'No Name',
          label: response.data.data?.basics?.label || 'No Title',
          email: response.data.data?.basics?.email || '',
          phone: response.data.data?.basics?.phone || '',
          summary: response.data.data?.basics?.summary || '',
          image: response.data.data?.basics?.image || '',
          location: {
            city: response.data.data?.basics?.location?.city || '',
            countryCode: response.data.data?.basics?.location?.countryCode || ''
          }
        },
        work: (response.data.data?.work || []).map(job => ({
          name: job.name || '',
          position: job.position || '',
          startDate: job.startDate || '',
          endDate: job.endDate || '',
          summary: job.summary || '',
          highlights: [], // API doesn't provide highlights
          technologies: [] // API doesn't provide technologies
        })),
        education: (response.data.data?.education || []).map(edu => ({
          institution: edu.institution || '',
          area: edu.area || '',
          studyType: edu.studyType || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          gpa: ''  // API doesn't provide GPA
        })),
        skills: (response.data.data?.skills || []).map(skill => ({
          name: skill.name || '',
          level: skill.level || 'Intermediate',
          keywords: skill.keywords || []
        })),
        projects: (response.data.data?.projects || []).map(project => ({
          name: project?.name || '',
          description: project?.description || '',
          highlights: project?.highlights || [],
          keywords: project?.keywords || [],
          startDate: project?.startDate || '',
          url: project?.url || ''
        }))
      };

      console.log('Transformed Resume Data:', parsedData);
      setResumeData(parsedData);
      setCurrentStep('preview');
    } catch (error: unknown) {
      console.error('Error uploading resume:', error);
      // Show error message to user
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze resume';
      if (errorMessage.includes('scanned document')) {
        // If it's a scanned PDF, suggest using manual form
        setCurrentStep('manual');
        // You might want to show a toast or alert here
        alert('The uploaded PDF appears to be a scanned document. Please fill in your resume details manually.');
      } else {
        // For other errors, show the error message
        alert(errorMessage || 'Failed to analyze resume. Please try again or use the manual form.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleManualResume = async (data: ResumeData) => {
    setResumeData(data);
    setCurrentStep('preview');
  };

  const handleContinue = async () => {
    setCurrentStep('details');
  };

  const renderContent = () => {
    if (isAnalyzing) {
      return (
        <div className="fixed inset-0 bg-[#111] text-white flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            <h2 className="text-xl font-semibold">Analyzing Resume...</h2>
            <p className="text-gray-400 text-sm">This may take a few moments</p>
          </div>
        </div>
      );
    }

    if (currentStep === 'preview') {
      return (
        <ResumePreview
          data={resumeData}
          resumeFile={resumeFile}
          onDownload={() => {
            // TODO: Implement PDF download
          }}
          onContinue={handleContinue}
        />
      )
    }

    if (currentStep === 'role') {
      return (
        <>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Join Our Platform 🚀
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Choose how you want to join our platform
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => {
                setCurrentStep('resume')
              }}
              className="w-full p-6 text-left border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200">
                    <User2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Join as Talent</h3>
                    <p className="text-sm text-gray-500">Find your dream job and grow your career</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500" />
              </div>
            </button>

            <button
              onClick={() => {
                setCurrentStep('details')
              }}
              className="w-full p-6 text-left border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Join as Business</h3>
                    <p className="text-sm text-gray-500">Post jobs and find the perfect candidates</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500" />
              </div>
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">{t('common.or')}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <a href="#" className="rounded-md p-2 hover:bg-gray-50">
                <Facebook className="h-5 w-5 text-blue-600" />
              </a>
              <a href="#" className="rounded-md p-2 hover:bg-gray-50">
                <Twitter className="h-5 w-5 text-blue-400" />
              </a>
              <a href="#" className="rounded-md p-2 hover:bg-gray-50">
                <Github className="h-5 w-5 text-gray-900" />
              </a>
              <a href="#" className="rounded-md p-2 hover:bg-gray-50">
                <Mail className="h-5 w-5 text-red-500" />
              </a>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
              Sign in instead
            </Link>
          </p>
        </>
      )
    }

    if (currentStep === 'resume') {
      return (
        <>
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <button
                onClick={() => setCurrentStep('role')}
                className="hover:text-gray-900"
              >
                ← Back
              </button>
              <span>•</span>
              <span>Resume Upload</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Upload Your Resume
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              First, let's get your resume details. You can upload a file or enter your information manually.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <ResumeUpload onUpload={handleUploadResume} error={null} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep('manual')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg"
            >
              Fill Profile Manually
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )
    }

    if (currentStep === 'manual') {
      return (
        <>
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <button
                onClick={() => setCurrentStep('resume')}
                className="hover:text-gray-900"
              >
                ← Back
              </button>
              <span>•</span>
              <span>Fill Resume Details</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Create Your Resume
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Fill in your professional details below
            </p>
          </div>

          <div className="mt-8">
            <ManualResumeForm onSubmit={handleManualResume} />
          </div>
        </>
      )
    }

    // Details step
    return (
      <>
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <button
              onClick={() => setCurrentStep('role')}
              className="hover:text-gray-900"
            >
              ← Back
            </button>
            <span>•</span>
            <span>Account Details</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Fill in your details to create your account
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
            <button
              onClick={clearError}
              className="float-right text-red-800 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="block w-full rounded-md border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="block w-full rounded-md border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full rounded-md border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                placeholder="johndoe@email.com"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="block w-full rounded-md border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
              >
                <span className="text-sm">
                  {showPassword ? 'Hide' : 'Show'}
                </span>
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full justify-center rounded-md bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Continue'}
            </button>
          </div>
        </form>
      </>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-purple-600 items-center justify-center">
        <div className="max-w-md px-8">
          <img
            src="/illustrations/register.svg"
            alt="Register illustration"
            className="w-full h-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-white">
            {t('common.welcome')}
          </h2>
          <p className="mt-2 text-purple-100">
            Join our platform and start your journey with us
          </p>
        </div>
      </div>

      {/* Right side - Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}