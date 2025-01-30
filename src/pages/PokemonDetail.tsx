import { AppBar, Button, Toolbar, Typography, Box } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { defaultImg, PokemonInfo } from "../../dto/pokemon";
import { useLocation } from "react-router-dom";

import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData, ChartOptions } from "chart.js";

ChartJS.register(
    RadialLinearScale,
    CategoryScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function PokemonDetail() {
    const location = useLocation();
    const { defaultImage, info, types }: { defaultImage: defaultImg, info: PokemonInfo, types: string[] } = location.state || {};

    const stats = info.stats.map((s) => s.base_stat);

    const data: ChartData<"radar", number[], string> = {
        labels: info.stats.map((s) => s.stat.name), // Radar labels
        datasets: [
            {
                label: "Stat",
                data: stats, // Data points for each label
                fill: true, // Fill the area under the line
                backgroundColor: "green", // Background color of the chart area
                borderColor: "green", // Border color of the chart area
                pointBackgroundColor: "rgb(200, 255, 0)", // Point color
                pointBorderColor: "rgb(255, 255, 255)", // Border color of the points
                pointHoverBackgroundColor: "rgb(255, 255, 255)", // Hover color of the points
                pointHoverBorderColor: "rgb(255, 255, 255)", // Hover border color of the points
                animation: {
                    duration: 1000,
                    easing: 'linear',
                },
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            r: {
                min: Math.min(...stats) - 10,
                max: Math.max(...stats) + 10,
                grid: {
                    color: 'rgb(255, 255, 255)',
                    lineWidth: 1,
                },
                angleLines: {
                    color: 'rgb(255, 255, 255)',
                    lineWidth: 1,
                },
                pointLabels: {
                    color: 'green',
                    font: {
                        size: 12,
                    },
                    borderRadius: 10,
                }
            },
        },
        backgroundColor: 'rgb(255, 255, 255)',
        color: 'rgb(255, 255, 255)',
    }

    return (
        <>
            <AppBar position="absolute">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {info.name}
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, gap: 2 }}>
                {
                    types.map((t, index) => (
                        <img key={index} src={t} alt={info.name} />
                    ))
                }

            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                <img src={defaultImage.other["official-artwork"].front_default} alt={info.name} width={250} height={250} />

            </Box>

            <Box>

                <Radar data={data} options={options} />

            </Box>
        </>
    );
}