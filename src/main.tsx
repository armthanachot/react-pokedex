import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import DemoContext from './example/context/Demo';
import Query from './example/query/PokemonIndex';
import Snap from './example/snapshot/Index';
import { FormEx } from './example/form';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      {/* <DemoContext /> */}
      {/* <Query /> */}
      {/* <Snap /> */}
      {/* <ColorDetector></ColorDetector> */}
      {/* <FormEx></FormEx> */}
    </ThemeProvider>
  </React.StrictMode>,
);