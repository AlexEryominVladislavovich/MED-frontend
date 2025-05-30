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
    patronymic: string;
    room_number: string;
    bio: string;
    phone_number: string;
    specialization: Specialization[];
    photo_url: string;
    photos: DoctorPhoto[];
    is_active: boolean;
}

export interface TimeSlot {
    id: number;
    doctor: number;
    template?: number;
    date: string;
    start_time: string;
    duration: number;
    slot_type: 'examination' | 'treatment';
    is_available: boolean;
    created_at: string;
    updated_at: string;
} 