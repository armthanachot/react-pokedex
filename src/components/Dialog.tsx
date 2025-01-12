import { Dialog, DialogTitle } from "@mui/material";

function SimpleDialog({ open, title, content, onCloseDialog, voice }: { open: boolean, title: string, content: React.ReactNode, onCloseDialog: () => void, voice?: string }) {
    return (
        <Dialog open={open} onClose={onCloseDialog} sx={{
            display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            margin: 'auto',
            position: 'absolute',
        }}>
            <DialogTitle> {title} </DialogTitle>
            {content}
            <audio src={voice} autoPlay hidden></audio>
        </Dialog>
    )
}

export default SimpleDialog;