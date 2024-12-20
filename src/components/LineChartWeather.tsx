import React, { useState, useEffect } from 'react';
import { fetchCoordinates, fetchHistoricalWeatherData } from '../util/api-ref';
import { Typography, Paper, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

interface LineChartWeatherProps {
    city: string;
    historicalType: string;
}

const LineChartWeather: React.FC<LineChartWeatherProps> = ({ city, historicalType }) => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string>('temperature');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { lat, lon } = await fetchCoordinates(city);
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(endDate.getDate() - 6);

                const formattedEndDate = endDate.toISOString().split('T')[0];
                const formattedStartDate = startDate.toISOString().split('T')[0];

                const historicalData = await fetchHistoricalWeatherData(lat, lon, formattedStartDate, formattedEndDate, selectedType);

                if (!historicalData.daily) {
                    throw new Error('No hay datos disponibles');
                }

                const dataKey = {
                    temperature: 'temperature_2m_max',
                    humidity: 'relative_humidity_2m_max',
                    precipitation: 'precipitation_sum',
                }[selectedType];

                if (dataKey !== undefined) {
                    if (!historicalData.daily[dataKey]) {
                        throw new Error(`No data available for ${dataKey}`);
                    }

                    const formattedData = historicalData.daily[dataKey].map((value: number, i: number) => {
                        const date = new Date();
                        date.setDate(date.getDate() - i);
                        return { date: date.toLocaleDateString(), value };
                    }).reverse();

                    if (formattedData.length > 0) {
                        setChartData(formattedData);
                        setError(null);
                    } else {
                        setError('No hay datos disponibles para esta ciudad.');
                    }
                }

            } catch (error) {
                setError(`Error en el fetch: ${(error as Error).message}`);
                console.error('Error al hacer fetch:', error);
            }
        };
        fetchData();
    }, [city, selectedType]);

    const getTooltipLabel = (type: string) => {
        switch (type) {
            case 'temperature':
                return 'Temperatura';
            case 'humidity':
                return 'Humedad';
            case 'precipitation':
                return 'Precipitación';
            default:
                return 'Valor';
        }
    };

    return (
        <Paper
            elevation={5}
            sx={{
                borderRadius: 4,
                padding: 3,
                backgroundColor: '#1f1f1f', 
                color: '#fff',
                boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 'bold',
                    mb: 3,
                    textAlign: 'center',
                    color: '#FF5733',
                }}
            >
                {city.charAt(0).toUpperCase() + city.slice(1)} - Datos de la última semana
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="historicalTypeLabel" sx={{ color: '#fff' }}>Tipo de dato</InputLabel>
                <Select
                    labelId="historicalTypeLabel"
                    id="historicalType"
                    value={selectedType}
                    label="Tipo de dato"
                    onChange={(e) => setSelectedType(e.target.value)}
                    sx={{ backgroundColor: '#333', color: '#fff' }}
                >
                    <MenuItem value="temperature">Temperatura</MenuItem>
                    <MenuItem value="humidity">Humedad</MenuItem>
                    <MenuItem value="precipitation">Precipitación</MenuItem>
                </Select>
            </FormControl>

            {error ? (
                <Typography variant="body1" color="error" sx={{ textAlign: 'center' }}>
                    {error}
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#8884d8" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#fff' }}
                                tickSize={12}
                                axisLine={{ stroke: '#8884d8' }}
                            />
                            <YAxis
                                tick={{ fill: '#fff' }}
                                tickSize={12}
                                axisLine={{ stroke: '#8884d8' }}
                            />
                            <Tooltip
                                labelStyle={{ color: '#FF5733' }}
                                formatter={(value) => [`${value}`, getTooltipLabel(selectedType)]}
                            />
                            <Line
                                type="monotoneX"
                                dataKey="value"
                                stroke="#FF5733"
                                fill="url(#colorUv)"
                                fillOpacity={1}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Paper>
    );
};

export default LineChartWeather;
