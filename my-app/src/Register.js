import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {StyledDropzone, registertheme, Infos, FormatInfos} from "./RegisterTheme";
import CssBaseline from "@mui/material/CssBaseline";
import {ThemeProvider} from "@mui/material/styles";
import Box from "@mui/material/Box";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {ChoiceButton} from "./FinishedTheme";

function Register() {
  const navigate = useNavigate();
  const [currentFile, setCurrentFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileQueue, setFileQueue] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
  acceptedFiles.forEach(file => {
    var parts = file.name.split('.');
    if (parts.length > 1) {
      var extension = parts.pop();
      if (extension !== 'Z' && extension !== 'tbl') {
        alert('Please Drop only tbl or tbl.Z files.');
        return; // Skip this file
      }
    }
    setFiles(oldFiles => [...oldFiles, file]);
  });
  handleSend();
}, []);

  useEffect(() => {
    if (fileQueue.length > 0) {
      setCurrentFile(fileQueue[0]);
    }
  }, [fileQueue]);


  useEffect(() => {
    if(fileQueue.length===0 && files.length > 0){
      handleSend();
    }
  }, [files]);


  const handleSend = async () => {
    const formData = new FormData();

    files.forEach((file, index) => {
      console.log(file.name)
      formData.append("file", file);
    });

    try {
      const response = await axios.post("http://localhost:3000/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        console.log("Files uploaded successfully");
        setFiles([]);
        navigate("/Choice");
      }
    } catch(error) {
        console.error("Error uploading files: ", error)
      }
    };

  const {getRootProps, getInputProps, isDragActive} = useDropzone({ onDrop });

  return (
    <ThemeProvider theme={registertheme}>
      <CssBaseline />

      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" className="app">
        <ChoiceButton variant="contained" color="primary" sx={{
                    width: 120,
                    height: 40,
                    fontSize: 10,
                  }} onClick={() => {
                    navigate("/");
                }}>
                    Return home
                </ChoiceButton>
        <div>
          <Infos>Please drag and drop data files below:</Infos>
          <FormatInfos>(Format  .tbl or .tbl.Z)</FormatInfos>
          <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" mt={5}>
            <StyledDropzone {...getRootProps()}>
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <p>Please Drop your files here</p> :
                  <p>Drag and Drop your files here, or click to select them</p>
              }
            </StyledDropzone>
          </Box>

        </div>
      </Box>

    </ThemeProvider>
  )
}

export default Register;