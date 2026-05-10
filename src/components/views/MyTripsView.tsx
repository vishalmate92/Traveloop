import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Globe, Trash2, Search, Filter, CreditCard, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Trip, TripActivity } from '@/types';

interface Props {
  trips: Trip[];
  onSelect: (trip: Trip) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export default function MyTripsView({ trips, onSelect, onDelete }: Props) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [search, setSearch] = useState('');

  const filteredTrips = trips.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const isPast = t.endDate < Date.now();
    if (filter === 'upcoming') return matchesSearch && !isPast;
    if (filter === 'past') return matchesSearch && isPast;
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Journeys</h2>
          <p className="text-slate-500">Manage all your past and future adventures in one place.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search journeys..." 
                className="pl-10 rounded-xl"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>
           <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
             <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === 'all' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
             >
                All
             </button>
             <button 
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === 'upcoming' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
             >
                Upcoming
             </button>
             <button 
                onClick={() => setFilter('past')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === 'past' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
             >
                Past
             </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map((trip) => {
          const allActivities = trip.stops.flatMap(s => s.activities);
          const spent = allActivities.filter(a => a.completed).reduce((sum, a) => sum + a.cost, 0);
          const progress = trip.budget.total > 0 ? Math.min(100, (spent / trip.budget.total) * 100) : 0;
          const upcomingActivities = allActivities
            .filter(a => !a.completed)
            .slice(0, 2);

          return (
            <motion.div 
              key={trip.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => onSelect(trip)}
              className="group cursor-pointer"
            >
              <Card className="border-none shadow-sm hover:shadow-xl transition-all rounded-[32px] overflow-hidden bg-white">
                <div className="h-48 relative">
                  <img src={trip.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white border-white/20 uppercase text-[10px] font-bold">
                    {trip.status}
                  </Badge>
                  <div className="absolute bottom-4 left-6 right-6">
                     <h3 className="text-xl font-bold text-white truncate">{trip.title}</h3>
                  </div>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(trip.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="font-black text-slate-900">${trip.budget.total}</div>
                  </div>

                  {/* Budget Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        Budget Spent
                      </div>
                      <span className={progress > 90 ? 'text-red-500' : 'text-slate-600'}>
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-1.5 bg-slate-100" indicatorClassName={progress > 90 ? 'bg-red-500' : 'bg-orange-600'} />
                  </div>

                  {/* Upcoming Activities */}
                  {upcomingActivities.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <Clock className="w-3 h-3" />
                        Upcoming
                      </div>
                      <div className="space-y-2">
                        {upcomingActivities.map((act, idx) => (
                          <div key={act.id} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100/50">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                            <span className="truncate font-medium flex-1">{act.title}</span>
                            <span className="text-slate-400 font-bold">${act.cost}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                     <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400">
                              {i}
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{trip.sharedWith.length + 1} People</span>
                     </div>
                     <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(e, trip.id);
                      }}
                     >
                       <Trash2 className="w-4 h-4" />
                     </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {filteredTrips.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-[32px] border border-dashed border-slate-200 text-center">
             <Globe className="w-12 h-12 text-slate-200 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-slate-900">No journeys found</h3>
             <p className="text-slate-500">Try changing your filters or searching for something else.</p>
          </div>
        )}
      </div>
    </div>
  );
}
