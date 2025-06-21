export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface Specialization {
    id: number;
    name_specialization: string;
    description_specialization: string;
}

export interface DoctorPhoto {
    id: number;
    photo_url: string;
    order: number;
}

export interface Doctor {
    id: number;
    user: User;
    specialization: Specialization[];
    photo_url: string;
    bio: string;
    room_number: string;
    phone_number: string;
    patronymic: string;
    photos: DoctorPhoto[];
    is_active: boolean;
}

export interface TimeSlot {
    id: number;
    doctor: number;
    date: string;
    start_time: string;
    end_time: string;
    duration: number;
    slot_type: 'consultation' | 'treatment';
    slot_type_display: string;
    is_available: boolean;
    created_at?: string;
    updated_at?: string;
} 