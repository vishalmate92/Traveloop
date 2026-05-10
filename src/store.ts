import { create } from 'zustand';
import { Trip, User } from './types';

interface AppState {
  user: User | null;
  trips: Trip[];
  currentTrip: Trip | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setTrips: (trips: Trip[]) => void;
  setCurrentTrip: (trip: Trip | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  trips: [],
  currentTrip: null,
  loading: true,
  setUser: (user) => set({ user }),
  setTrips: (trips) => set({ trips }),
  setCurrentTrip: (currentTrip) => set({ currentTrip }),
  setLoading: (loading) => set({ loading }),
}));
