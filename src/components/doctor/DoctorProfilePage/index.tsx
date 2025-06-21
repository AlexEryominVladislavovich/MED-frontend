import React from 'react';
import styles from './styles.module.css';
import { useParams, Navigate } from 'react-router-dom';
import { Doctor } from '../../../types';
import DoctorGallery from '../DoctorGallery';
import AppointmentCalendar from '../AppointmentCalendar';

export const DoctorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = React.useState<Doctor | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = React.useState(0);

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
    <div className={styles.pageWrapper}>
      <div className={styles.gallerySection}>
      {doctor.photos && doctor.photos.length > 0 && (
          <DoctorGallery 
          photos={doctor.photos}
          mainPhotoUrl={doctor.photo_url}
          selectedPhotoIndex={selectedPhotoIndex}
          onPhotoSelect={setSelectedPhotoIndex}
        />
      )}
      </div>
      
      <div className={styles.contentSection}>
        <div className={styles.container}>
      <div className={styles.calendarSection}>
            <h2 className={styles.subtitle}>Записаться на прием</h2>
            <AppointmentCalendar doctorId={parseInt(id, 10)} />
          </div>
        </div>
      </div>
    </div>
  );
}; 