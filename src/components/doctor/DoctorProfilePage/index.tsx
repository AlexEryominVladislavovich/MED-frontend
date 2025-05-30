import React from 'react';
import styles from './styles.module.css';
import PhotoGallery from '../PhotoGallery';
import { DoctorCalendar } from '../DoctorCalendar';
import { useParams, Navigate } from 'react-router-dom';
import { Doctor } from '../../../types';

interface DoctorProfilePageProps {}

export const DoctorProfilePage: React.FC<DoctorProfilePageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = React.useState<Doctor | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = React.useState(0);

  // Early return if no id is provided
  if (!id) {
    return <Navigate to="/doctors" replace />;
  }

  React.useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`/api/doctors/${id}`);
        const data = await response.json();
        setDoctor(data);
      } catch (error) {
        console.error('Error fetching doctor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!doctor) return <div>Doctor not found</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Photo Gallery</h1>
      {doctor.photos && doctor.photos.length > 0 && (
        <PhotoGallery 
          photos={doctor.photos}
          mainPhotoUrl={doctor.photo_url}
          selectedPhotoIndex={selectedPhotoIndex}
          onPhotoSelect={setSelectedPhotoIndex}
        />
      )}
      
      <div className={styles.calendarSection}>
        <h2 className={styles.subtitle}>Schedule an Appointment</h2>
        <DoctorCalendar doctorId={id} />
      </div>
    </div>
  );
}; 