import { supabase } from '../utils/supabase-client';
export const getApartmentsWithProperty = async () => {
  const { data, error } = await supabase
    .from('property_apartments')
    .select(`
      id,
      unit,
      isOccupied,
      amenities,
      rules,
      features,
      property_id,
      properties (
        property_name,
        property_type,
        street_address,
        city,
        monthly_rent,
        property_image
      )
    `);

  if (error) {
    console.error('Error fetching apartments:', error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    propertyId: item.property_id,
    propertyName: `${item.properties.property_name} , ${item.properties.property_type}`,
    unit: item.unit,
    isOccupied: item.isOccupied || false,
    monthlyRent: item.properties.monthly_rent,
    amenities: item.amenities,
    rules: item.rules,
    bedrooms: item.features?.bedrooms || 0,
    bathrooms: item.features?.bathrooms || 0,
    squareFeet: item.features?.squareFeet || 0,
    location: item.properties.street_address + ', ' + item.properties.city,
    owner: item.features?.owner || 'N/A',
    ownerContact: item.features?.ownerContact || '',
    image: item.properties.property_image
  }));
};
