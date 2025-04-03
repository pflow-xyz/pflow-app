import React, { useEffect } from 'react';
import { Model, importUrl } from './model/model';
import './App.css';

const model: any = {
    "version": "v0",
    "tokens": ["black"],
    "places": {
        "p1": { "offset": 0, "initial": [1], "tokens": [1], "capacity": [0], "x": 70, "y": 250 },
        "p2": { "offset": 1, "initial": [0], "tokens": [0], "capacity": [0], "x": 300, "y": 250 },
        "p3": { "offset": 1, "initial": [0], "tokens": [0], "capacity": [0], "x": 200, "y": 350 }
    },
    "transitions": {
        "t1": { "x": 190, "y": 150 },
        "t2": { "x": 190, "y": 250 }
    },
    "arcs": [
        { "source": "p1", "target": "t1", "weight": [1] },
        { "source": "t1", "target": "p2", "weight": [1] }
    ]
};


function App() {
    useEffect(() => {
        const svg = document.getElementById('svgObject') as HTMLObjectElement;
        if (svg) {
            svg.addEventListener('load', () => {
            // load from URL if needed
            var imported = null;
            if (window.location.search) {
                imported = importUrl(window.location.search);
            }
            //const m: Model = new Model(imported);
            if (svg.contentWindow) {
                if (imported?.version === "v0") {
                    svg.contentWindow.postMessage({ type: 'setModel', model: imported }, '*');
                } else {
                    svg.contentWindow.postMessage({ type: 'setModel', model: model }, '*');
                }
                console.log('Model sent to SVG:', model);
            } else {
                console.error('SVG contentWindow not available.');
            }
            });
        } else {
            console.error('SVG object not found.');
        }
    }, []);

    return (
        <svg width={1500} height={1000} viewBox="0 0 1500 1000" xmlns="http://www.w3.org/2000/svg">
            <foreignObject height="100%" width="100%" x="0" y="0">
                <object id="svgObject" type="image/svg+xml" data="./model.svg"></object>
            </foreignObject>
        </svg>
    );
}

export default App;