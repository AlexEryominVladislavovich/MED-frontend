import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import { Doctor } from '../../types';

interface DoctorInfoProps {
  doctor: Doctor;
}

const DoctorInfo: React.FC<DoctorInfoProps> = ({ doctor }) => {
  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box
            component="img"
            src={doctor.photo_url}
            alt={`${doctor.user.last_name} ${doctor.user.first_name}`}
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 2,
              boxShadow: 3
            }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            {doctor.user.last_name} {doctor.user.first_name} {doctor.patronymic}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            {doctor.specialization.map((s: { name_specialization: string }) => s.name_specialization).join(', ')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {doctor.bio}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DoctorInfo; 