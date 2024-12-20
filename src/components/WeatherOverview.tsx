import React, { useEffect, useState } from 'react';
import { fetchClimateData } from '../util/api-ref';
import { Grid, Paper, Typography } from '@mui/material';
import WeatherMetrics from './WeatherMetrics';
import WeatherSummary from './WeatherSummary';

interface WeatherOverviewProps {
    city: string;
}

const WeatherOverview: React.FC<WeatherOverviewProps> = ({ city }) => {
    const [temperature, setTemperature] = useState<number | null>(null);
    const [feelsLike, setFeelsLike] = useState<number | null>(null);
    const [humidity, setHumidity] = useState<number | null>(null);
    const [condition, setCondition] = useState<string | null>(null);
    const [country, setCountry] = useState<string | null>(null);
    const [icon, setIcon] = useState<string | null>(null);
    const [pressure, setPressure] = useState<number | null>(null);
    const [windSpeed, setWindSpeed] = useState<number | null>(null);
    const [windDirection, setWindDirection] = useState<string | null>(null);
    const [visibility, setVisibility] = useState<number | null>(null);
    const [lastUpdate, setLastUpdate] = useState<string | null>(null);
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchClimateData(city);
            const temperatureKelvin = parseFloat(result.querySelector('temperature')?.getAttribute('value') || '0');
            const temperatureCelsius = temperatureKelvin - 273.15;
            const feelsLikeKelvin = parseFloat(result.querySelector('feels_like')?.getAttribute('value') || '0');
            const feelsLikeCelsius = feelsLikeKelvin - 273.15;
            const humidity = parseFloat(result.querySelector('humidity')?.getAttribute('value') || '0');
            const condition = result.querySelector('weather')?.getAttribute('value');
            const country = result.querySelector('country')?.textContent;
            const iconCode = result.querySelector('weather')?.getAttribute('icon');
            const pressure = parseFloat(result.querySelector('pressure')?.getAttribute('value') || '0');
            const windSpeed = parseFloat(result.querySelector('speed')?.getAttribute('value') || '0');
            const windDirection = result.querySelector('direction')?.getAttribute('name');
            const visibility = parseFloat(result.querySelector('visibility')?.getAttribute('value') || '0');
            const lastUpdate = result.querySelector('precipitation')?.getAttribute('mode');
            const lat = parseFloat(result.querySelector('city')?.getAttribute('lat') || '0');
            const lng = parseFloat(result.querySelector('city')?.getAttribute('lon') || '0');

            setTemperature(temperatureCelsius);
            setFeelsLike(feelsLikeCelsius);
            setHumidity(humidity);
            setCondition(condition || '');
            setCountry(country || '');
            setIcon(iconCode || '');
            setPressure(pressure);
            setWindSpeed(windSpeed);
            setWindDirection(windDirection || '');
            setVisibility(visibility);
            setLastUpdate(lastUpdate || '');
            setLat(lat);
            setLng(lng);
        };
        fetchData();
    }, [city]);

    return (
        <Grid container spacing={2} direction="row" sx={{ width: '100%' }}>
            <Grid
                item
                xs={12}
                md={4}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                {lat !== null && lng !== null && (
                    <WeatherSummary
                        city={city}
                        country={country ?? ''}
                        condition={condition ?? ''}
                        icon={icon ?? ''}
                    />
                )}
            </Grid>

            <Grid item xs={12} md={8}>
                <Typography
                    variant="h2"
                    align="center"
                    sx={{
                        fontWeight: 'bold',
                        color: '#FF5733',
                    }}
                >
                    {city}
                </Typography>
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 2,
                        padding: 4,
                        backgroundColor: '#001f3f',
                        color: '#FFDC00',
                    }}
                >
                    <Grid container spacing={2} sx={{ width: '100%' }}>
                        <WeatherMetrics
                            title="Temperatura Actual"
                            value={`${temperature?.toFixed(2)}°C`}
                            lgSize={3}
                        />
                        <WeatherMetrics
                            title="Sensación Térmica"
                            value={`${feelsLike?.toFixed(2)}°C`}
                            lgSize={3}
                        />
                        <WeatherMetrics
                            title="Humedad"
                            value={`${humidity?.toFixed(2)}%`}
                            lgSize={3}
                        />
                        <WeatherMetrics
                            title="Condición"
                            value={condition ?? ''}
                            lgSize={3}
                        />
                        <WeatherMetrics
                            title="Presión"
                            value={`${pressure?.toFixed(2)} hPa`}
                            lgSize={3}
                        />
                        <WeatherMetrics
                            title="Viento"
                            value={`${windSpeed?.toFixed(2)} m/s, ${windDirection}`}
                            lgSize={3}
                        />
                        <WeatherMetrics
                            title="Visibilidad"
                            value={`${visibility?.toFixed(2)} m`}
                            lgSize={3}
                        />
                        <WeatherMetrics title="Lluvia" value={lastUpdate ?? ''} lgSize={3} />
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default WeatherOverview;