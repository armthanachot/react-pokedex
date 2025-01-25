import { encode } from "blurhash";
import ColorThief from "colorthief";


const loadImage = async (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // เปิดใช้งาน CORS
        img.onload = () => resolve(img);
        img.onerror = (...args) => reject(args);
        img.src = src;
    });

const getImageData = (image: HTMLImageElement): ImageData => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context?.drawImage(image, 0, 0);
    return context?.getImageData(0, 0, image.width, image.height) as ImageData;
};

const encodeImageToBlurhash = async (imageUrl: string): Promise<string> => {
    const image = await loadImage(imageUrl);
    const imageData = getImageData(image);
    return encode(imageData.data, imageData.width, imageData.height, 4, 4);
};

const getImageColorCode = async (imageUrl: string): Promise<string> => {
    const image = await loadImage(imageUrl);
    const imageData = getImageData(image);
    const r = imageData.data[0];
    const g = imageData.data[1];
    const b = imageData.data[2];
    return `rgb(${r}, ${g}, ${b})`;
}

const getImagePalette = async (imageUrl: string): Promise<string[]> => {
    const image = await loadImage(imageUrl);
    const colorThief = new ColorThief();
    const palette = colorThief.getPalette(image);
    return palette.map(color => `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
}

export { encodeImageToBlurhash, getImagePalette };