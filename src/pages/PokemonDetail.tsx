import { AppBar, Toolbar, Typography, Box, Container, TextField, Button, colors } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import CopyIcon from '@mui/icons-material/CopyAll';
import AutoFixHightIcon from '@mui/icons-material/AutoFixHigh';
import HourGlassTopIcon from '@mui/icons-material/HourglassTop';
import ImageIcon from '@mui/icons-material/Image';
import { defaultImg, PokemonInfo, PokemonSpecies } from "../../dto/pokemon";
import { useLocation } from "react-router-dom";
import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData } from "chart.js";
import { HttpBase } from "../api/axios";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

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
    const env = import.meta.env
    const httpBase = new HttpBase(env.VITE_POKEDEX_AI_API_URL);
    const location = useLocation();
    const { defaultImage, info, types, species }: { defaultImage: defaultImg, info: PokemonInfo, types: string[], species: PokemonSpecies, totalPokemon?: number } = location.state || {};

    const [prompt, setPrompt] = useState<string>('');
    const [aiImageUrl, setAiImageUrl] = useState<string>('');
    const [loadImage, setLoadImage] = useState<boolean>(false);


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

    const promptRequestSchema = z.object({
        role: z.string().nonempty("Role cannot be empty"),
        input: z.string().nonempty("Prompt cannot be empty"),
    });

    type PromptReqFormType = z.infer<typeof promptRequestSchema>;

    const imageRequestSchema = z.object({
        inputs: z.string().nonempty("Prompt cannot be empty"),
        target_size: z.object({
            width: z.number(),
            height: z.number()
        })
    });

    type ImageReqFormType = z.infer<typeof imageRequestSchema>;

    const generateImageAI = async (prompt: string) => {
        const data: ImageReqFormType = {
            inputs: prompt,
            target_size: {
                width: 256,
                height: 256
            }
        }
        setLoadImage(true);
        const resp: { imagePath: string } = (await httpBase.api.post("/hugging-face/image", data)).data;
        console.log("image: ", resp);
        setAiImageUrl(resp.imagePath);
        setLoadImage(false);
    }

    const openLink = (url: string) => {
        window.open(url, '_blank');
    }

    const PromptRequestForm = () => {
        const {
            control,
            handleSubmit,
            formState: { errors },
        } = useForm<PromptReqFormType>({
            resolver: zodResolver(promptRequestSchema),
            defaultValues: {
                role: "Pokemon art director & designer",
                input: `give me a AI prompt to generate image for this description: ${info.name} in Christmas style, response format only prompt.`
            }
        });

        const onSubmit = async (data: PromptReqFormType) => {
            console.log("✅ Form Data:", data);
            const resp: { prompt: string } = (await httpBase.api.post("/openai/prompt", data)).data;
            setPrompt(resp.prompt);
        };

        return (
            <Container maxWidth="sm">
                <Typography variant="h5" gutterBottom>
                    You will wondering what is this form for?
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Role Field */}
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Role"
                                fullWidth
                                margin="normal"
                                error={!!errors.role}
                                helperText={errors.role?.message}
                                variant="filled"
                            />
                        )}
                    />

                    {/* Prompt Request Field */}
                    <Controller
                        name="input"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Prompt Request"
                                fullWidth
                                margin="normal"
                                error={!!errors.input}
                                helperText={errors.input?.message}
                                variant="filled"
                                multiline
                            />
                        )}
                    />

                    {/* Submit Button */}
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Submit
                    </Button>

                    {/* Prompt Response */}
                    {
                        prompt && <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                            <TextField
                                label="Prompt Response"
                                fullWidth
                                margin="normal"
                                variant="filled"
                                multiline
                                value={prompt}
                                disabled
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                                <IconButton onClick={() => navigator.clipboard.writeText(prompt)} sx={{ ml: 1 }}>
                                    <CopyIcon />
                                </IconButton>
                                <IconButton onClick={() => generateImageAI(prompt)} sx={{ ml: 1 }}>
                                    <AutoFixHightIcon />
                                </IconButton>
                                {loadImage ? <IconButton sx={{ ml: 1 }}> <HourGlassTopIcon /> </IconButton> : aiImageUrl ?
                                    <IconButton onClick={() => openLink(aiImageUrl)} sx={{ ml: 1 }}>
                                        <ImageIcon />
                                    </IconButton> : null
                                }
                            </Box>
                        </Box>
                    }
                </form>
            </Container>
        );
    }


    return (
        <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh', // Set height to full screen
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

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, gap: 2 }}>
                <Radar data={data} options={options} style={{ width: 400, height: 400, maxWidth: 400, maxHeight: 400 }} />
                <img src={defaultImage.other["official-artwork"].front_default} alt={info.name} width={250} height={250} />
                {
                    PromptRequestForm()
                }
            </Box>
        </Box>
    );
}