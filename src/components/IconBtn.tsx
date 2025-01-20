import { SvgIconComponent } from "@mui/icons-material";
import { IconButton, SvgIconOwnProps } from "@mui/material";
import { MouseEventHandler } from "react";

export default function IconBtn({ Icon, iconProp, onClick}: { Icon: SvgIconComponent, iconProp: SvgIconOwnProps, onClick: MouseEventHandler}) {
    
    return (
        <IconButton onClick={onClick}>
            <Icon {...iconProp} />
        </IconButton>
    );
}