import { Dialog, DialogTitle } from "@mui/material";

function SimpleDialog({ open, title, content, onCloseDialog, voice }: { open: boolean, title: string, content: React.ReactNode, onCloseDialog: () => void, voice?: string }) {

    return (
        <Dialog open={open} onClose={onCloseDialog}>
            <DialogTitle> {title} </DialogTitle>
            {content}
            <audio src={voice} autoPlay hidden></audio>
        </Dialog>
    )
}

export default SimpleDialog;