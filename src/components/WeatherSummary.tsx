import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

interface ResumeComponentProps {
  city: string;
  country: string;
  condition: string;
  icon: string;
}

const WeatherSummary: React.FC<ResumeComponentProps> = ({ icon }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#2C2C2C' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item lg={12} xs={12} id="izquierda" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 'auto' }}>
          <Grid container sx={{ textAlign: 'center' }}>
            <Grid item xs={12}>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: 'white' }}>{formattedTime}</Typography>
            </Grid>
            <Grid item xs={12}>
              <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt="weather icon" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default WeatherSummary;