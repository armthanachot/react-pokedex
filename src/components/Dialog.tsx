import { Dialog } from "@mui/material";
import { useEffect } from "react";

function SimpleDialog({ open, content, onCloseDialog, voice }: { open: boolean, content: React.ReactNode, onCloseDialog: () => void, voice?: string }) {
    useEffect(() => {
        if (voice) {
            const audio = new Audio(voice);
            audio.volume = 1
            audio.play();
        }
    }, [voice]);

    return (
        <Dialog open={open} onClose={onCloseDialog}>
            {content}
        </Dialog>
    )
}

export default SimpleDialog;