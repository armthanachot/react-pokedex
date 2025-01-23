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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* เพิ่มเพื่อรีเซ็ตสไตล์ */}
      {/* <App /> */}
      {/* <DemoContext /> */}
      {/* <Query /> */}
      {/* <Snap /> */}
      <ColorDetector></ColorDetector>
    </ThemeProvider>
  </React.StrictMode>,
);