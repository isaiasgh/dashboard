import React from 'react';
import WeatherMetrics from './WeatherMetrics';
import { Box } from '@mui/material';

interface IndicatorWeatherProps {
    forecastData: any;
    historicalType: string;
    index: number;
}

const IndicatorWeather: React.FC<IndicatorWeatherProps> = ({ forecastData, historicalType, index }) => {
    const getValue = () => {
        let value;
        switch (historicalType) {
            case 'temperature':
                value = forecastData?.daily?.temperature_2m_max?.[index];
                return value !== undefined ? `${value} °C` : 'Cargando...';
            case 'humidity':
                value = forecastData?.daily?.relative_humidity_2m_max?.[index];
                return value !== undefined ? `${value} %` : 'Cargando...';
            case 'precipitation':
                value = forecastData?.daily?.precipitation_sum?.[index];
                return value !== undefined ? `${value} mm` : 'Cargando...';
            default:
                return 'Cargando...';
        }
    };

    const getDate = () => {
        const now = new Date();
        now.setDate(now.getDate() + index);
        return now.toLocaleDateString('es-ES', { month: 'long', day: 'numeric' });
    };

    return (
        <Box sx={{ backgroundColor: 'rgba(0, 123, 255, 0.5)', padding: 2, borderRadius: 2 }}>
            <WeatherMetrics
                title={`${getDate()}`}
                value={getValue()}
                xsSize={12}
            />
        </Box>
    );
};

export default IndicatorWeather;
