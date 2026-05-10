import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  budget: {
    total: number;
    categories: {
      transport: number;
      accommodation: number;
      food: number;
      activities: number;
      other: number;
    };
  };
  onUpdateTotal: (newTotal: number) => void;
}

export default function BudgetAnalytics({ budget, onUpdateTotal }: Props) {
  const data = [
    { name: 'Transport', value: budget.categories.transport, color: '#0F172A' },
    { name: 'Stay', value: budget.categories.accommodation, color: '#334155' },
    { name: 'Food', value: budget.categories.food, color: '#64748B' },
    { name: 'Activities', value: budget.categories.activities, color: '#94A3B8' },
    { name: 'Other', value: budget.categories.other, color: '#CBD5E1' },
  ];

  const totalSpent = Object.values(budget.categories).reduce((a, b) => a + b, 0);
  const remaining = budget.total - totalSpent;
  const isOverBudget = totalSpent > budget.total;

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <Card className="lg:col-span-7 border border-slate-100 shadow-2xl shadow-slate-200/20 h-[500px] rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="p-10 pb-0">
            <div>
              <h3 className="text-2xl font-black text-slate-900 font-display tracking-tight">Resource Allocation</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Distribution across operational categories</p>
            </div>
          </CardHeader>
          <CardContent className="h-full pb-32 p-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: '1px solid #F1F5F9', 
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
                    padding: '12px 20px',
                    fontWeight: 'bold',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend 
                  iconType="circle" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ paddingTop: '40px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 border border-slate-100 shadow-2xl shadow-slate-200/20 rounded-[40px] bg-white">
          <CardHeader className="p-10">
            <h3 className="text-2xl font-black text-slate-900 font-display tracking-tight">Status Overview</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time expenditure synchronization</p>
          </CardHeader>
          <CardContent className="p-10 pt-0">
            <div className="space-y-8">
              <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 flex items-center justify-between group transition-all hover:bg-slate-100/50">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Maximum Ceiling</p>
                  <div className="flex items-center gap-3">
                    <h4 className="text-4xl font-black text-slate-950 font-display tracking-tight">${budget.total}</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-white rounded-full border border-transparent hover:border-slate-200 transition-all"
                      onClick={() => {
                        const next = prompt('Define new budget ceiling:', budget.total.toString());
                        if (next) onUpdateTotal(parseInt(next));
                      }}
                    >
                      Calibrate
                    </Button>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm text-slate-950">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className={`p-8 rounded-[32px] border-2 transition-all ${isOverBudget ? 'bg-red-50/50 border-red-100' : 'bg-slate-950 border-slate-950 text-white shadow-2xl shadow-slate-900/20'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${isOverBudget ? 'text-red-400' : 'text-slate-400'}`}>
                      {isOverBudget ? 'Variance (Negative)' : 'Available Liquidity'}
                    </p>
                    <h4 className={`text-4xl font-black font-display tracking-tight ${isOverBudget ? 'text-red-600' : 'text-white'}`}>
                      ${Math.abs(remaining)}
                    </h4>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isOverBudget ? 'bg-red-100 text-red-600' : 'bg-white/10 text-white'}`}>
                    {isOverBudget ? <AlertCircle className="w-7 h-7" /> : <DollarSign className="w-7 h-7" />}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                 <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Deployment Velocity</p>
                    <span className="text-[10px] font-black text-slate-900">{Math.round((totalSpent / budget.total) * 100)}% Consumed</span>
                 </div>
                 <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden flex border border-slate-100">
                   {data.map((entry, index) => (
                     <div 
                        key={index}
                        style={{ width: `${(entry.value / budget.total) * 100}%`, backgroundColor: entry.color }}
                        className="h-full transition-all border-r border-white/10 last:border-none"
                     />
                   ))}
                 </div>
                 <div className="flex justify-between mt-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                   <span>Zero</span>
                   <span className="text-slate-400">Limit Reached</span>
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
