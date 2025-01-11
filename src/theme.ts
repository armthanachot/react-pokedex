import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // สีหลัก
        },
        secondary: {
            main: '#dc004e', // สีรอง
        },
        background: {
            default: '#000000', // สีพื้นหลังของเว็บไซต์
            paper: '#ffffff', // สีพื้นหลังขององค์ประกอบ (เช่น Card, AppBar)
        },
        text: {
            primary: '#ffffff', // สีฟอนต์หลัก
            secondary: '#666666', // สีฟอนต์รอง
          },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
});

export default theme;