
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { chartData } from '../data/mockData';

export function YieldChart() {
  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <TrendingUp size={20} className="text-green-400" />
        <h3 className="text-lg font-semibold text-dark-text">Yield Performance</h3>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value) => [`${value}%`, 'Yield']}
            />
            <Line 
              type="monotone" 
              dataKey="yield" 
              stroke="url(#gradient)" 
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#8B5CF6' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-dark-muted">6-month average yield</p>
        <p className="text-xl font-bold text-green-400">8.2%</p>
      </div>
    </div>
  );
}
