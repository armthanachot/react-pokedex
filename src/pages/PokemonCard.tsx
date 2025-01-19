import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Box, IconButton } from '@mui/material';
import SimpleDialog from '../components/Dialog';
import { AutoAwesome, PlayArrow, FlipCameraIos, LocalFireDepartment, NoteAdd } from '@mui/icons-material';
import { defaultImg, pokemonImage, showDownImage } from '../../dto/pokemon';

// change img to object of normal and shiny (contain front and back)
export default function PokemonCard({ defaultImage, showDownImage, name, types, voice, no }: { defaultImage: defaultImg, showDownImage: showDownImage, name: string, types: string[], voice?: string, no?: number }) {

    const [dialogState, setDialogState] = useState({
        animationDialog: false,
        noteDialog: false
    });

    const [pokemonImg, setPokemonImg] = useState<pokemonImage>({ front: defaultImage.front_default, back: defaultImage.back_default, show: defaultImage.front_default });

    const [animationSrc, setAnimationSrc] = useState<string>(showDownImage.front_default);

    const [pokemonFunctionState, setPokemonFunctionState] = useState({
        flip: false,
        shiny: false
    });

    const playAnimation = () => {
        setDialogState({
            animationDialog: true,
            noteDialog: false
        });
    }

    const convertToshiny = () => {
        setPokemonFunctionState(prevState => ({
            ...prevState,
            shiny: !prevState.shiny
        }));
    }

    useEffect(() => {
        setAnimationSrc(pokemonFunctionState.shiny ? showDownImage.front_shiny : showDownImage.front_default);
        setPokemonImg(pokemonFunctionState.shiny ? { front: defaultImage.front_shiny, back: defaultImage.back_shiny, show: defaultImage.front_shiny } : { front: defaultImage.front_default, back: defaultImage.back_default, show: defaultImage.front_default });
    }, [pokemonFunctionState.shiny])

    const flipPokemon = () => {
        setPokemonFunctionState(prevState => ({
            ...prevState,
            flip: !prevState.flip,
        }));
    }
    useEffect(() => {
        setPokemonImg((prevState)=>{
            return {
                ...prevState,
                show: pokemonFunctionState.flip ? prevState.back : prevState.front
            }
        });
    }, [pokemonFunctionState.flip])

    const onCloseAnimationDialog = () => {
        setDialogState({
            animationDialog: false,
            noteDialog: false
        });
    }

    return (
        <Card>
            <CardActionArea>
                <Typography variant="body2" color="black" sx={{ padding: 2 }}>
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
                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                    {/* <IconButton onClick={() => playAnimation()}>
                                        <LocalFireDepartment fontSize='large' htmlColor='#ffa601' />
                                    </IconButton> */}
                                    <IconButton onClick={() => convertToshiny()}>
                                        <NoteAdd fontSize='large' htmlColor='#ce6004' />
                                    </IconButton>
                                </Box>
                                {
                                    dialogState.animationDialog &&
                                    SimpleDialog({
                                        open: dialogState.animationDialog, title: name, content: (<Card sx={{}}>
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
                                        , onCloseDialog: () => onCloseAnimationDialog(),
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