import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Building2, User2, ArrowRight, Facebook, Twitter, Github, Mail, FileText, Upload } from 'lucide-react'
import { useAuthStore } from '../stores/auth.store'
import { useResumesStore } from '../stores/resumes.store'
import { ResumeUpload } from './Profile/components/ResumeUpload'
import { ManualResumeForm } from './Register/components/ManualResumeForm'
import { ResumePreview } from './Register/components/ResumePreview'

type Role = 'talent' | 'business'
type Step = 'role' | 'details' | 'resume' | 'manual-resume' | 'preview'

export function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [currentStep, setCurrentStep] = useState<Step>('role')
  const [resumeData, setResumeData] = useState<any>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ''
  })
  const [uploadError, setUploadError] = useState<string>()
  const { register, isLoading, error, clearError } = useAuthStore()

  useEffect(() => {
    if (selectedRole) {
      setFormData(prev => ({
        ...prev,
        role: selectedRole === 'talent' ? 'employee' : 'employer'
      }))
    }
  }, [selectedRole])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(formData)
      if (selectedRole === 'talent') {
        setCurrentStep('resume')
      }
    } catch (error) {
      // Error is handled by the store
    }
  }

  const handleUploadResume = async (name: string, file: File) => {
    try {
      // TODO: Implement resume upload
      const data = await analyzeResume(file)
      setResumeData(data)
      setCurrentStep('preview')
      setUploadError(undefined)
    } catch (error) {
      setUploadError('Failed to upload resume. Please try again.')
    }
  }

  const handleManualResume = async (data: any) => {
    try {
      // TODO: Save resume data
      setResumeData(data)
      setCurrentStep('preview')
    } catch (error) {
      setUploadError('Failed to save resume. Please try again.');
    }
  };

  const handleContinue = async () => {
    try {
      // Register user and create resume
      await register(formData)
      await createResume({
        name: `${formData.firstName}'s Resume`,
        parsedData: resumeData
      })
      navigate('/dashboard')
    } catch (error) {
      // Error handled by stores
    }
  }

  if (currentStep === 'preview') {
    return (
      <ResumePreview
        data={resumeData}
        onEdit={(section, data) => {
          setResumeData({
            ...resumeData,
            [section]: data
          })
        }}
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
              setSelectedRole('talent')
              setCurrentStep('details')
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
              setSelectedRole('business')
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
              onClick={() => setCurrentStep('details')}
              className="hover:text-gray-900"
            >
              ← Back
            </button>
            <span>•</span>
            <span>Final Step</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Upload Your Resume
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Let employers find you by uploading your resume or filling out your profile manually
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <ResumeUpload onUpload={handleUploadResume} error={uploadError} />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          <Link
            onClick={() => setCurrentStep('manual-resume')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg"
          >
            Fill Profile Manually
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </>
    );
  }

  if (currentStep === 'manual-resume') {
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
    );
  }

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
          <span>Step 2 of {selectedRole === 'talent' ? '3' : '2'}</span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">
          {selectedRole === 'talent' ? 'Create Your Talent Profile' : 'Create Your Business Account'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {selectedRole === 'talent'
            ? 'Start your journey to finding your dream job'
            : 'Start hiring the best talent for your company'
          }
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
              className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
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
              className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Work Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
            placeholder="john@company.com"
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
            className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
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

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            I agree to the{' '}
            <Link to="/terms" className="font-medium text-purple-600 hover:text-purple-500">
              terms & conditions
            </Link>
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full justify-center rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
          Sign in instead
        </Link>
      </p>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">or</span>
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
    </>
  )
}