import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Calendar, Wallet, Image as ImageIcon, ArrowRight, ArrowLeft, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateTripSuggestions } from '@/services/geminiService';
import { toast } from 'sonner';

interface Props {
  onClose: () => void;
  onComplete: (tripData: any) => void;
}

export default function TripWizard({ onClose, onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: 1000,
    useAI: false
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleComplete = async () => {
    if (formData.useAI) {
      setIsGenerating(true);
      const start = new Date(formData.startDate).getTime();
      const end = new Date(formData.endDate).getTime();
      const diffTime = Math.abs(end - start);
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      
      const suggestions = await generateTripSuggestions(formData.destination, Math.min(days, 14), formData.budget);
      setIsGenerating(false);
      onComplete({ ...formData, itinerary: suggestions });
    } else {
      onComplete(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden relative"
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-6 right-6 h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-slate-500" />
        </Button>

        <div className="p-10">
          {/* Progress Bar */}
          <div className="flex gap-2 mb-10">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-orange-600' : 'bg-slate-100'}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Where to next?</h2>
                  <p className="text-slate-500">Let's start with the basics of your adventure.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Trip Name</Label>
                    <Input 
                      placeholder="e.g. Summer in Tokyo" 
                      className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Destination</Label>
                    <Input 
                      placeholder="City or Country" 
                      className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all"
                      value={formData.destination}
                      onChange={e => setFormData({ ...formData, destination: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">When are you going?</h2>
                  <p className="text-slate-500">Pick your dates to help us synchronize your itinerary.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Start Date</Label>
                    <Input 
                      type="date"
                      className="h-12 rounded-xl bg-slate-50 border-slate-100"
                      value={formData.startDate}
                      onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">End Date</Label>
                    <Input 
                      type="date"
                      className="h-12 rounded-xl bg-slate-50 border-slate-100"
                      value={formData.endDate}
                      onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Almost ready!</h2>
                  <p className="text-slate-500">Set your budget and choose if you want AI assistance.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Budget ($)</Label>
                    <Input 
                      type="number"
                      className="h-12 rounded-xl bg-slate-50 border-slate-100"
                      value={formData.budget}
                      onChange={e => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                    />
                  </div>

                  <Card 
                    className={`border-2 transition-all cursor-pointer overflow-hidden ${formData.useAI ? 'border-orange-500 bg-orange-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                    onClick={() => setFormData({ ...formData, useAI: !formData.useAI })}
                  >
                    <CardContent className="p-6 flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${formData.useAI ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <Sparkles className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-lg">Use AI Planner</h4>
                        <p className="text-slate-500 text-sm">Gemini will suggest activities and optimize your route.</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.useAI ? 'bg-orange-600 border-orange-600' : 'border-slate-200'}`}>
                        {formData.useAI && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-between">
            {step > 1 ? (
              <Button variant="ghost" onClick={prevStep} className="h-12 px-6 rounded-xl font-bold gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            ) : <div />}
            
            <Button 
               onClick={step === 3 ? handleComplete : nextStep} 
               disabled={isGenerating}
               className="bg-orange-600 hover:bg-orange-700 h-12 px-8 rounded-xl font-bold gap-2 min-w-[140px]"
            >
              {isGenerating ? (
                <>Generating...</>
              ) : (
                <>
                  {step === 3 ? 'Create Trip' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
