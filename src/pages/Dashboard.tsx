import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Calendar, Globe, LogOut, Settings, User as UserIcon, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Trip } from '@/types';
import TripDetails from './TripDetails';
import TripWizard from '@/components/TripWizard';
import { getTrips, saveTrip, deleteTrip } from '@/services/tripService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { auth as firebaseAuth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import MyTripsView from '@/components/views/MyTripsView';
import ExploreView from '@/components/views/ExploreView';
import ProfileView from '@/components/views/ProfileView';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isMock } = useAuth();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'my-trips' | 'explore' | 'profile'>('dashboard');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    async function loadData() {
      if (!user) return;
      
      try {
        const data = await getTrips(user.uid);
        if (data.length === 0 && isMock) {
           const sample: Trip = { 
            id: '1', 
            title: 'Summer in Kyoto', 
            ownerId: user.uid,
            description: 'Exploring the temples and culture of old Japan.',
            startDate: new Date('2026-06-12').getTime(),
            endDate: new Date('2026-06-20').getTime(),
            status: 'upcoming', 
            visibility: 'public',
            coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070',
            budget: {
              total: 2500,
              categories: { transport: 800, accommodation: 1000, food: 400, activities: 200, other: 100 }
            },
            stops: [
              { 
                id: 's1', city: 'Kyoto', country: 'Japan', order: 0, arrivalDate: Date.now(), departureDate: Date.now(),
                activities: [
                  { id: 'a1', title: 'Fushimi Inari Shrine', category: 'culture', cost: 0, completed: false },
                  { id: 'a2', title: 'Kinkaku-ji (Golden Pavilion)', category: 'sightseeing', cost: 500, completed: false }
                ],
                notes: 'Must visit early morning'
              }
            ],
            packingList: [{ id: 'p1', title: 'Passport', category: 'documents', packed: true }],
            sharedWith: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          setTrips([sample]);
          await saveTrip(sample);
        } else {
          setTrips(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user, isMock]);

  const handleUpdateTrip = async (updated: Trip) => {
    setTrips(prev => prev.map(t => t.id === updated.id ? updated : t));
    if (selectedTrip?.id === updated.id) setSelectedTrip(updated);
    await saveTrip(updated);
  };

  const handleDeleteTrip = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this trip?')) return;
    
    try {
      await deleteTrip(id);
      setTrips(prev => prev.filter(t => t.id !== id));
      toast.success('Trip deleted');
    } catch (err) {
      toast.error('Failed to delete trip');
    }
  };

  const handleCreateTrip = async (wizardData: any) => {
    if (!user) return;

    const newTrip: Trip = {
      id: Math.random().toString(36).substr(2, 9),
      title: wizardData.title,
      description: `Exploring ${wizardData.destination}`,
      ownerId: user.uid,
      startDate: new Date(wizardData.startDate).getTime(),
      endDate: new Date(wizardData.endDate).getTime(),
      status: 'upcoming',
      visibility: 'private',
      budget: {
        total: wizardData.budget || 1000,
        categories: { transport: 0, accommodation: 0, food: 0, activities: 0, other: 0 }
      },
      stops: wizardData.itinerary ? wizardData.itinerary.map((day: any, i: number) => ({
        id: `s${i}`,
        city: wizardData.destination,
        country: '',
        order: i,
        arrivalDate: Date.now(),
        departureDate: Date.now(),
        activities: day.activities.map((a: any, j: number) => ({
          id: `a${i}${j}`,
          title: a.title,
          cost: a.cost,
          category: a.category,
          completed: false
        }))
      })) : [],
      packingList: [],
      sharedWith: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073'
    };

    setTrips(prev => [newTrip, ...prev]);
    await saveTrip(newTrip);
    setIsWizardOpen(false);
    toast.success('Trip created successfully!');
  };

  const filteredTrips = trips.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = async () => {
    if (isMock) {
       localStorage.removeItem('traveloop_mock_user');
       toast.success('Logged out (Mock Mode)');
       window.location.href = '/';
    } else if (firebaseAuth) {
       await signOut(firebaseAuth);
       toast.success('Logged out successfully');
       navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
      </div>
    );
  }

  if (selectedTrip) {
    return (
      <TripDetails 
        trip={selectedTrip} 
        onBack={() => setSelectedTrip(null)} 
        onUpdate={handleUpdateTrip}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-100 bg-white flex flex-col fixed h-full z-20">
        <div className="p-8 pb-10 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900">Traveloop</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Nav Menu</p>
          <Button 
            variant="ghost" 
            className={`w-full h-11 justify-start gap-3 rounded-xl transition-all ${currentView === 'dashboard' ? 'bg-slate-50 text-slate-900 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            onClick={() => { setSelectedTrip(null); setCurrentView('dashboard'); }}
          >
            <Globe className="w-4 h-4" /> Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full h-11 justify-start gap-3 rounded-xl transition-all ${currentView === 'my-trips' ? 'bg-slate-50 text-slate-900 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            onClick={() => { setSelectedTrip(null); setCurrentView('my-trips'); }}
          >
            <Calendar className="w-4 h-4" /> My Trips
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full h-11 justify-start gap-3 rounded-xl transition-all ${currentView === 'explore' ? 'bg-slate-50 text-slate-900 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            onClick={() => { setSelectedTrip(null); setCurrentView('explore'); }}
          >
            <Search className="w-4 h-4" /> Explore
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full h-11 justify-start gap-3 rounded-xl transition-all ${currentView === 'profile' ? 'bg-slate-50 text-slate-900 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            onClick={() => { setSelectedTrip(null); setCurrentView('profile'); }}
          >
            <UserIcon className="w-4 h-4" /> Profile
          </Button>
        </nav>

        <div className="p-6 pt-0 border-t border-slate-50 space-y-2">
          <Button variant="ghost" className="w-full h-11 justify-start gap-3 text-slate-500 rounded-xl hover:bg-slate-50" onClick={() => toast.info('Settings coming soon!')}>
            <Settings className="w-4 h-4" /> Settings
          </Button>
          <Button variant="ghost" className="w-full h-11 justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 min-h-screen">
        {currentView === 'dashboard' && (
          <div className="max-w-6xl mx-auto p-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Overview</p>
                <h1 className="text-5xl font-black tracking-tight text-slate-900 font-display">Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Search your adventures..." 
                    className="pl-12 h-12 w-80 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-100 transition-all font-medium"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => setIsWizardOpen(true)}
                  className="bg-slate-900 hover:bg-slate-800 h-12 px-6 rounded-2xl gap-3 font-bold shadow-xl shadow-slate-900/10 whitespace-nowrap transition-all active:scale-95"
                >
                  <Plus className="w-5 h-5" /> New Trip
                </Button>
              </div>
            </header>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
              {[
                { label: 'Total Trips', value: trips.length, unit: 'trips' },
                { label: 'Upcoming', value: trips.filter(t => t.status === 'upcoming').length, unit: 'planned' },
                { label: 'Destinations', value: trips.reduce((acc, t) => acc + t.stops.length, 0), unit: 'visited' },
                { label: 'Avg. Budget', value: '$' + (trips.length > 0 ? (trips.reduce((acc, t) => acc + t.budget.total, 0) / trips.length).toFixed(0) : 0), unit: 'per trip' }
              ].map((stat, i) => (
                <div key={i} className="group cursor-default">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-black text-slate-900 leading-none">{stat.value}</h3>
                    <span className="text-xs font-bold text-slate-300 uppercase">{stat.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Recent Adventures</h2>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-slate-100" />
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Plans</span>
              </div>
            </div>

            {/* Trips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredTrips.map((trip) => {
                const allActivities = trip.stops.flatMap(s => s.activities);
                const spent = allActivities.filter(a => a.completed).reduce((sum, a) => sum + a.cost, 0);
                const progress = trip.budget.total > 0 ? Math.min(100, (spent / trip.budget.total) * 100) : 0;

                return (
                  <motion.div 
                    key={trip.id} 
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedTrip(trip)}
                    className="relative group h-full"
                  >
                    <div className="flex bg-white rounded-3xl border border-slate-100 overflow-hidden h-full shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-500">
                      <div className="w-2/5 relative overflow-hidden shrink-0">
                        <img 
                          src={trip.coverImage} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/90 backdrop-blur text-slate-900 border-none font-bold text-[10px] uppercase px-2 shadow-sm">
                            {trip.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-1 p-8 flex flex-col">
                        <div className="mb-4">
                           <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1 group-hover:text-orange-600 transition-colors">{trip.title}</h3>
                           <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                             <Calendar className="w-3.5 h-3.5" /> 
                             {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                           </div>
                        </div>
                        
                        <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-8 leading-relaxed">
                          {trip.description}
                        </p>

                        <div className="mt-auto space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Budget Progress</span>
                            <span className="text-xs font-black text-slate-900">{progress.toFixed(0)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${progress}%` }}
                               className="h-full bg-slate-900 rounded-full" 
                             />
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <span className="text-sm font-black text-slate-900">${trip.budget.total}</span>
                            <button 
                              onClick={(e) => handleDeleteTrip(e, trip.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {filteredTrips.length === 0 && !loading && (
                <div className="col-span-full py-32 text-center bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Search className="w-8 h-8 text-slate-200" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Start your story</h3>
                  <p className="text-slate-400 font-medium mb-8">No trips match your current search.</p>
                  <Button onClick={() => setSearchQuery('')} variant="outline" className="rounded-xl font-bold">Clear Filters</Button>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'my-trips' && (
          <div className="max-w-6xl mx-auto p-12">
            <MyTripsView 
              trips={trips} 
              onSelect={setSelectedTrip} 
              onDelete={handleDeleteTrip} 
            />
          </div>
        )}

        {currentView === 'explore' && (
          <div className="max-w-6xl mx-auto p-12">
            <ExploreView />
          </div>
        )}

        {currentView === 'profile' && (
          <div className="max-w-6xl mx-auto p-12">
            <ProfileView />
          </div>
        )}
      </main>

      <AnimatePresence>
        {isWizardOpen && (
          <TripWizard 
            onClose={() => setIsWizardOpen(false)} 
            onComplete={handleCreateTrip}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
