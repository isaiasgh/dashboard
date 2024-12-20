import React from 'react';
import { Paper, Typography, Box, Grid } from '@mui/material';
import { WiThermometer, WiHumidity, WiBarometer, WiStrongWind, WiRaindrop, WiFog, WiCloudy } from 'react-icons/wi';

interface IndicatorProps {
    title: string;
    value: string | number;
    lgSize?: number;
    xsSize?:number;
}

const getIconByTitle = (title: string) => {
    switch (title.toLowerCase()) {
        case 'temperatura actual':
        case 'sensación térmica':
            return <WiThermometer size={32} />;
        case 'humedad':
            return <WiHumidity size={32} />;
        case 'condición':
            return <WiCloudy size={32} />;
        case 'presión':
            return <WiBarometer size={32} />;
        case 'viento':
            return <WiStrongWind size={32} />;
        case 'visibilidad':
            return <WiFog size={32} />;
        case 'lluvia':
            return <WiRaindrop size={32} />;
        default:
            return <WiCloudy size={32} />;
    }
};

const WeatherMetrics: React.FC<IndicatorProps> = ({ title, value, lgSize = 12,xsSize = 6 }) => {
    const resolvedIcon = getIconByTitle(title);

    return (
        <Grid item lg={lgSize} xs={xsSize} sx={{ display: 'flex' }}>
            <Paper 
                elevation={1} 
                sx={{ 
                    py: 2, 
                    textAlign: 'center', 
                    borderRadius: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center', 
                    width: '100%',
                    flexGrow: 1, 
                    backgroundColor: '#0074D9',
                    transition: 'background-color 0.3s', 
                    '&:hover': {
                        backgroundColor: '#005bb5'
                    } 
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                    {title}
                </Typography>
                <Box sx={{ color: 'white' }}>
                    {resolvedIcon}
                </Box>
                <Typography variant="h6" sx={{ ml: resolvedIcon ? 1 : 0, color: 'white' }}>
                    {value}
                </Typography>
            </Paper>
        </Grid>
    );    
};

export default WeatherMetrics;