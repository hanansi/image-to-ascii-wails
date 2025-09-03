import {useState} from 'react';
import './App.css';
import {ConvertImageToAscii, ConvertImageToGrayscale, EncodeImageToBase64, FetchImageAsBytes} from "../wailsjs/go/main/App";

function App() {
    const [imagePath, setImagePath] = useState("");
    // const [convertedImagePath, setConvertedImagePath] = useState("")
    const [asciiText, setAsciiText] = useState([""]);
    const updateImagePath = (src: string) => setImagePath(src);
    // const updateConvertedImagePath = (src: string) => setConvertedImagePath(src);
    const updateAsciiText = (asciiText: string[]) => setAsciiText(asciiText);

    // TODO - Make the UI look better
    async function fetchImage() {
        let bytes = await FetchImageAsBytes();
        if (!bytes) return;

        let imageSrc = await EncodeImageToBase64(bytes);
        if (!imageSrc) return;
        
        updateImagePath(imageSrc);

        let grayScaleImageBytes = await ConvertImageToGrayscale(bytes);

        // let convertedImageSrc = await EncodeImageToBase64(grayScaleImageBytes);
        // updateConvertedImagePath(convertedImageSrc);

        let asciiText = await ConvertImageToAscii(grayScaleImageBytes);
        updateAsciiText(asciiText);
    }

    return (
        <main id="App" className="flex flex-col gap-4 justify-start bg-black h-screen w-screen">
            <h1 className="pt-4 text-2xl font-bold underline">Image to ASCII Converter</h1>
            <div>
                <button className="bg-gradient-to-b from-blue-500 to-purple-500 rounded-md size-36 cursor-pointer
                                    hover:bg-gradient-to-l hover:from-red-500 hover:to-yellow-500" 
                                    id="image-file" onClick={fetchImage}>
                    <p className="font-bold">Upload Your Photo</p>
                    <p>(jpg/jpeg and png)</p>
                </button>
            </div>
            {(imagePath || asciiText) && (
                <div className="flex flex-row gap-4 justify-center items-start p-4">
                    {/* {imagePath && (
                        <img
                            src={imagePath}
                            alt="Uploaded"
                            className="max-w-[45%] rounded-lg shadow-lg"
                        />
                    )} */}
                    {asciiText && (
                        <pre className="text-[4px] text-green-400">
                            {asciiText.join("\n")}
                        </pre>
                        )
                    }
                </div>
            )}
        </main>
    )
}

export default App
