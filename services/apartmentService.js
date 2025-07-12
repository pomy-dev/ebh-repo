import { supabase } from '../utils/supabase-client';

export const getApartmentsWithProperty = async () => {
  const { data, error } = await supabase
    .from('property_apartments')
    .select(`
      id,
      unit,
      status,
      numberOfbedRooms,
      numberOfBath,
      squareFeet,
      monthly_rent,
      property_id,
      tenant_id,
      images,
      properties (
        property_name,
        property_type,
        street_address,
        city,
        amenities,
        property_image,
        rules,
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
    image: item.properties.property_image
  }));
};
