import React from 'react'
import {Model, ModelData, importUrl} from './model/model'
import './App.css';

const model: ModelData = {
    "modelType": "petriNet",
    "version": "v0",
    "places": {
        "place0": {"offset": 0, "initial": 1, "capacity": 3, "x": 130, "y": 207},
        "place1": {"offset": 1, "x": 395, "y": 299}
    },
    "transitions": {
        "txn0": {"x": 46, "y": 116},
        "txn1": {"x": 227, "y": 112},
        "txn2": {"x": 43, "y": 307},
        "txn3": {"x": 235, "y": 306}
    },
    "arcs": [
        {"source": "txn0", "target": "place0"},
        {"source": "place0", "target": "txn1", "weight": 3},
        {"source": "txn2", "target": "place0", "weight": 3, "inhibit": true},
        {"source": "place0", "target": "txn3", "inhibit": true},
        {"source": "txn3", "target": "place1"}
    ]
}


function EmbeddedImport(): React.ReactElement {
    var imported = null;
    if (!window.location.search) {
        return <React.Fragment/>
    }
    imported = importUrl(window.location.search);
    const m : Model = new Model(imported);
    return <foreignObject x="600" y="0" width="500" height="500">
        <a href={m.toUrl()} target="_blank" rel="noreferrer">
            <img src={m.toImage()} alt="test"/>
        </a>
        <br/>
        <a href={m.toMinUrl()}>
            Re-encoded Url model
        </a>
    </foreignObject>

}

function App() {
    const m = new Model(model);
    // REVIEW: consider using an Object here to isolate the model from the rest of the code
    // react components will be able to access the model through props
    // - really we just need to publish the model App -> EmbeddedImport
    return (
        <svg width={1500} height={1000} viewBox="0 0 1500 1000" xmlns="http://www.w3.org/2000/svg">
            <foreignObject x="100" y="0" width="1500" height="1000">
                <a href={m.toUrl()} target="_blank" rel="noreferrer">
                    <img src={m.toImage()} alt="test"/>
                </a>
                <br/>< br/>
                <a href={"?"}> Back &lt;- </a>
                <br/>< br/>
                <a href={m.toUrl()}>
                    Url-encoded model -&gt;
                </a>
                <br/>< br/>
                <a href={m.toMinUrl()}>
                    MinUrl-encoded model -&gt;
                </a>
            </foreignObject>
            <EmbeddedImport/>
        </svg>
    );
}

export default App;