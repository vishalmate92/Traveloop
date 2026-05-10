import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Share2, 
  MoreHorizontal, 
  ChevronLeft,
  LayoutDashboard,
  Map as MapIcon,
  ShoppingBag,
  Info,
  Download,
  Settings,
  Trash2,
  Sparkles,
  Clock,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ItineraryBuilder from '@/components/ItineraryBuilder';
import BudgetAnalytics from '@/components/BudgetAnalytics';
import PackingList from '@/components/PackingList';
import { Trip, TripStop } from '@/types';
import { toast } from 'sonner';

interface Props {
  trip: Trip;
  onBack: () => void;
  onUpdate: (updatedTrip: Trip) => void;
}

export default function TripDetails({ trip, onBack, onUpdate }: Props) {
  const [activeTab, setActiveTab] = useState('itinerary');

  const updateStops = (newStops: TripStop[]) => {
    // Recalculate budget categories based on activities
    const newCategories = { transport: 0, accommodation: 0, food: 0, activities: 0, other: 0 };
    newStops.forEach(stop => {
      stop.activities.forEach(activity => {
        const cat = (activity.category as keyof typeof newCategories) || 'activities';
        if (newCategories[cat] !== undefined) {
          newCategories[cat] += activity.cost;
        } else {
          newCategories.other += activity.cost;
        }
      });
    });

    onUpdate({ 
      ...trip, 
      stops: newStops,
      budget: {
        ...trip.budget,
        categories: newCategories
      }
    });
  };

  const updatePackingList = (newItems: any[]) => {
    onUpdate({ ...trip, packingList: newItems });
  };

  const updateTotalBudget = (newTotal: number) => {
    onUpdate({
      ...trip,
      budget: {
        ...trip.budget,
        total: newTotal
      }
    });
    toast.success('Total budget updated');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleExport = () => {
    toast.info('Exporting trip data to PDF...');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Container */}
      <div className="relative h-[60vh] overflow-hidden">
        <img 
          src={trip.coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021'} 
          className="w-full h-full object-cover" 
          alt={trip.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        <div className="absolute top-8 left-8 z-20">
          <Button 
            variant="ghost" 
            className="bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 rounded-2xl border border-white/10 group"
            onClick={onBack}
          >
            <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm">Dashboard</span>
          </Button>
        </div>

        <div className="absolute bottom-16 left-16 right-16 flex items-end justify-between z-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex gap-2">
                <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none font-bold uppercase text-[10px] tracking-widest px-3 py-1">
                  • {trip.status}
                </Badge>
                <Badge className="bg-slate-900/60 backdrop-blur-md border border-white/10 text-white font-bold uppercase text-[10px] tracking-widest px-3 py-1">
                  {trip.visibility}
                </Badge>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight leading-[0.9] font-display">
                {trip.title}
              </h1>
              <div className="flex flex-wrap items-center gap-8 text-white/70">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-lg font-bold">
                    {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} — {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg font-bold">{trip.stops.length} destinations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="text-lg font-bold">{trip.sharedWith.length + 1} planners</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex gap-3">
            <Button 
              className="bg-white text-slate-900 hover:bg-white/90 rounded-2xl font-bold px-8 h-14 gap-2 shadow-2xl transition-all active:scale-95"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" /> Share
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all">
                  <MoreHorizontal className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-[24px] p-2 border-slate-100 shadow-2xl">
                <DropdownMenuItem onClick={handleExport} className="rounded-xl h-11 gap-3 cursor-pointer font-bold text-slate-600">
                  <Download className="w-4 h-4" /> Export Itinerary
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info('Link settings coming soon!')} className="rounded-xl h-11 gap-3 cursor-pointer font-bold text-slate-600">
                  <Settings className="w-4 h-4" /> Trip Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 bg-slate-50" />
                <DropdownMenuItem onClick={onBack} className="rounded-xl h-11 gap-3 cursor-pointer font-bold text-red-500 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="w-4 h-4" /> Move to Trash
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-16 -mt-10 relative z-30 pb-32">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
          <TabsList className="bg-white p-1.5 rounded-[24px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] h-16 border border-slate-100 flex items-center justify-start w-fit px-2">
            {[
              { id: 'itinerary', label: 'Itinerary', icon: <MapIcon className="w-4 h-4" /> },
              { id: 'budget', label: 'Budget', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'packing', label: 'Packing', icon: <ShoppingBag className="w-4 h-4" /> },
              { id: 'notes', label: 'Thoughts', icon: <Info className="w-4 h-4" /> }
            ].map(tab => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id}
                className="rounded-[18px] h-13 px-8 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xl font-bold transition-all gap-2 text-slate-400 group"
              >
                {React.cloneElement(tab.icon as React.ReactElement, { className: "w-4 h-4 transition-colors group-data-[state=active]:text-white" })}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="itinerary" className="mt-0 outline-none">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8">
                   <ItineraryBuilder stops={trip.stops} onUpdate={updateStops} />
                </div>
                <div className="lg:col-span-4 space-y-12">
                   <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100 ring-1 ring-slate-200/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">About this journey</p>
                      <h3 className="text-xl font-black text-slate-900 mb-4 font-display leading-tight">Objective</h3>
                      <p className="text-slate-500 font-medium leading-relaxed italic text-lg">
                        "{trip.description || "Synthesizing the perfect path for your next great exploration. Currently lacking a detailed mission statement."}"
                      </p>
                   </div>

                   <div className="rounded-[40px] overflow-hidden border border-slate-100 bg-white shadow-2xl shadow-slate-100">
                      <div className="p-10 bg-slate-900 text-white relative flex flex-col justify-end min-h-[160px]">
                         <Globe className="absolute -top-4 -right-4 w-32 h-32 text-white/5" />
                         <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Gemini Intelligence</p>
                         <h3 className="text-2xl font-black font-display tracking-tight">Smart Forecast</h3>
                      </div>
                      <div className="p-10 space-y-8">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                               <div className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center border border-slate-100 shadow-sm">
                                  <span className="text-3xl">☀️</span>
                               </div>
                               <div>
                                  <p className="text-3xl font-black text-slate-900">28°C</p>
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sky is clear</p>
                               </div>
                            </div>
                         </div>
                         
                         <div className="space-y-6 pt-4">
                            <div className="flex items-start gap-4 p-5 rounded-3xl bg-orange-50/50 border border-orange-100/50">
                               <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-1" />
                               <div>
                                  <p className="text-sm font-bold text-slate-900 mb-1">Exposure Alert</p>
                                  <p className="text-xs text-slate-500 font-medium leading-relaxed">High UV values predicted. We suggest adding breathable linens and protection to your gear list.</p>
                               </div>
                            </div>
                            <div className="flex items-start gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100">
                               <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-1" />
                               <div>
                                  <p className="text-sm font-bold text-slate-900 mb-1">Optimal Route</p>
                                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Traffic peaks around 11:00 AM. Consider starting your transfers before 09:30 AM.</p>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </TabsContent>

          <TabsContent value="budget" className="mt-0 outline-none">
            <BudgetAnalytics budget={trip.budget} onUpdateTotal={updateTotalBudget} />
          </TabsContent>

          <TabsContent value="packing" className="mt-0 outline-none">
            <div className="max-w-3xl mx-auto">
              <PackingList items={trip.packingList} onUpdate={updatePackingList} />
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-0 outline-none">
             <div className="py-32 text-center bg-slate-50 rounded-[64px] border border-slate-100">
                <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <Info className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 font-display mb-4">Travel Journal</h3>
                <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed italic">Capture the nuances of your exploration. This module is currently being calibrated for AI assistance.</p>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
