import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { BarChart3, DollarSign, ShoppingCart, TrendingUp, Users, MoreVertical } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const salesData = [
  { name: 'Jan', value: 5000 },
  { name: 'Feb', value: 9000 },
  { name: 'Mar', value: 12000 },
  { name: 'Apr', value: 18000 },
  { name: 'May', value: 20000 },
  { name: 'Jun', value: 25000 },
  { name: 'Jul', value: 30000 },
  { name: 'Aug', value: 36000 },
  { name: 'Sep', value: 48000 },
];

const revenueData = [
  { day: 'M', value: 45 },
  { day: 'T', value: 52 },
  { day: 'W', value: 38 },
  { day: 'T', value: 24 },
  { day: 'F', value: 33 },
  { day: 'S', value: 26 },
  { day: 'S', value: 21 },
];

const radarData = [
  { subject: 'Jan', sales: 80, visits: 90 },
  { subject: 'Feb', sales: 85, visits: 75 },
  { subject: 'Mar', sales: 60, visits: 70 },
  { subject: 'Apr', sales: 70, visits: 85 },
  { subject: 'May', sales: 75, visits: 65 },
  { subject: 'Jun', sales: 85, visits: 80 },
];

export function Dashboard() {
  const { user } = useAuthStore();
  const [selectedChart, setSelectedChart] = useState<'orders' | 'sales' | 'profit' | 'income'>('income');

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-100">
          <p className="text-sm text-gray-600">{`${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="mt-1 text-gray-600">
            Here's what's happening with your business today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Orders</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">124k</p>
                <p className="ml-2 text-sm font-medium text-emerald-600">+12.6%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Sales</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">175k</p>
                <p className="ml-2 text-sm font-medium text-red-600">-16.2%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Profit</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">1.28k</p>
                <p className="ml-2 text-sm font-medium text-red-600">-12.2%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-orange-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">$4,673</p>
                <p className="ml-2 text-sm font-medium text-emerald-600">+25.2%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-[#625F6E]">Earning Reports</h2>
              <p className="text-sm text-gray-500">Yearly Earnings Overview</p>
            </div>
            <div className="flex gap-2">
              {(['orders', 'sales', 'profit', 'income'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedChart(type)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    selectedChart === type
                      ? 'bg-purple-50 text-purple-600'
                      : 'text-[#625F6E] hover:bg-gray-50'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
              <button className="p-1.5 text-[#625F6E]">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7367F0" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#7367F0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#7367F0"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-[#625F6E]">Revenue Growth</h2>
              <p className="text-sm text-gray-500">Weekly Report</p>
            </div>
            <button className="p-1.5 text-[#625F6E]">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#28C76F"
                  strokeWidth={2}
                  dot={{ fill: '#28C76F', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}