import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import { homeTheme, ChoiceButton} from './HomeTheme';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./Register";
import Choice from "./Choice";
import Finished from "./Finished";




class App extends React.Component {

  render() {
    return (
      <Router>
        <ThemeProvider theme={homeTheme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={
              <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" className="app">
                <Typography variant="h2" gutterBottom className="title">
                  Welcome to the Converter App
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" mt={5}>
                  <ChoiceButton component={Link} to="/register">
                    Convert files
                  </ChoiceButton>
                </Box>
              </Box>
            } />
            <Route path="/" element={<App/>} />
            <Route path="/register" element={ <Register /> } />
            <Route path="/choice" element={<Choice />} />
            <Route path="/finished" element={<Finished />} />
          </Routes>
        </ThemeProvider>

      </Router>
    );
  }
}

export default App;