import React from 'react';
import { motion } from 'motion/react';
import { User, MapPin, Award, Settings, Globe, Shield, CreditCard, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

export default function ProfileView() {
  const { user } = useAuth();
  
  const stats = [
    { label: 'Countries visited', value: '12', icon: Globe, color: 'text-blue-500' },
    { label: 'Total Miles', value: '24.5k', icon: MapPin, color: 'text-green-500' },
    { label: 'Trip Badges', value: '8', icon: Award, color: 'text-orange-500' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-12 rounded-[40px] shadow-sm">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-100 p-1">
            <img 
              src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
              className="w-full h-full rounded-full object-cover bg-slate-100"
            />
          </div>
          <button className="absolute bottom-0 right-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
             <Settings className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{user?.displayName || 'Traveler'}</h2>
          <p className="text-slate-500 font-medium text-lg mt-1">{user?.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
             <div className="bg-slate-100 px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 uppercase tracking-wider">Explorer Level 4</div>
             <div className="bg-orange-100 px-4 py-1.5 rounded-full text-xs font-bold text-orange-600 uppercase tracking-wider">Pro Planner</div>
          </div>
        </div>
        <Button className="rounded-full h-12 px-8 bg-black text-white hover:bg-slate-800 font-bold">
           Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm rounded-[32px] bg-white group hover:shadow-md transition-all">
              <CardContent className="p-8 text-center">
                <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <h4 className="text-3xl font-black text-slate-900 mb-1">{stat.value}</h4>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <Card className="border-none shadow-sm rounded-[32px] bg-white h-fit">
            <CardHeader className="p-8 pb-4">
               <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                 <Shield className="w-5 h-5 text-orange-600" /> Account Settings
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
               {[
                 { label: 'Privacy Control', icon: User, desc: 'Manage your visibility' },
                 { label: 'Security', icon: Shield, desc: 'Password and 2FA' },
                 { label: 'Billing', icon: CreditCard, desc: 'Premium travel features' },
                 { label: 'Notifications', icon: Bell, desc: 'Trip updates & reminders' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                          <item.icon className="w-5 h-5 text-slate-500" />
                       </div>
                       <div>
                          <p className="font-bold text-slate-900">{item.label}</p>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                       </div>
                    </div>
                    <button className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-400">
                       →
                    </button>
                 </div>
               ))}
            </CardContent>
         </Card>

         <Card className="border-none shadow-sm rounded-[32px] bg-white h-fit">
            <CardHeader className="p-8 pb-4">
               <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                 <Award className="w-5 h-5 text-orange-600" /> Recent Achievements
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
               {[
                 { title: 'Global Nomad', date: 'May 2026', desc: 'Visited 3 continents in one year' },
                 { title: 'Savvy Saver', date: 'April 2026', desc: 'Planned a trip 30% under budget' },
                 { title: 'First Flight', date: 'June 2024', desc: 'Completed your first recorded trip' }
               ].map((ach, i) => (
                 <div key={i} className="flex gap-4 p-4">
                    <div className="bg-orange-50 w-2 h-2 rounded-full mt-2 shrink-0 border-2 border-orange-500" />
                    <div>
                       <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">{ach.title}</h4>
                          <span className="text-[10px] text-slate-400 font-bold">{ach.date}</span>
                       </div>
                       <p className="text-sm text-slate-500">{ach.desc}</p>
                    </div>
                 </div>
               ))}
               <Button variant="ghost" className="w-full text-orange-600 font-bold mt-4">See all achievements</Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
