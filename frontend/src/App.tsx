import {useState} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import {ConvertImageToGrayscale, EncodeImageToBase64, FetchImageAsBytes} from "../wailsjs/go/main/App";

function App() {
    const [imagePath, setImagePath] = useState("");
    const [convertedImagePath, setConvertedImagePath] = useState("")
    const updateImagePath = (src: string) => setImagePath(src);
    const updateConvertedImagePath = (src: string) => setConvertedImagePath(src);

    async function fetchImage() {
        let bytes = await FetchImageAsBytes();
        let imageSrc = await EncodeImageToBase64(bytes);
        updateImagePath(imageSrc);

        let grayScaleImage = await ConvertImageToGrayscale(bytes);
        let convertedImageSrc = await EncodeImageToBase64(grayScaleImage);
        updateConvertedImagePath(convertedImageSrc);
    }

    return (
        <div id="App">
            <h1 className="text-3xl font-bold underline">Image to ASCII Converter</h1>
            <div id="input" className="input-box">
                <button className="btn" id="image-file" onClick={fetchImage}>Choose image</button>
            </div>
            {imagePath && <img src={imagePath} id="image" alt="Random image" />}
            {convertedImagePath && <img src={convertedImagePath} id="grayscale-image" alt="Random grayscale image" />}
            
            {/* <img src={logo} id="logo" alt="logo"/>
            <div id="result" className="result">{resultText}</div>
            <div id="input" className="input-box">
                <input id="name" className="input" onChange={updateName} autoComplete="off" name="input" type="text"/>
                <button className="btn" onClick={greet}>Greet</button>
            </div> */}

        </div>
    )
}

export default App
