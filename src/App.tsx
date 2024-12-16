// import { useState } from 'react'

import './App.css'
import Grid from '@mui/material/Grid2'

import IndicatorWeather from './components/IndicatorWeather.tsx';

import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';

import LineChartWeather from './components/LineChartWeather';

import { useEffect, useState } from 'react';

import Item from '../src/interface/Item.tsx'

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);

  const addItem = (newItem: Item) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  // Función para eliminar un elemento por su id
  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };
  
  // const [count, setCount] = useState(0)

  {/* Variable de estado y función de actualización */ }
  let [indicators, setIndicators] = useState<Indicator[]>([])
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))

  {/* Hook: useEffect */ }

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
      
        // Crear el arreglo temporal
        let dataToItems: Item[] = [];
      
        // Obtener todas las etiquetas <time>
        const times = xml.getElementsByTagName("time");


        const extractTime = (datetime: string) => {
          const date = new Date(datetime); // Crear un objeto Date con la cadena
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Formatear solo la hora
        };
        
        for (let i = 0; i < times.length; i++) {
          if (dataToItems.length >= 6) break; // Limitar a los primeros 6 objetos
        
          const time = times[i];
        
          // Extraer atributos @from y @to de <time>
          const dateStart = extractTime(time.getAttribute("from") || "");
          const dateEnd = extractTime(time.getAttribute("to") || "");
        
          // Extraer <time> > precipitation y el atributo probability
          const precipitationElement = time.getElementsByTagName("precipitation")[0];
          const precipitation = precipitationElement?.getAttribute("probability") || "";
        
          // Extraer <time> > humidity y el atributo value
          const humidityElement = time.getElementsByTagName("humidity")[0];
          const humidity = humidityElement?.getAttribute("value") || "";
        
          // Extraer <time> > clouds y el atributo all
          const cloudsElement = time.getElementsByTagName("clouds")[0];
          const clouds = cloudsElement?.getAttribute("all") || "";
        
          // Agregar el objeto al arreglo temporal
          dataToItems.push({
            dateStart,
            dateEnd,
            precipitation,
            humidity,
            clouds,
          });
        }
      
        // Usar slice para asegurarse de tomar solo los primeros 6 (redundante pero útil para seguridad adicional)
        const limitedDataToItems = dataToItems.slice(0, 6);
      
        // Actualizar el estado con los primeros 6 elementos
        setItems(limitedDataToItems);

        let dataToIndicators: Indicator[] = new Array<Indicator>();
        let name = xml.getElementsByTagName("name")[0].innerHTML || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "City", "value": name })

        let location = xml.getElementsByTagName("location")[1]

        let latitude = location.getAttribute("latitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Latitude", "value": latitude })

        let longitude = location.getAttribute("longitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Longitude", "value": longitude })

        let altitude = location.getAttribute("altitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Altitude", "value": altitude })

        setIndicators(dataToIndicators)
      }
    };
  
    request();
  }, [owm]);  

  return (
    <Grid container spacing={5}>
      {
        indicators
          .map(
            (indicator, idx) => (
              <Grid key={idx} size={{ xs: 12, xl: 3 }}>
                <IndicatorWeather
                  title={indicator["title"]}
                  subtitle={indicator["subtitle"]}
                  value={indicator["value"]} />
              </Grid>
            )
          )
      }

      {/* Indicadores */}
      {/* <Grid size={{ xs: 12, xl: 3 }}>
          <IndicatorWeather title={'Indicator 1'} subtitle={'Unidad 1'} value={"1.23"} /> 
        </Grid>

        <Grid size={{ xs: 12, xl: 3}}>
          <IndicatorWeather title={'Indicator 2'} subtitle={'Unidad 2'} value={"3.12"} />
        </Grid>

        <Grid size={{ xs: 12, xl: 3}}>
          <IndicatorWeather title={'Indicator 3'} subtitle={'Unidad 3'} value={"2.31"} />
        </Grid>

        <Grid size={{ xs: 12, xl: 3}}>
          <IndicatorWeather title={'Indicator 4'} subtitle={'Unidad 4'} value={"3.21"} />
        </Grid> */}

      {/* Tabla */}
      <Grid size={{ xs: 12, xl: 8 }}>

        {/* Grid Anidado */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, xl: 3 }}>
            <ControlWeather />
          </Grid>
          <Grid size={{ xs: 12, xl: 9 }}>
            <TableWeather itemsIn={items} />
          </Grid>
        </Grid>
      </Grid>

      {/* Gráfico */}
      <Grid size={{ xs: 12, xl: 4 }}>
        <LineChartWeather />
      </Grid>
    </Grid>
  )
}

export default App