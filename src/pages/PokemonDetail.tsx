import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import { defaultImg, PokemonInfo, PokemonSpecies } from "../../dto/pokemon";
import { useLocation } from "react-router-dom";
import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData } from "chart.js";
import { HttpBase } from "../api/axios";

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
    const httpBase = new HttpBase();
    const location = useLocation();
    const { defaultImage, info, types, species, totalPokemon }: { defaultImage: defaultImg, info: PokemonInfo, types: string[], species: PokemonSpecies, totalPokemon?: number } = location.state || {};

    const stats = info.stats.map((s) => s.base_stat);

    const data: ChartData<"radar", number[], string> = {
        labels: info.stats.map((s) => s.stat.name), // Radar labels
        datasets: [
            {
                label: "Stat",
                data: stats, // Data points for each label
                fill: true, // Fill the area under the line
                backgroundColor: species.color.name, // Background color of the chart area
                borderColor: species.color.name, // Border color of the chart area
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
                    color: 'rgb(255, 255, 255)',
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

    const handleBack = () => {
        window.history.back();
    }

    return (
        <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'grey',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <AppBar position="fixed" sx={{
                background: `linear-gradient(135deg, ${info.sprites.bgColor || 'rgb(255, 255, 255), rgb(200, 200, 200)'})`,
                top: 0,
                left: 0,
            }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={handleBack}
                    >
                        <HomeIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {info.name}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, gap: 2 }}>
                {
                    types.map((t, index) => (
                        <img key={index} src={t} alt={info.name} />
                    ))
                }

            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 10, gap: 2 }}>
                <img src={defaultImage.other["official-artwork"].front_default} alt={info.name} width={250} height={250} />
                <Radar data={data} options={options} style={{ width: 400, height: 400, maxWidth: 400, maxHeight: 400 }} />
            </Box>


        </Box>
    );
}