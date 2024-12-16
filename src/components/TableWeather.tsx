import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Item from '../interface/Item.tsx'; // Asegúrate de que el path sea correcto
import { useEffect, useState } from 'react';

interface MyProp {
  itemsIn: Item[];
}


export default function TableWeather(props: MyProp) {
  // Crear la variable de estado rows y su función de actualización setRows
  const [rows, setRows] = useState<Item[]>(props.itemsIn);

  // Usar useEffect para actualizar rows cada vez que props.itemsIn cambie
  useEffect(() => {
    setRows(props.itemsIn);
  }, [props.itemsIn]);  // Dependencia del prop itemsIn

  return (
    <TableContainer component={Paper}>
      <Table aria-label="weather table">
        <TableHead>
          <TableRow>
            <TableCell>Hora de inicio</TableCell>
            <TableCell>Hora de fin</TableCell>
            <TableCell align="right">Precipitación</TableCell>
            <TableCell align="right">Humedad</TableCell>
            <TableCell align="right">Nubosidad</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Iterar sobre rows y mostrar cada propiedad de Item */}
          {rows.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.dateStart}
              </TableCell>
              <TableCell>{row.dateEnd}</TableCell>
              <TableCell align="right">{row.precipitation}</TableCell>
              <TableCell align="right">{row.humidity}</TableCell>
              <TableCell align="right">{row.clouds}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
