import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';


export default function ActionAreaCard({ imgSrc, name, types, animationSrc }: { imgSrc: string, name: string, types: string[], animationSrc?: string }) {

    const platAnimation = (src:string) => {
        return
    }

    return (
        <Card>
            <CardActionArea>
                <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <CardMedia
                        sx={{ padding: 2 }}
                        component="img"
                        src={imgSrc}
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
                            <IconButton sx={{display: 'flex', flexDirection: 'row', alignItems: 'start'}}>
                                <FontAwesomeIcon icon={faPlay} size="1x" color="#000000" />
                            </IconButton>
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
