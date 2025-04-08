import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Github, Mail } from 'lucide-react'

export function Register() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Adventure starts here 🚀
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Make your app management easy and fun!
        </p>
      </div>

      <form className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="block w-full rounded-md border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
              placeholder="johndoe"
            />
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
              className="block w-full rounded-md border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
              placeholder="Password"
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
            className="w-full justify-center rounded-md bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            Sign up
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