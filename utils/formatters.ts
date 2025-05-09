// Format credit card number with spaces
export const formatCardNumber = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-digits
  const cardNumber = value.replace(/\D/g, '');
  
  // Add space after every 4 digits
  const formatted = cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  
  return formatted;
};

// Format expiry date with slash (MM/YY)
export const formatExpiryDate = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-digits
  const numbers = value.replace(/\D/g, '');
  
  // Format as MM/YY
  if (numbers.length <= 2) {
    return numbers;
  } else {
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
  }
};