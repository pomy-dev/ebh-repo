import { Property, Apartment, MaintenanceRequest, Payment, UserApartment } from '../types';

export const properties: Property[] = [
  {
    id: '1',
    name: 'Sunset Gardens',
    location: 'Downtown District',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
    owner: 'Sarah Johnson',
    ownerContact: 'sarah.johnson@email.com',
    apartments: []
  },
  {
    id: '2',
    name: 'Riverside Apartments',
    location: 'Riverside Avenue',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    owner: 'Michael Chen',
    ownerContact: 'michael.chen@email.com',
    apartments: []
  },
  {
    id: '3',
    name: 'Pine Valley Complex',
    location: 'Pine Valley Road',
    image: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg',
    owner: 'Emily Rodriguez',
    ownerContact: 'emily.rodriguez@email.com',
    apartments: []
  }
];

export const apartments: Apartment[] = [
  {
    id: '1',
    propertyId: '1',
    propertyName: 'Sunset Gardens',
    unit: 'A101',
    isOccupied: false,
    monthlyRent: 1200,
    amenities: ['Air Conditioning', 'Balcony', 'Parking', 'Pool Access'],
    rules: [
      'No pets allowed',
      'Quiet hours from 10 PM to 8 AM',
      'No smoking inside the apartment',
      'Guest policy: Maximum 2 guests at a time'
    ],
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 850,
    location: 'Downtown District',
    owner: 'Sarah Johnson',
    ownerContact: 'sarah.johnson@email.com',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'
  },
  {
    id: '2',
    propertyId: '1',
    propertyName: 'Sunset Gardens',
    unit: 'A102',
    isOccupied: true,
    monthlyRent: 1150,
    amenities: ['Air Conditioning', 'Parking', 'Pool Access'],
    rules: [
      'No pets allowed',
      'Quiet hours from 10 PM to 8 AM',
      'No smoking inside the apartment'
    ],
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 700,
    location: 'Downtown District',
    owner: 'Sarah Johnson',
    ownerContact: 'sarah.johnson@email.com',
    image: 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg'
  },
  {
    id: '3',
    propertyId: '2',
    propertyName: 'Riverside Apartments',
    unit: 'B201',
    isOccupied: false,
    monthlyRent: 1500,
    amenities: ['River View', 'Balcony', 'Parking', 'Gym Access', 'Pet Friendly'],
    rules: [
      'Pets allowed with deposit',
      'Quiet hours from 9 PM to 8 AM',
      'No smoking in common areas',
      'Keep balcony clean and organized'
    ],
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1200,
    location: 'Riverside Avenue',
    owner: 'Michael Chen',
    ownerContact: 'michael.chen@email.com',
    image: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg'
  },
  {
    id: '4',
    propertyId: '3',
    propertyName: 'Pine Valley Complex',
    unit: 'C301',
    isOccupied: false,
    monthlyRent: 1350,
    amenities: ['Mountain View', 'Fireplace', 'Parking', 'Garden Access'],
    rules: [
      'No pets in this unit',
      'Quiet hours from 10 PM to 7 AM',
      'No smoking anywhere on property',
      'Fireplace use only during winter months'
    ],
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 950,
    location: 'Pine Valley Road',
    owner: 'Emily Rodriguez',
    ownerContact: 'emily.rodriguez@email.com',
    image: 'https://images.pexels.com/photos/1571452/pexels-photo-1571452.jpeg'
  }
];

export const userApartments: UserApartment[] = [
  {
    id: '1',
    apartmentId: '2',
    propertyName: 'Sunset Gardens',
    unit: 'A102',
    monthlyRent: 1150,
    leaseStart: '2024-01-01',
    leaseEnd: '2024-12-31',
    location: 'Downtown District',
    image: 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg'
  }
];

export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: '1',
    apartmentId: '2',
    propertyName: 'Sunset Gardens',
    unit: 'A102',
    title: 'Leaking Faucet',
    description: 'Kitchen faucet has been dripping continuously for the past week',
    priority: 'medium',
    status: 'in-progress',
    dateSubmitted: '2024-01-15',
    estimatedCost: 150
  },
  {
    id: '2',
    apartmentId: '2',
    propertyName: 'Sunset Gardens',
    unit: 'A102',
    title: 'Heating Issue',
    description: 'Heater is not working properly, apartment is too cold',
    priority: 'high',
    status: 'pending',
    dateSubmitted: '2024-01-20'
  }
];

export const payments: Payment[] = [
  {
    id: '1',
    apartmentId: '2',
    propertyName: 'Sunset Gardens',
    unit: 'A102',
    amount: 1150,
    type: 'rent',
    dueDate: '2024-02-01',
    status: 'pending',
    description: 'February 2024 Rent'
  },
  {
    id: '2',
    apartmentId: '2',
    propertyName: 'Sunset Gardens',
    unit: 'A102',
    amount: 1150,
    type: 'rent',
    dueDate: '2024-01-01',
    paidDate: '2024-01-01',
    status: 'paid',
    description: 'January 2024 Rent'
  },
  {
    id: '3',
    apartmentId: '2',
    propertyName: 'Sunset Gardens',
    unit: 'A102',
    amount: 150,
    type: 'maintenance',
    dueDate: '2024-01-25',
    status: 'pending',
    description: 'Kitchen faucet repair'
  }
];