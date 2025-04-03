import React, { useEffect, useState } from 'react';
import {Model, importUrl, ModelData} from './model/model';
import './App.css';

const defaultModel: ModelData = {
    "modelType": "PetriNet",
    "version": "v0",
    "tokens": ["black"],
    "places": {},
    "transitions": {},
    "arcs": []
};

function  getModel(): Model {
    var m = new Model(defaultModel)
    if (window.location.search.startsWith("?m=PetriNet&v=v0")) {
        const imported = importUrl(window.location.search);
        if (imported) {
            m = new Model(imported)
            console.log('Imported model:', imported);
        }
    }
    return m
}

function App() {
    const [modelState, _] = useState<Model>(getModel());

    useEffect(() => {
        const svg = document.getElementById('svgObject') as HTMLObjectElement;
        if (svg) {
            svg.addEventListener('load', () => {
                if (svg.contentWindow) {
                    svg.contentWindow.postMessage({ type: 'setModel', model: modelState }, '*');
                }
            });
        }
    }, []);

    return (
        <svg width="100%" height="1000px" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="30" fill="#f0f0f0" stroke="#333" strokeWidth="1" />
            <foreignObject height="100%" width="100%" x="0" y="0">
                <object id="svgObject" type="image/svg+xml" data="./model.svg">
                    <p>Your browser does not support SVG or the SVG file could not be loaded.</p>
                </object>
            </foreignObject>
            <foreignObject height="20" width="100%" x="10" y="10">
                <a href={modelState.toMinUrl()} >MinUrl </a>
            </foreignObject>
            <foreignObject height={400} x={20} y={500} width={"100%"}>
                <textarea id={"source"}>
                    {modelState.toJson()}
                </textarea>
            </foreignObject>
        </svg>
    );
}

export default App;