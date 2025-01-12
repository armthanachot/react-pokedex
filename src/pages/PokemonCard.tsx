import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Box, IconButton } from '@mui/material';
import SimpleDialog from '../components/Dialog';
import { AutoAwesome, PlayArrow, FlipCameraIos } from '@mui/icons-material';
import { defaultImg, pokemonImage, showDownImage } from '../../dto/pokemon';

// change img to object of normal and shiny (contain front and back)
export default function PokemonCard({ defaultImage, showDownImage, name, types, voice, no }: { defaultImage: defaultImg, showDownImage: showDownImage, name: string, types: string[], voice?: string, no?: number }) {

    const [dialogOpen, setDialogOpen] = useState(false);

    const [pokemonImg, setPokemonImg] = useState<pokemonImage>({ front: defaultImage.front_default, back: defaultImage.back_default, show: defaultImage.front_default });

    const [animationSrc, setAnimationSrc] = useState<string>(showDownImage.front_default);

    const [shiny, setShiny] = useState(false);

    const [flip, setFlip] = useState(false);

    const playAnimation = () => {
        setDialogOpen(true);
    }

    const convertToshiny = () => {
        setShiny(!shiny);
    }

    useEffect(() => {
        setAnimationSrc(shiny ? showDownImage.front_shiny : showDownImage.front_default);
        return setPokemonImg(shiny ? { front: defaultImage.front_shiny, back: defaultImage.back_shiny, show: defaultImage.front_shiny } : { front: defaultImage.front_default, back: defaultImage.back_default, show: defaultImage.front_default });
    }, [shiny])

    const flipPokemon = () => {
        setFlip(!flip);
    }
    useEffect(() => {
        return setPokemonImg(flip ? { front: pokemonImg.front, back: pokemonImg.front, show: pokemonImg.back } : { front: pokemonImg.front, back: pokemonImg.back, show: pokemonImg.front });
    }, [flip])

    const onCloseDialog = () => {
        setDialogOpen(false);
    }

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
                        src={pokemonImg.show}
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
                                        , onCloseDialog: () => onCloseDialog(),
                                        voice: voice
                                    })
                                }
                            </>

                        }
                    </Typography>
                </CardContent>

                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <IconButton onClick={() => flipPokemon()}>
                        <FlipCameraIos fontSize='large' htmlColor='#f10d0d' />
                    </IconButton>
                </Box>
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div" sx={{ color: '#000000' }}>
                        {name}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
