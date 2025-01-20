import { SxProps, TextField, Theme } from "@mui/material";

type variant = 'standard' | 'outlined' | 'filled';

export default function CTextField({ id, label, value, variant, sx }: { id: string, label: string, value?: string, variant: variant, sx: SxProps<Theme> }) {
    return (
        <TextField id={id} label={label} value={value} variant={variant} sx={sx} />
    );
}