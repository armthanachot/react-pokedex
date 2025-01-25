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
        justifyContent: 'space-evenly',
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

                            <TextField id="standard-basic2" fullWidth label="Date" variant="standard" sx={{ color: "black" }} />
                        </Grid2>
                    </Grid2>
                </CardContent>
            </Card>
        )
    };

    return (
        // <Card sx={{ background: `linear-gradient(135deg, ${defaultImage.bgColor?.join(', ') || 'rgb(255, 255, 255)'})` }}>
        <Card
            sx={{
                border: '10px solid transparent', // ตั้งค่าขอบเริ่มต้นให้โปร่งใส
                borderImage: `linear-gradient(135deg, ${defaultImage.bgColor || 'rgb(255, 255, 255), rgb(200, 200, 200)'})`, // ใช้ gradient เป็น border
                borderImageSlice: 1, // ทำให้ gradient ถูกตัดพอดีกับขอบ
                backgroundColor: 'transparent', // ตั้งค่าสีพื้นหลังให้โปร่งใส
            }}
        >
            <CardActionArea>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', padding: 2 }}>
                    <Box
                        sx={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            border: `3px solid`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 1
                        }}
                    >
                        <Typography variant="body2" sx={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>
                            {no}
                        </Typography>
                    </Box>
                </Box>
                <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <CardMedia
                        sx={{ padding: 2 }}
                        component="img"
                        src={pokemonImg.show}
                        alt={name}
                    />
                    <Typography variant="body2" sx={{ color: 'white', marginLeft: 2 }}>
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

                    {dialogState.animationDialog &&
                        <SimpleDialog
                            open={dialogState.animationDialog}
                            content={cardContent.animationContent}
                            onCloseDialog={() => setDialogState({ animationDialog: false, noteDialog: false })}
                            voice={voice}
                        />

                    }

                    {dialogState.noteDialog &&
                        <SimpleDialog
                            open={dialogState.noteDialog}
                            content={cardContent.noteContent}
                            onCloseDialog={() => setDialogState({ animationDialog: false, noteDialog: false })}
                        />


                    }

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
                <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {/* , WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'  */}
                    {/* <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', background: `linear-gradient(135deg, ${defaultImage.bgColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0.5, width: '100%', color: 'white' }}> */}
                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0.5, width: '100%', color: 'white' }}>
                        <img src='src/assets/image.png' alt={name} width={25} height={25} style={{ marginRight: 4 }} />
                        {name}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}