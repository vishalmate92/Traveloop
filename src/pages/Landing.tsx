import { motion } from 'motion/react';
import { Plane, Map, Calendar, DollarSign, ArrowRight, Github, Globe, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-orange-500/10 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Traveloop</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-500">
            <a href="#features" className="hover:text-slate-900 transition-colors">Platform</a>
            <a href="#destinations" className="hover:text-slate-900 transition-colors">Destinations</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-slate-600 font-semibold hover:bg-slate-50" onClick={() => navigate('/dashboard')}>
              Log in
            </Button>
            <Button 
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 font-semibold"
              onClick={() => navigate('/dashboard')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-slate-50/50 to-transparent -z-10" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 py-1 px-1 pr-4 rounded-full bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold mb-8">
                <span className="bg-white border border-slate-200 px-2.5 py-0.5 rounded-full text-slate-900 shadow-sm">New</span>
                <span>AI-powered itinerary generator is here</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95] mb-10 font-display text-slate-900">
                Design your next <br />
                <span className="text-slate-400">great adventure.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 max-w-xl mb-12 leading-relaxed font-medium">
                The modern platform for travelers. Plan itineraries, manage budgets, and discover the world with AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button 
                  size="lg" 
                  className="h-16 px-10 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl text-lg font-bold group shadow-2xl shadow-slate-900/10"
                  onClick={() => navigate('/dashboard')}
                >
                  Start planning free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="flex -space-x-3 items-center ml-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                    </div>
                  ))}
                  <div className="pl-6 text-sm font-bold text-slate-400">
                    Trusted by 10k+ travelers
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-24 relative"
          >
            <div className="relative rounded-[40px] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/50">
              <div className="aspect-[16/9] rounded-[32px] overflow-hidden bg-slate-50 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=2070" 
                  alt="Interface" 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                
                {/* Floating UI Elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-12 right-12 glass p-6 rounded-3xl shadow-xl w-64 hidden lg:block border border-white/40"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Map className="w-5 h-5 text-slate-900" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white/60 uppercase tracking-widest leading-none mb-1">Destination</p>
                      <p className="text-sm font-bold text-white">Kyoto, Japan</p>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-[70%] bg-white rounded-full" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight font-display">
                AI Intelligence for <br />
                <span className="text-slate-400">smarter travel.</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">
                Stop juggling tabs. Traveloop brings everything together, utilizing Gemini AI to curate experiences that match your personality.
              </p>
              <div className="space-y-6">
                {[
                  { title: "Smart Itineraries", desc: "Day-by-day plans that adapt as you go." },
                  { title: "Budget Mastery", desc: "Real-time tracking and currency conversion." },
                  { title: "Collaborative Planning", desc: "Invite friends and vote on stops together." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-slate-50 rounded-[48px] overflow-hidden border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1171" 
                  className="w-full h-full object-cover grayscale brightness-110"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-[32px] shadow-2xl border border-slate-100 max-w-xs">
                <Sparkles className="w-8 h-8 text-orange-500 mb-4" />
                <p className="text-sm font-bold text-slate-900 italic">"Traveloop predicted the weather perfectly and suggested indoor activities when it started to rain. Unbelievable."</p>
                <p className="text-xs font-bold text-slate-400 mt-4 uppercase">— Sarah J., Solo Traveler</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-32 bg-slate-900 text-white overflow-hidden rounded-[64px] mx-4 mb-4" id="destinations">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-5xl font-black mb-6 font-display tracking-tight leading-none">
                Top Destinations <br />
                <span className="text-white/40">this season.</span>
              </h2>
              <p className="text-white/60 font-medium text-lg italic">The most bookmarked places by our global community.</p>
            </div>
            <Button variant="link" className="text-white font-bold p-0 text-lg hover:no-underline group">
              Browse repository <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { city: "Tokyo", country: "Japan", img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=2070" },
              { city: "Oahu", country: "Hawaii", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073" },
              { city: "Lisbon", country: "Portugal", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073" },
              { city: "Amalfi", country: "Italy", img: "https://images.unsplash.com/photo-1533903345306-15d1c30952de?q=80&w=2070" }
            ].map((dest, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group relative h-[450px] rounded-[32px] overflow-hidden cursor-pointer"
              >
                <img src={dest.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">{dest.country}</p>
                  <h4 className="text-2xl font-black text-white">{dest.city}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-32 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-32">
            <div className="md:col-span-5 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-slate-900">Traveloop</span>
              </div>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-sm">
                Redefining the way humans explore the planet through thoughtful technology.
              </p>
              <div className="flex items-center gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all cursor-pointer">
                    <Globe className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div>
                <h5 className="font-bold mb-6 text-xs uppercase tracking-widest text-slate-400">Product</h5>
                <ul className="space-y-4 text-sm font-bold text-slate-500">
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Features</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">AI Engine</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Integrations</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Pricing</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold mb-6 text-xs uppercase tracking-widest text-slate-400">Company</h5>
                <ul className="space-y-4 text-sm font-bold text-slate-500">
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Manifesto</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Careers</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Privacy</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Legal</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold mb-6 text-xs uppercase tracking-widest text-slate-400">Connect</h5>
                <ul className="space-y-4 text-sm font-bold text-slate-500">
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Twitter / X</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">Instagram</li>
                  <li className="hover:text-slate-900 cursor-pointer transition-colors">LinkedIn</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-slate-100 gap-6">
            <p className="text-sm text-slate-400 font-medium">© 2026 Traveloop Inc. All rights reserved.</p>
            <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
              <span className="hover:text-slate-900 cursor-pointer">Security</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <span className="hover:text-slate-900 cursor-pointer">Status</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
