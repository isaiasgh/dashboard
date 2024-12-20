import React, { useState, useEffect } from 'react';
import WeatherOverview from './components/WeatherOverview';
import TableWeather from './components/TableWeather';
import LineChartWeather from './components/LineChartWeather';
import IndicatorWeather from './components/IndicatorWeather';
import CitySearchForm from './components/CitySearchForm';
import './App.css';
import './Index.css';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography, Grid, Container } from '@mui/material';

import { fetchHistoricalWeatherData, fetchCoordinates } from './util/api-ref';

const theme = createTheme({
    typography: {
        h1: {
            fontSize: '2rem',
        },
        h2: {
            fontSize: '1.8rem',
            marginTop: 30,
            marginBottom: 30
        },
    },
});

type Item = {
    id?: number;
    dateStart: string;
    dateEnd: string;
    precipitation: string;
    humidity: string;
    clouds: string;
};

const App: React.FC = () => {
    const [cityInput, setCityInput] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('Guayaquil');
    const [forecastData, setForecastData] = useState<any>(null);
    const [historicalType] = useState<string>('temperature');
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const request = async () => {
            let savedTextXML = localStorage.getItem("openWeatherMap") || "";
            let expiringTime = localStorage.getItem("expiringTime");
            let nowTime = new Date().getTime();

            if (expiringTime === null || nowTime > parseInt(expiringTime)) {
                const API_KEY = "56ceb39df96255310e632dac07c3e9bf";
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
                savedTextXML = await response.text();

                let hours = 0.01;
                let delay = hours * 3600000;
                let newExpiringTime = nowTime + delay;

                localStorage.setItem("openWeatherMap", savedTextXML);
                localStorage.setItem("expiringTime", newExpiringTime.toString());
            }

            if (savedTextXML) {
                const parser = new DOMParser();
                const xml = parser.parseFromString(savedTextXML, "application/xml");

                let dataToItems: Item[] = [];

                const times = xml.getElementsByTagName("time");

                const extractTime = (datetime: string) => {
                    const date = new Date(datetime);
                    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                };

                for (let i = 0; i < times.length; i++) {
                    if (dataToItems.length >= 6) break;

                    const time = times[i];

                    const dateStart = extractTime(time.getAttribute("from") || "");
                    const dateEnd = extractTime(time.getAttribute("to") || "");

                    const precipitationElement = time.getElementsByTagName("precipitation")[0];
                    const precipitation = precipitationElement?.getAttribute("probability") || "";

                    const humidityElement = time.getElementsByTagName("humidity")[0];
                    const humidity = humidityElement?.getAttribute("value") || "";

                    const cloudsElement = time.getElementsByTagName("clouds")[0];
                    const clouds = cloudsElement?.getAttribute("all") || "";

                    dataToItems.push({
                        dateStart,
                        dateEnd,
                        precipitation,
                        humidity,
                        clouds,
                    });
                }

                const limitedDataToItems = dataToItems.slice(0, 6);

                setItems(limitedDataToItems);
            }
        };

        request();
    }, []);

    useEffect(() => {
        if (selectedCity) {
            handleCityChange(selectedCity);
        }
    }, [selectedCity, historicalType]);

    const handleCityChange = async (city: string) => {
        try {
            const { lat, lon, country } = await fetchCoordinates(city);
            if (country !== 'EC') {
                alert('Ingresa una ciudad de Ecuador.');
                return;
            }

            setSelectedCity(city);

            const now = new Date();
            const startDate = now.toISOString().split('T')[0];
            now.setDate(now.getDate() + 3);
            const endDate = now.toISOString().split('T')[0];
            const forecast = await fetchHistoricalWeatherData(lat, lon, startDate, endDate, historicalType);
            setForecastData(forecast);
        } catch (err) {
            console.error('Error obteniendo los datos:', err);
        }
    };

    const handleSearchCity = () => {
        if (cityInput.trim() !== '') {
            handleCityChange(cityInput);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ py: 4, mt: 8 }} >
                <Grid container id="city-selector">
                    <Grid item xs={12}>
                    <Typography 
                        sx={{ fontSize: 40, color: '#FF5733' }} 
                        variant="h1" 
                        gutterBottom 
                        align="center"
                    >
                        Ecuador - Weather Dashboard
                    </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <CitySearchForm
                            cityInput={cityInput}
                            setCityInput={setCityInput}
                            handleSearchCity={handleSearchCity}
                        />
                    </Grid>
                    <Grid item id="indicators" alignItems="center" xs={12} py={2}>
                        <Grid item xs={12}>
                            <WeatherOverview city={selectedCity.toUpperCase()} />
                        </Grid>
                    </Grid>
                    <Grid container id="forecast" direction="row" spacing={2}>
                        <Grid item lg={12} xs={6} id="historical">
                            <LineChartWeather city={selectedCity} historicalType={historicalType} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TableWeather weatherData={items} />
                        </Grid>
                        <Grid container spacing={2} direction="column" md={6}>
                            {[1, 2, 3].map(index => (
                                <Grid item xs={12} sm={3} key={index}>
                                    <IndicatorWeather
                                        forecastData={forecastData}
                                        historicalType={historicalType}
                                        index={index}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
}

export default App;