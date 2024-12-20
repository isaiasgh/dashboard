import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Item from '../interface/Item.tsx';
import { useEffect, useState } from 'react';

interface WeatherProps {
  weatherData: Item[];
}

export default function TableWeather(props: WeatherProps) {

  const [climateData, updateClimateData] = useState<Item[]>(props.weatherData);


  useEffect(() => {
    updateClimateData(props.weatherData);
  }, [props.weatherData]); 

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: '#001f3f',
        color: '#FFFF',
        borderRadius: 4,
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.5)',
      }}
    >
      <Table aria-label="climate data table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#0074D9' }}>
            <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Inicio</TableCell>
            <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Fin</TableCell>
            <TableCell align="right" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
              Precipitación
            </TableCell>
            <TableCell align="right" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
              Humedad
            </TableCell>
            <TableCell align="right" sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
              Nubosidad
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {climateData.map((dataPoint, idx) => (
            <TableRow
              key={idx}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': { backgroundColor: '#39CCCC' },
              }}
            >
              <TableCell component="th" scope="row" sx={{ color: '#FFFF' }}>
                {dataPoint.dateStart}
              </TableCell>
              <TableCell sx={{ color: '#FFFF' }}>{dataPoint.dateEnd}</TableCell>
              <TableCell align="right" sx={{ color: '#FFFF' }}>
                {dataPoint.precipitation}
              </TableCell>
              <TableCell align="right" sx={{ color: '#FFFF' }}>
                {dataPoint.humidity}
              </TableCell>
              <TableCell align="right" sx={{ color: '#FFFF' }}>
                {dataPoint.clouds}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}