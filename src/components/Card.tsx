import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Box, IconButton } from '@mui/material';
import SimpleDialog from './Dialog';
import { AutoAwesome, PlayArrow } from '@mui/icons-material';


export default function ActionAreaCard({ imgSrc, imgShinySrc, name, types, animationSrc, voice, no }: { imgSrc: string, imgShinySrc?: string, name: string, types: string[], animationSrc?: string, voice?: string, no?: number }) {

    const [dialogOpen, setDialogOpen] = useState(false);

    const [pokemonImg, setPokemonImg] = useState<string>(imgSrc);

    const [shiny, setShiny] = useState(false);

    const playAnimation = () => {
        setDialogOpen(true);
    }

    useEffect(() => {
        setPokemonImg(imgSrc);
    }, [])

    const convertToshiny = () => {
        setShiny(!shiny);
    }

    useEffect(() => {
        setPokemonImg(shiny? (imgShinySrc || imgSrc) : imgSrc);
    }, [shiny])

    return (
        <Card>
            <CardActionArea>
                <Typography variant="body2" color="text.secondary" sx={{ padding: 2 }}>
                    {no}.
                </Typography>
                <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <CardMedia
                        sx={{ padding: 2 }}
                        component="img"
                        src={pokemonImg}
                        alt={name}
                    />
                    <Typography variant="body2" sx={{ color: 'text.secondary', marginLeft: 2 }}>
                        {
                            <>
                                {

                                    types.map((type, index) => (
                                        <img key={index} src={type} alt={type} height={30} />
                                    ))


                                }
                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                    <IconButton onClick={() => playAnimation()}>
                                        <PlayArrow fontSize='large' htmlColor='#038a8c' />
                                    </IconButton>
                                    <IconButton onClick={() => convertToshiny()}>
                                        <AutoAwesome fontSize='large' htmlColor='#eef11c' />
                                    </IconButton>
                                </Box>

                                {
                                    dialogOpen &&
                                    SimpleDialog({
                                        open: dialogOpen, title: name, content: (<Card sx={{}}>
                                            <CardActionArea>
                                                <CardContent>
                                                    <CardMedia
                                                        component="img"
                                                        src={animationSrc}
                                                        alt={name}
                                                    />
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>)
                                        , onCloseDialog: () => setDialogOpen(false),
                                        voice: voice
                                    })
                                }
                            </>

                        }
                    </Typography>
                </CardContent>
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div" sx={{ color: '#000000' }}>
                        {name}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
