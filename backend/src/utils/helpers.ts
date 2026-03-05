// src/utils/helpers.ts

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Validate phone number
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/; // Indian format example
  return phoneRegex.test(phoneNumber);
};

// Format API response with generic type
export const formatResponse = <T>(
  success: boolean,
  message?: string,
  data?: T
) => {
  return {
    success,
    message,
    data,
  };
};