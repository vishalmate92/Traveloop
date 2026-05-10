import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MapPin, GripVertical, Plus, Trash2, Clock, DollarSign, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { TripStop, TripActivity } from '@/types';
import { toast } from 'sonner';

interface SortableItemProps {
  stop: TripStop;
  onDeleteStop: (id: string) => void;
  onAddActivity: (stopId: string, activity: TripActivity) => void;
  onDeleteActivity: (stopId: string, activityId: string) => void;
  [key: string]: any;
}

function SortableStop({ stop, onDeleteStop, onAddActivity, onDeleteActivity }: SortableItemProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState('0');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAdd = () => {
    if (!newTitle) return;
    onAddActivity(stop.id, {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      cost: parseFloat(newCost) || 0,
      category: 'other',
      completed: false
    });
    setNewTitle('');
    setNewCost('0');
    setIsAdding(false);
    toast.success('Activity added');
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-8">
      <Card className="border border-slate-100 shadow-sm relative group overflow-hidden bg-white rounded-[32px] transition-all hover:shadow-xl hover:shadow-slate-200/50">
        <CardContent className="p-8 flex gap-8 items-start">
          <div {...attributes} {...listeners} className="mt-1 cursor-grab active:cursor-grabbing text-slate-200 hover:text-slate-400 transition-colors shrink-0">
            <GripVertical className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                   <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1 font-display">{stop.city}{stop.country && `, ${stop.country}`}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Priority Objective</p>
                </div>
              </div>
              <Badge variant="outline" className="h-8 rounded-full px-4 text-[10px] uppercase font-black tracking-widest text-slate-400 border-slate-100 bg-slate-50/50">
                Segment {stop.order + 1}
              </Badge>
            </div>

            <div className="space-y-4">
              {stop.activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50 group/activity transition-all hover:bg-white hover:border-slate-200 hover:shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-slate-900 shadow-[0_0_0_4px_rgba(0,0,0,0.05)]" />
                    <span className="font-bold text-slate-700">{activity.title}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    {activity.startTime && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-tight">{new Date(activity.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-slate-100 text-slate-900 font-bold text-xs shadow-sm shadow-slate-200/20">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                      <span>{activity.cost}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-xl opacity-0 group-hover/activity:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                      onClick={() => onDeleteActivity(stop.id, activity.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {isAdding ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 bg-slate-950 rounded-[32px] space-y-4 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
                <Input 
                  placeholder="What's the plan?" 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)}
                  className="h-12 bg-white/10 border-white/10 text-white placeholder:text-white/30 rounded-xl"
                />
                <div className="flex gap-3">
                   <div className="relative flex-1">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <Input 
                        type="number"
                        placeholder="Cost" 
                        value={newCost} 
                        onChange={e => setNewCost(e.target.value)}
                        className="pl-10 h-12 bg-white/10 border-white/10 text-white placeholder:text-white/30 rounded-xl"
                      />
                   </div>
                   <Button onClick={handleAdd} className="bg-white text-slate-950 hover:bg-white/90 h-12 px-8 rounded-xl font-bold">Add Action</Button>
                   <Button variant="ghost" onClick={() => setIsAdding(false)} className="h-12 w-12 p-0 rounded-xl text-white hover:bg-white/10">
                      <X className="w-5 h-5" />
                   </Button>
                </div>
              </motion.div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-6 border border-dashed border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all h-14 rounded-2xl gap-3 font-bold text-sm tracking-tight"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="w-5 h-5" /> Add New Activity
              </Button>
            )}
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl"
            onClick={() => onDeleteStop(stop.id)}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface Props {
  stops: TripStop[];
  onUpdate: (newStops: TripStop[]) => void;
}

export default function ItineraryBuilder({ stops, onUpdate }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = stops.findIndex(s => s.id === active.id);
      const newIndex = stops.findIndex(s => s.id === over.id);
      
      const reordered = arrayMove(stops, oldIndex, newIndex).map((s, i) => ({
        ...s,
        order: i
      }));
      
      onUpdate(reordered);
    }
  }

  const handleDeleteStop = (id: string) => {
    onUpdate(stops.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i })));
    toast.success('Stop removed');
  };

  const handleAddStop = () => {
    const city = prompt('Enter destination name (City, Country):');
    if (!city) return;
    
    const newStop: TripStop = {
      id: Math.random().toString(36).substr(2, 9),
      city,
      country: '',
      order: stops.length,
      arrivalDate: Date.now(),
      departureDate: Date.now(),
      activities: []
    };
    onUpdate([...stops, newStop]);
    toast.success('New destination added to route');
  };

  const handleAddActivity = (stopId: string, activity: TripActivity) => {
    onUpdate(stops.map(s => s.id === stopId ? { ...s, activities: [...s.activities, activity] } : s));
  };

  const handleDeleteActivity = (stopId: string, activityId: string) => {
    onUpdate(stops.map(s => s.id === stopId ? { ...s, activities: s.activities.filter(a => a.id !== activityId) } : s));
    toast.success('Activity removed');
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-slate-950 text-2xl tracking-tight font-display mb-1">Architecture</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chronological Route Optimization</p>
        </div>
        <Button 
          variant="outline" 
          className="rounded-[18px] h-12 px-6 gap-2 font-bold text-slate-900 border-slate-200 hover:bg-slate-50 transition-all active:scale-95 shadow-sm shadow-slate-100"
          onClick={handleAddStop}
        >
          <Plus className="w-5 h-5" /> Append Destination
        </Button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={stops.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="relative">
            {/* Timeline Line */}
            {stops.length > 1 && (
              <div className="absolute left-[3.25rem] top-10 bottom-10 w-[2px] bg-gradient-to-b from-slate-200 via-slate-100 to-transparent -z-10" />
            )}
            {stops.map(stop => (
              <SortableStop 
                key={stop.id} 
                stop={stop} 
                onDeleteStop={handleDeleteStop}
                onAddActivity={handleAddActivity}
                onDeleteActivity={handleDeleteActivity}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {stops.length === 0 && (
        <div className="border border-dashed border-slate-200 rounded-[48px] p-24 text-center bg-white shadow-2xl shadow-slate-100/50">
          <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-inner">
            <MapPin className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2 font-display">Route is Unconfigured</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10">Architect your journey by defining your first destination and its associated actions.</p>
          <Button 
            className="bg-slate-950 hover:bg-slate-900 h-14 px-10 rounded-[20px] font-bold shadow-2xl transition-all active:scale-95"
            onClick={handleAddStop}
          >
            Initiate First Destination
          </Button>
        </div>
      )}
    </div>
  );
}
