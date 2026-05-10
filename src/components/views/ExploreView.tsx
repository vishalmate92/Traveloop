import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MapPin, TrendingUp, Compass, Star, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DESTINATIONS = [
  {
    id: '1',
    title: 'Santorini, Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2000',
    category: 'Coastal',
    rating: 4.9,
    description: 'Breathtaking sunsets and iconic blue-domed churches.'
  },
  {
    id: '2',
    title: 'Kyoto, Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070',
    category: 'Culture',
    rating: 4.8,
    description: 'Traditional temples, sublime gardens and geisha districts.'
  },
  {
    id: '3',
    title: 'Swiss Alps, Switzerland',
    image: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=2070',
    category: 'Adventure',
    rating: 5.0,
    description: 'World-class skiing and unparalleled mountain vistas.'
  }
];

export default function ExploreView() {
  return (
    <div className="space-y-12">
      <div className="relative h-80 rounded-[40px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-12">
           <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
           >
             <Badge className="bg-orange-600 text-white border-none mb-4 px-4 py-1">Featured Destination</Badge>
             <h2 className="text-5xl font-black text-white tracking-tighter leading-tight max-w-xl">
               Discover the Undiscovered
             </h2>
             <p className="text-white/80 text-lg mt-4 max-w-lg font-medium">
               Get AI-personalized travel recommendations based on your preferences and previous journeys.
             </p>
             <Button className="mt-8 bg-white text-black hover:bg-white/90 h-12 px-8 rounded-full font-bold gap-2">
                <Sparkles className="w-4 h-4 text-orange-600" /> Start AI Discovery
             </Button>
           </motion.div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                <TrendingUp className="w-5 h-5" />
             </div>
             <h3 className="text-2xl font-black text-slate-900 tracking-tight">Trending Destinations</h3>
          </div>
          <Button variant="ghost" className="text-orange-600 font-bold">View all</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DESTINATIONS.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-none shadow-sm hover:shadow-xl transition-all rounded-[32px] overflow-hidden group bg-white">
                <div className="h-64 relative overflow-hidden">
                   <img src={dest.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   <Badge className="absolute top-4 left-4 bg-black/20 backdrop-blur-md text-white border-white/20">
                      {dest.category}
                   </Badge>
                   <div className="absolute top-4 right-4 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1 text-[10px] font-bold">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {dest.rating}
                   </div>
                </div>
                <CardContent className="p-8">
                   <h4 className="text-xl font-bold text-slate-900 mb-2">{dest.title}</h4>
                   <p className="text-slate-500 text-sm leading-relaxed mb-6">
                     {dest.description}
                   </p>
                   <Button variant="outline" className="w-full rounded-2xl font-bold border-slate-100 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition-all">
                      Explore this place
                   </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 rounded-[40px] p-12 text-white relative overflow-hidden">
         <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
               <Compass className="w-6 h-6 text-orange-500" />
               <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">Mystery Journey</span>
            </div>
            <h3 className="text-4xl font-black mb-4">Surprise Me!</h3>
            <p className="text-slate-400 text-lg max-w-xl mb-8">
               Can't decide? Let our AI plan a surprise trip for you based on your budget and desired vibe.
            </p>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8 h-12 font-bold shadow-lg shadow-orange-600/30">
               Generate Surprise Trip
            </Button>
         </div>
         
         <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 bg-gradient-to-l from-orange-600/50 to-transparent" />
         <Globe className="absolute -right-20 -bottom-20 w-80 h-80 text-white/5" />
      </section>
    </div>
  );
}
