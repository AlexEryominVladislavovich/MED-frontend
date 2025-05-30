export interface Doctor {
  id: number;
  user: {
    first_name: string;
    last_name: string;
  };
  patronymic: string;
  photo_url: string;
  photos: DoctorPhoto[];
  specialization: Array<{ name_specialization: string }>;
  bio: string;
}

export interface DoctorPhoto {
  id: number;
  photo_url: string;
  order: number;
}

export interface TimeSlot {
  id: number;
  date: string;
  start_time: string;
  is_available: boolean;
} 