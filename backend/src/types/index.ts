export interface User {
  id: number;
  aadhaar_id?: string;
  phone_number: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin' | 'pharmacist';
  language_preference: string;
  created_at: Date;
}

export interface Doctor {
  id: number;
  user_id: number;
  specialization: string;
  qualifications?: string;
  available: boolean;
  user?: User;
}

export interface Medicine {
  id: number;
  name: string;
  brand?: string;
  stock_quantity: number;
  last_restocked?: Date;
  price: number;
}

export interface MedicalKiosk {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  operating_hours?: string;
  contact_number?: string;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  scheduled_time: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: 'video' | 'audio' | 'in-person';
  symptoms?: string;
  created_at: Date;
  doctor_name?: string;
  specialization?: string;
}

export interface Order {
  id: number;
  patient_id: number;
  kiosk_id: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'ready' | 'cancelled';
  created_at: Date;
  notes?: string;
  kiosk_name?: string;
  kiosk_address?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  medicine_id: number;
  quantity: number;
  price_per_unit: number;
  medicine_name?: string;
}

export interface SymptomAnalysis {
  possible_conditions: string[];
  urgency: 'low' | 'medium' | 'high';
  recommended_action: string;
  general_advice: string;
  disclaimer: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface AuthRequest {
  phoneNumber: string;
}

export interface VerifyOTPRequest {
  userId: number;
  enteredOTP: string;
}

export interface BookAppointmentRequest {
  patient_id: number;
  doctor_id: number;
  scheduled_time: string;
  symptoms: string;
  time_slot: string;    // new
  department: string;   // new
  patient_name?: string;  // new
  doctor_name?: string;
}



export interface PlaceOrderRequest {
  patient_id: number;
  kiosk_id: number;
  items: Array<{
    medicine_id: number;
    quantity: number;
  }>;
  notes?: string;
}

export interface SymptomAnalysisRequest {
  symptoms: string;
}

export interface HealthChatRequest {
  message: string;
}
