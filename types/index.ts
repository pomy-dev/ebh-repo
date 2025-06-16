export interface Property {
  id: string;
  name: string;
  location: string;
  image: string;
  owner: string;
  ownerContact: string;
  apartments: Apartment[];
}

export interface Apartment {
  id: string;
  propertyId: string;
  propertyName: string;
  unit: string;
  isOccupied: boolean;
  monthlyRent: number;
  amenities: string[];
  rules: string[];
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  location: string;
  owner: string;
  ownerContact: string;
  image: string;
}

export interface MaintenanceRequest {
  id: string;
  apartmentId: string;
  propertyName: string;
  unit: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  dateSubmitted: string;
  dateCompleted?: string;
  estimatedCost?: number;
  images?: string[];
}

export interface Payment {
  id: string;
  apartmentId: string;
  propertyName: string;
  unit: string;
  amount: number;
  type: 'rent' | 'deposit' | 'maintenance' | 'utilities';
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  description: string;
}

export interface RentRequest {
  id: string;
  apartmentId: string;
  propertyName: string;
  unit: string;
  applicantName: string;
  email: string;
  phone: string;
  monthlyIncome: number;
  employmentStatus: string;
  employer: string;
  references: string;
  moveInDate: string;
  status: 'pending' | 'approved' | 'rejected';
  dateSubmitted: string;
}

export interface UserApartment {
  id: string;
  apartmentId: string;
  propertyName: string;
  unit: string;
  monthlyRent: number;
  leaseStart: string;
  leaseEnd: string;
  location: string;
  image: string;
}