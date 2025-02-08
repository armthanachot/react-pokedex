import { MouseEventHandler, ReactNode, useCallback, useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Box, SvgIconOwnProps, TextField, Grid2 } from '@mui/material';
import SimpleDialog from '../components/Dialog';
import { AutoAwesome, PlayArrow, FlipCameraIos, Restore } from '@mui/icons-material';
import { defaultImg, pokemonImage, PokemonResult, PokemonSpecies, showDownImage } from '../../dto/pokemon';
import IconBtn from '../components/IconBtn';
import { SvgIconComponent } from "@mui/icons-material";
import { pokemonCardIconBtnStyle } from './config/pokemonCard';
import { useNavigate } from 'react-router-dom';


// change img to object of normal and shiny (contain front and back)
export default function PokemonCard({ defaultImage, showDownImage, name, types, species, pokemonResult: p, totalPokemon }: { defaultImage: defaultImg, showDownImage: showDownImage, name: string, types: string[], species?: PokemonSpecies, pokemonResult: PokemonResult, totalPokemon?: number }) {

    const [dialogState, setDialogState] = useState({
        animationDialog: false,
        noteDialog: false
    });

    const [pokemonImg, setPokemonImg] = useState<pokemonImage>({ front: defaultImage.front_default, back: defaultImage.back_default, show: defaultImage.front_default, showMultiple: [] });

    const [animationSrc, setAnimationSrc] = useState<string>(showDownImage.front_default);

    const [pokemonFunctionState, setPokemonFunctionState] = useState({
        flip: false,
        shiny: false
    });

    const [megaEvo, setMegaEvo] = useState<boolean>(false);
    const [gigantamaxEvo, setGigantaMaxEvo] = useState<boolean>(false);
    const [primalEvo, setPrimalEvo] = useState<boolean>(false);

    const playAnimation = useCallback(() => {
        setDialogState({
            animationDialog: true,
            noteDialog: false
        });
    }, [dialogState.animationDialog]);

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

    const handleMagaEvo = () => {
        const versions = species?.varieties.filter(v => v.pokemon.name.includes('-mega'));
        if (versions && versions.length > 1) {
            setPokemonImg((prevState) => {
                return {
                    ...prevState,
                    showMultiple: versions.map(v => v.pokemon?.info?.sprites.front_default).filter((img): img is string => img !== undefined)
                }
            });
        } else {
            console.log(versions);
            setPokemonImg((prevState) => {
                return {
                    ...prevState,
                    show: versions && versions.length > 0 ? versions[0].pokemon?.info?.sprites.front_default || prevState.show : prevState.show
                }
            });
        }

        setMegaEvo(true);
    }

    const handleGigantamaxEvo = () => {
        const versions = species?.varieties.filter(v => v.pokemon.name.includes('-gmax'));
        if (versions && versions.length > 1) {
            console.log(versions);
        } else {
            console.log(versions);
            setPokemonImg((prevState) => {
                return {
                    ...prevState,
                    show: versions && versions[0]?.pokemon?.info?.sprites?.front_default || prevState.show
                }
            });
        }

        setGigantaMaxEvo(true);
    }

    const handlePrimalEvo = () => {
        const versions = species?.varieties.filter(v => v.pokemon.name.includes('-primal'));
        if (versions && versions.length > 1) {
            console.log(versions);
        } else {
            console.log(versions);
            setPokemonImg((prevState) => {
                return {
                    ...prevState,
                    show: versions && versions[0]?.pokemon?.info?.sprites?.front_default || prevState.show
                }
            });
        }

        setPrimalEvo(true);
    }

    const handleDefaultImg = () => {
        setPokemonImg({ front: defaultImage.front_default, back: defaultImage.back_default, show: defaultImage.front_default });
        setMegaEvo(false);
        setGigantaMaxEvo(false);
        setPrimalEvo(false);
    }

    const navigate = useNavigate();

    const openDetailPage = () => {
        return navigate("/detail", { state: { defaultImage: defaultImage, info: p.info, types, species, totalPokemon } });
    }

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
                        {p.info.id}
                    </Typography>
                </Box>
            </Box>
            <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {
                    (pokemonImg.showMultiple?.length ?? 0) > 0 ?
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {(pokemonImg.showMultiple ?? []).map((img, index) => (
                                <CardMedia
                                    sx={{ padding: 2 }}
                                    component="img"
                                    src={img}
                                    alt={name}
                                    key={index}
                                />
                            ))}
                        </Box>
                        : <CardMedia
                            sx={{ padding: 2 }}
                            component="img"
                            src={pokemonImg.show}
                            alt={name}
                        />
                }
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
                                    species?.megaEvo &&
                                    (!megaEvo ?
                                        <img src='src/assets/mega-stone.png' width={35} height={35} style={{ cursor: 'pointer' }} onClick={handleMagaEvo} />
                                        : renderIconButton({
                                            IconComponent: Restore,
                                            onClick: handleDefaultImg,
                                            iconProps: pokemonCardIconBtnStyle.restore
                                        }))
                                }
                                {
                                    species?.gigantamaxEvo && (
                                        !gigantamaxEvo ?
                                            <img src='src/assets/gigantamax.png' width={35} height={35} style={{ cursor: 'pointer' }} onClick={handleGigantamaxEvo} />
                                            : renderIconButton({
                                                IconComponent: Restore,
                                                onClick: handleDefaultImg,
                                                iconProps: pokemonCardIconBtnStyle.restore
                                            }))
                                }
                                {
                                    species?.primalEvo && (
                                        !primalEvo ?
                                            <img src='src/assets/primal.png' width={60} height={60} style={{ cursor: 'pointer' }} onClick={handlePrimalEvo} />
                                            : renderIconButton({
                                                IconComponent: Restore,
                                                onClick: handleDefaultImg,
                                                iconProps: pokemonCardIconBtnStyle.restore
                                            }))
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
                        voice={p.info.cries.legacy}
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
                    <img src='src/assets/pokeball.png' alt={name} width={25} height={25} style={{ marginRight: 4 }} />
                    <Box
                        onClick={openDetailPage}
                        sx={{ cursor: 'pointer' }}
                    > {name}</Box>
                </Typography>
            </CardContent>
        </Card>
    );
}