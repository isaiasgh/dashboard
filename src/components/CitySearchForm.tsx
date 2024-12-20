// import React from 'react';
// import { TextField, Button, Grid } from '@mui/material';

// interface CitySearchFormProps {
//     cityInput: string;
//     setCityInput: React.Dispatch<React.SetStateAction<string>>;
//     handleSearchCity: () => void;
// }

// const CitySearchForm: React.FC<CitySearchFormProps> = ({ cityInput, setCityInput, handleSearchCity }) => {
//     return (
//         <Grid container direction="row" spacing={1} alignItems="stretch">
//             <Grid item xs={12} lg={6}>
//                 <TextField
//                     label="Ingresa una ciudad"
//                     value={cityInput}
//                     onChange={(e) => setCityInput(e.target.value)}
//                     fullWidth
//                     sx={{ mb: { lg: 0, xs: 2 } }}
//                 />
//             </Grid>
//             <Grid item xs={12} lg={6}>
//                 <Button
//                     variant="contained"
//                     onClick={handleSearchCity}
//                     fullWidth
//                     sx={{
//                         height: '100%', backgroundColor: '#FF5733', '&:hover': {
//                             backgroundColor: '#3D0B00',
//                         }
//                     }}
//                 >
//                     Buscar
//                 </Button>
//             </Grid>
//         </Grid>
//     );
// };

// export default CitySearchForm;

import React from 'react';
import { TextField, Button, Grid } from '@mui/material';

interface CitySearchFormProps {
    cityInput: string;
    setCityInput: React.Dispatch<React.SetStateAction<string>>;
    handleSearchCity: () => void;
}

const CitySearchForm: React.FC<CitySearchFormProps> = ({ cityInput, setCityInput, handleSearchCity }) => {
    return (
        <Grid container direction="row" spacing={1} alignItems="stretch">
            <Grid item xs={12} lg={6}>
                <TextField
                    label="Ingresa una ciudad"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    fullWidth
                    variant="outlined"
                    sx={{
                        mb: { lg: 0, xs: 2 },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            backgroundColor: '#2C2C2C',
                            '&:hover': {
                                backgroundColor: '#3A3A3A',
                            },
                            '&.Mui-focused': {
                                backgroundColor: '#3A3A3A',
                                borderColor: '#FF5733',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: '#FFF', 
                        },
                        '& .MuiInputBase-input': {
                            color: '#FFF',
                        },
                    }}
                />
            </Grid>
            <Grid item xs={12} lg={6}>
                <Button
                    variant="contained"
                    onClick={handleSearchCity}
                    fullWidth
                    sx={{
                        height: '100%', 
                        backgroundColor: '#FF5733', 
                        '&:hover': {
                            backgroundColor: '#3D0B00',
                        }
                    }}
                >
                    Buscar
                </Button>
            </Grid>
        </Grid>
    );
};

export default CitySearchForm;
