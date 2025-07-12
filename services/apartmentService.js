import { supabase } from '../utils/supabase-client';

export const getApartmentsWithProperty = async () => {
  const { data, error } = await supabase
    .from('property_apartments')
    .select(`
      *,
      properties (
        property_name,
        property_type,
        street_address,
        city,
        amenities,
        property_image,
        rules
      )
    `);

  if (error) {
    console.error('Error fetching apartments:', error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    propertyId: item.property_id,
    propertyName: `${item.properties.property_name}, ${item.properties.property_type.charAt(0).toUpperCase() + item.properties.property_type.slice(1)}`,
    unit: item.unit,
    status: item.status,
    monthlyRent: item.monthly_rent,
    amenities: item.properties.amenities,
    rules: item.properties.rules,
    bedrooms: item.numberOfbedRooms || 0,
    bathrooms: item.numberOfBath || 0,
    squareFeet: item.squareFeet || 0,
    location: item.properties.street_address + ', ' + item.properties.city,
    owner: item?.owner || 'N/A',
    ownerContact: item?.ownerContact || '',
    images: item.unitImages || [], // Assuming unitImages is an array of image URLs
  }));
};
