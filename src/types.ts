export type TripStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type TripVisibility = 'private' | 'public' | 'shared';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: number;
}

export interface TripStop {
  id: string;
  city: string;
  country: string;
  description?: string;
  arrivalDate: number;
  departureDate: number;
  order: number;
  activities: TripActivity[];
  notes?: string;
}

export interface TripActivity {
  id: string;
  title: string;
  category: 'adventure' | 'food' | 'culture' | 'sightseeing' | 'nightlife' | 'nature' | 'other';
  startTime?: number;
  duration?: number; // in minutes
  cost: number;
  notes?: string;
  completed: boolean;
}

export interface PackingItem {
  id: string;
  title: string;
  category: 'clothing' | 'electronics' | 'documents' | 'essentials' | 'other';
  packed: boolean;
}

export interface Trip {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  startDate: number;
  endDate: number;
  coverImage?: string;
  status: TripStatus;
  visibility: TripVisibility;
  budget: {
    total: number;
    categories: {
      transport: number;
      accommodation: number;
      food: number;
      activities: number;
      other: number;
    };
  };
  stops: TripStop[];
  packingList: PackingItem[];
  sharedWith: string[]; // User IDs
  createdAt: number;
  updatedAt: number;
}

export interface SavedDestination {
  id: string;
  city: string;
  country: string;
  description: string;
  image: string;
  userId: string;
  createdAt: number;
}
