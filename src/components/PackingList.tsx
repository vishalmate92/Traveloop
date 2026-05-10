import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PackingItem } from '@/types';

interface Props {
  items: PackingItem[];
  onUpdate: (newItems: PackingItem[]) => void;
}

export default function PackingList({ items, onUpdate }: Props) {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (!newItem.trim()) return;
    const item: PackingItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: newItem,
      category: 'other',
      packed: false,
    };
    onUpdate([...items, item]);
    setNewItem('');
  };

  const toggleItem = (id: string) => {
    onUpdate(items.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
  };

  const removeItem = (id: string) => {
    onUpdate(items.filter(item => item.id !== id));
  };

  const stats = {
    total: items.length,
    packed: items.filter(i => i.packed).length,
    progress: items.length > 0 ? (items.filter(i => i.packed).length / items.length) * 100 : 0
  };

  return (
    <Card className="border border-slate-100 shadow-2xl shadow-slate-200/20 rounded-[40px] bg-white overflow-hidden">
      <CardHeader className="p-10 flex flex-row items-center justify-between space-y-0 pb-6 border-b border-slate-50">
        <div>
          <h3 className="text-2xl font-black text-slate-900 font-display tracking-tight">Essential Gear</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Inventory & Equipment Readiness</p>
        </div>
        <div className="flex flex-col items-end gap-1">
           <Badge variant={stats.progress === 100 ? "default" : "secondary"} className="h-7 rounded-full px-4 text-[10px] font-black uppercase tracking-widest bg-slate-950 text-white">
             {Math.round(stats.progress)}% Readiness
           </Badge>
           <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{stats.packed}/{stats.total} Components</span>
        </div>
      </CardHeader>
      <CardContent className="p-10 pt-8">
        <div className="flex gap-4 mb-10">
          <Input 
            placeholder="Specify equipment (e.g. Passport, Hardware)..." 
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            className="h-14 rounded-2xl bg-slate-50 border-none ring-slate-950 focus-visible:ring-2 font-medium transition-all"
          />
          <Button onClick={addItem} className="bg-slate-950 hover:bg-slate-900 h-14 px-10 rounded-2xl font-bold shadow-xl shadow-slate-900/20 active:scale-95 transition-all">
            Add
          </Button>
        </div>

        <div className="h-1.5 w-full bg-slate-50 rounded-full mb-10 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${stats.progress}%` }} 
            className="h-full bg-slate-950 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(0,0,0,0.1)]" 
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          {items.map((item) => (
            <motion.div 
              layout
              key={item.id} 
              className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                item.packed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200'
              }`}
            >
              <div 
                className="flex items-center gap-4 flex-1 cursor-pointer group"
                onClick={() => toggleItem(item.id)}
              >
                {item.packed ? (
                  <div className="w-6 h-6 bg-slate-950 rounded-lg flex items-center justify-center shadow-lg shadow-slate-900/20">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 border-2 border-slate-200 rounded-lg group-hover:border-slate-950 transition-colors" />
                )}
                <span className={`text-sm font-bold transition-all ${item.packed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {item.title}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </motion.div>
          ))}

          {items.length === 0 && (
            <div className="py-24 text-center bg-slate-50 border border-dashed border-slate-100 rounded-[32px]">
              <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Package className="w-10 h-10 text-slate-100" />
              </div>
              <p className="text-xl font-black text-slate-900 font-display">Inventory Exhausted</p>
              <p className="text-sm text-slate-400 font-medium mt-2">Initialize your gear list by specifying requirements above.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
