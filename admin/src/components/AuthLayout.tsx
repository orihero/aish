import { Heart } from 'lucide-react'
import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <Heart className="h-6 w-6 text-purple-500 fill-purple-500" />
          <span className="text-xl font-semibold">Vuexy</span>
        </div>
        
        {/* Profit Card */}
        <div className="absolute top-32 left-12 bg-white rounded-lg shadow-lg p-4 w-48">
          <div className="text-sm text-gray-500 mb-1">Profit</div>
          <div className="text-2xl font-semibold">624k</div>
          <div className="text-emerald-500 text-sm">+8.24%</div>
          <div className="mt-2 flex items-end gap-1">
            {[20, 40, 30, 50, 35, 45, 55].map((height, i) => (
              <div
                key={i}
                className="w-3 bg-purple-500/20 rounded-sm"
                style={{ height: `${height}px` }}
              />
            ))}
          </div>
        </div>
        
        {/* Order Card */}
        <div className="absolute bottom-32 right-12 bg-white rounded-lg shadow-lg p-4 w-48">
          <div className="text-sm text-gray-500 mb-1">Order</div>
          <div className="text-2xl font-semibold">124k</div>
          <div className="text-emerald-500 text-sm">+12.6%</div>
          <div className="mt-2 flex items-end gap-1">
            {[30, 45, 25, 50, 35, 40, 45].map((height, i) => (
              <div
                key={i}
                className="w-3 bg-indigo-500/20 rounded-sm"
                style={{ height: `${height}px` }}
              />
            ))}
          </div>
        </div>
        
        <img
          src="https://static.vecteezy.com/system/resources/previews/010/870/998/large_2x/3d-character-illustration-happy-casual-man-showing-hand-to-copy-space-with-both-hands-presenting-or-introducing-something-advertisement-or-product-presenting-concept-free-png.png"
          alt="3D Character"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96"
        />
      </div>
      <div className="fixed top-8 left-8 lg:hidden flex items-center gap-2">
        <Heart className="h-6 w-6 text-purple-500 fill-purple-500" />
        <span className="text-xl font-semibold">Vuexy</span>
      </div>
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 w-full lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>
    </div>
  )
}