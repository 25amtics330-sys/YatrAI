import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { toINR, compactINR, budgetUtilization, budgetStatusColor } from '@/utils/formatBudget';
import { Download, PieChart as PieChartIcon } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function BudgetTracker() {
  const { currentTrip } = useSelector((state) => state.planner);
  const budget = currentTrip?.budget || {};
  
  const data = [
    { name: 'Hotel', value: budget.hotel, color: '#2EC4B6' },
    { name: 'Food', value: budget.food, color: '#FF6B35' },
    { name: 'Transport', value: budget.transport, color: '#FFE66D' },
    { name: 'Activities', value: budget.activities, color: '#BD34FE' },
    { name: 'Shopping', value: budget.shopping, color: '#4CAF50' },
  ].filter(item => item.value > 0);

  const utilization = budgetUtilization(budget.spent, budget.total);
  const statusColor = budgetStatusColor(utilization);

  return (
    <div className="bg-surface border border-border rounded-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-semibold text-text text-lg flex items-center gap-2">
          <PieChartIcon className="text-primary" size={20} />
          Budget Tracker
        </h3>
        <button className="p-2 text-muted hover:text-primary transition-colors hover:bg-primary/10 rounded-full">
          <Download size={18} />
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-surface-2 rounded-card p-4">
          <span className="text-xs text-muted block mb-1">Total Budget</span>
          <span className="font-heading font-bold text-xl text-text">
            {compactINR(budget.total)}
          </span>
        </div>
        <div className="bg-surface-2 rounded-card p-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1" style={{ backgroundColor: statusColor }} />
          <span className="text-xs text-muted block mb-1">Remaining</span>
          <span className="font-heading font-bold text-xl" style={{ color: statusColor }}>
            {compactINR(budget.remaining)}
          </span>
        </div>
      </div>

      {/* Utilization Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted">Spent: {toINR(budget.spent)}</span>
          <span className="font-medium" style={{ color: statusColor }}>{utilization}%</span>
        </div>
        <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${utilization}%`, backgroundColor: statusColor }}
          />
        </div>
      </div>

      {/* Donut Chart */}
      {data.length > 0 && (
        <div className="h-48 w-full relative mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                className="donut-segment"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => toINR(value)}
                contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--color-text)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
            <span className="text-muted text-xs">Breakdown</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-muted">{item.name}</span>
            </div>
            <span className="font-medium text-text">{toINR(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
