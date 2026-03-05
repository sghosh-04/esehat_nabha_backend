// src/models/user.ts
export interface User {
    id?: number;
    aadhaar_id?: string;
    phone_number: string;
    name: string;
    language_preference?: string;
    email?: string;
    dob?: string;
    gender?: string;
    address?: string;
    city?: string;
    pincode?: string;
    created_at?: Date;
}
