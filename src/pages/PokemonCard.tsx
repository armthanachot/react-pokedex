import { MouseEventHandler, ReactNode, useCallback, useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Box, SvgIconOwnProps, TextField, Grid2 } from '@mui/material';
import SimpleDialog from '../components/Dialog';
import { AutoAwesome, PlayArrow, FlipCameraIos, NoteAdd } from '@mui/icons-material';
import { defaultImg, pokemonImage, showDownImage } from '../../dto/pokemon';
import IconBtn from '../components/IconBtn';
import { SvgIconComponent } from "@mui/icons-material";
import { pokemonCardIconBtnStyle } from './config/pokemonCard';


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

    const playAnimation = useCallback(() => {
        setDialogState({
            animationDialog: true,
            noteDialog: false
        });
    }, [dialogState.animationDialog]);

    const openNote = useCallback(() => {
        setDialogState({
            animationDialog: false,
            noteDialog: true
        });
    }, [dialogState.noteDialog]);

    const convertToshiny = useCallback(() => {
        setPokemonFunctionState(prevState => ({
            ...prevState,
            shiny: !prevState.shiny
        }));
    }, [pokemonFunctionState.shiny]);

    useEffect(() => {
        setAnimationSrc(pokemonFunctionState.shiny ? showDownImage.front_shiny : showDownImage.front_default);
        setPokemonImg(pokemonFunctionState.shiny ? { front: defaultImage.front_shiny, back: defaultImage.back_shiny, show: defaultImage.front_shiny } : { front: defaultImage.front_default, back: defaultImage.back_default, show: defaultImage.front_default });
    }, [pokemonFunctionState.shiny])

    const flipPokemon = useCallback(() => {
        setPokemonFunctionState(prevState => ({
            ...prevState,
            flip: !prevState.flip,
        }));
    }, [pokemonFunctionState.flip]);

    useEffect(() => {
        setPokemonImg((prevState) => {
            return {
                ...prevState,
                show: pokemonFunctionState.flip ? prevState.back : prevState.front
            }
        });
    }, [pokemonFunctionState.flip])


    const boxSx = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    }

    const renderIconButton = ({ IconComponent, onClick, iconProps }: { IconComponent: SvgIconComponent, onClick: MouseEventHandler, iconProps: SvgIconOwnProps }) => (
        <IconBtn Icon={IconComponent} onClick={onClick} iconProp={iconProps} />
    );

    const cardContent: {
        [key: string]: ReactNode
    } = {
        animationContent: (<Card>
            <CardActionArea>
                <CardContent>
                    <CardMedia
                        component="img"
                        src={animationSrc}
                        alt={name} />
                </CardContent>
            </CardActionArea>
        </Card>),
        noteContent: (
            <Card>
                <Typography gutterBottom sx={{ color: 'black', fontSize: 14, display: 'flex', justifyContent: 'center', padding: 2 }}>
                    Note
                </Typography>
                <CardContent>
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xl: 12, lg: 12, md: 12, sm: 12 }}>
                            <TextField id="standard-basic" fullWidth label="Title" variant="standard" sx={{ color: "black" }} />
                        </Grid2>

                        <Grid2 size={{ xl: 12, lg: 12, md: 12, sm: 12 }}>

                            <TextField id="standard-basic2" fullWidth label="Date" variant="standard" sx={{ color: "black"}} />
                        </Grid2>
                    </Grid2>
                </CardContent>
            </Card>
        )
    };

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
                                <Box sx={boxSx}>
                                    {
                                        renderIconButton({
                                            IconComponent: PlayArrow,
                                            onClick: playAnimation,
                                            iconProps: pokemonCardIconBtnStyle.playAnimation
                                        })
                                    }
                                    {
                                        renderIconButton({
                                            IconComponent: AutoAwesome,
                                            onClick: convertToshiny,
                                            iconProps: pokemonCardIconBtnStyle.convertToshiny
                                        })
                                    }
                                </Box>
                                <Box sx={boxSx}>
                                    {
                                        renderIconButton({
                                            IconComponent: NoteAdd,
                                            onClick: openNote,
                                            iconProps: pokemonCardIconBtnStyle.noteAdd
                                        })
                                    }
                                </Box>
                            </>

                        }
                    </Typography>

                    {dialogState.animationDialog && SimpleDialog({
                        open: dialogState.animationDialog,
                        title: name,
                        content: (
                            cardContent.animationContent
                        ),
                        onCloseDialog: () => setDialogState({ animationDialog: false, noteDialog: false }),
                        voice: voice
                    })}

                    {dialogState.noteDialog && SimpleDialog({
                        open: dialogState.noteDialog,
                        title: name,
                        content: (
                            cardContent.noteContent
                        ),
                        onCloseDialog: () => setDialogState({ animationDialog: false, noteDialog: false }),
                    })}

                </CardContent>

                <Box sx={boxSx}>
                    {
                        renderIconButton({
                            IconComponent: FlipCameraIos,
                            onClick: flipPokemon,
                            iconProps: pokemonCardIconBtnStyle.flipPokemon
                        })
                    }
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