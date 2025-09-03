import {useState} from 'react';
import './App.css';
import {ConvertImageToAscii, ConvertImageToGrayscale, EncodeImageToBase64, FetchImageAsBytes} from "../wailsjs/go/main/App";

function App() {
    const [imagePath, setImagePath] = useState<string>("");
    const [asciiText, setAsciiText] = useState<string[]>([]);

    // TODO - Make the UI look better
    async function convertToAscii() {
        let bytes = await FetchImageAsBytes();
        if (!bytes) return; // Prevents error from empty string

        // let imageSrc = await EncodeImageToBase64(bytes);
        // if (!imageSrc) return;
        
        // setImagePath(imageSrc);

        let grayScaleImageBytes = await ConvertImageToGrayscale(bytes);
        let asciiText = await ConvertImageToAscii(grayScaleImageBytes);
        setAsciiText(asciiText);
    }

    return (
        <main id="App" className="flex flex-col gap-4 justify-start bg-black h-screen w-screen">
            <h1 className="pt-4 text-2xl font-bold underline">Image to ASCII Converter</h1>
            <div>
                <button className="bg-gradient-to-b from-blue-500 to-purple-500 rounded-md size-36 cursor-pointer
                                    hover:bg-gradient-to-l hover:from-red-500 hover:to-yellow-500" 
                                    id="image-file" onClick={convertToAscii}>
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
