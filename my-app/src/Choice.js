import React, {useEffect, useState} from 'react';
import {CircularProgress, FormControlLabel} from '@mui/material';
import {Checkbox, ChoiceButton} from "./ChoiceTheme";
import Box from "@mui/material/Box";
import { Select } from "./ChoiceTheme";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Typography from "@mui/material/Typography";


const Choice = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    handleClick();
  }, []);


  const handleClick = async () => {
      setLoading(true);

        axios.post(`http://localhost:3000/options`)
        .then(() => {
            navigate("/finished")
        })
            .catch((err) => console.log(err))
            .finally(() => {
                setLoading(false);
            });
  };

  return (
            <Box
                display='flex'
                flexDirection= "column"
                alignItems= "center"
                justifyContent= 'center'
                height= '100vh'
                textAlign= "center"
            >

                <div>
                    {loading ? (
                    <>
                        <CircularProgress />
                        <Select>
                            Processing...
                        </Select>
                    </>
                    ) : (
                        <Typography>
                    Preparing your files...
                </Typography>
            )}
        </div>
     </Box>
  );
};

export default Choice;