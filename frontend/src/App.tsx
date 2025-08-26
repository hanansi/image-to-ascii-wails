import {useState} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import {Greet, FetchImage, ConvertImageToGrayscale} from "../wailsjs/go/main/App";

function App() {
    // const [resultText, setResultText] = useState("Please enter your name below 👇");
    // const [name, setName] = useState('');
    // const updateName = (e: any) => setName(e.target.value);
    // const updateResultText = (result: string) => setResultText(result);
    const [imagePath, setImagePath] = useState("");

    // function greet() {
    //     Greet(name).then(updateResultText);
    // }

    function fetchImage() {
        FetchImage().then(setImagePath);
    }

    return (
        <div id="App">
            <h1 className="text-3xl font-bold underline">Image to ASCII Converter</h1>
            <div id="input" className="input-box">
                <button className="btn" id="image-file" onClick={fetchImage}>Choose image</button>
            </div>
            {imagePath && <img src={imagePath} id="image" alt="Random image" />}
            
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
