import { Link } from 'react-router-dom'

export function ForgotPassword() {
  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Forgot Password? 🔒
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email and we'll send you instructions to reset your password
        </p>
      </div>

      <form className="mt-8 space-y-6">
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

        <div>
          <button
            type="submit"
            className="w-full justify-center rounded-md bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            Send reset link
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
          ← Back to login
        </Link>
      </p>
    </>
  )
}