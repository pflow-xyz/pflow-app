import React, { useEffect, useState } from 'react';
   import { Model, importUrl, ModelData } from './model/model';
   import './App.css';

   const defaultModel: ModelData = {
       "modelType": "PetriNet",
       "version": "v1",
       "tokens": ["black"],
       "places": {},
       "transitions": {},
       "arcs": []
   };

   function getModel(): Model {
       var m = new Model(defaultModel)
       if (window.location.search.startsWith("?m=PetriNet&v=v1")) {
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
           const handleResize = () => {
               const height = window.innerHeight - 725;
               const width = window.innerWidth;
               const sourceElement = document.getElementById('source') as HTMLTextAreaElement | null;
               if (sourceElement) {
                   sourceElement.style.height = `${Math.max(height, 300)}px`;
                   sourceElement.style.width = `${Math.max(width - 40, 300)}px`;
               }
           };

           handleResize();
           window.addEventListener('resize', handleResize);
           return () => window.removeEventListener('resize', handleResize);
       }, []);

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
           <React.Fragment>
               <svg width="100%" height="630px" xmlns="http://www.w3.org/2000/svg">
                   <rect width="100%" height="60" fill="#f0f0f0" stroke="#333" strokeWidth="1" />
                   <rect y="60" width="100%" height="600" fill="#fff" stroke="#333" strokeWidth="1" />
                   <foreignObject height="630" width="100%" x="0" y="0">
                       <object id="svgObject" type="image/svg+xml" data="./model.svg">
                           <p>Your browser does not support SVG or the SVG file could not be loaded.</p>
                       </object>
                   </foreignObject>
                   <foreignObject id="pflow-logo" x="20" y="12" width="150" height="35">
                       <a href="/"><svg width="150" height="35" stroke="#FFFFFF"><g transform="scale(.3,.3)"><path d="M100.88 28.02H78.46v5.61h-5.6v5.6h-5.6v-5.6h5.6v-5.61h5.6V5.6h-5.6V0H61.65v5.6h-5.6v28.02h-5.6V5.6h-5.6V0H33.64v5.6h-5.6v22.42h5.6v5.61h5.6v5.6h-5.6v-5.6h-5.6v-5.61H5.6v5.61H0v11.21h5.6v5.6h28.02v5.6H5.6v5.61H0v11.21h5.6v5.6h22.42v-5.6h5.6v-5.61h5.6v5.61h-5.6v5.6h-5.6v22.42h5.6v5.6h11.21v-5.6h5.6V72.86h5.6v28.02h5.6v5.6h11.21v-5.6h5.6V78.46h-5.6v-5.6h-5.6v-5.61h5.6v5.61h5.6v5.6h22.42v-5.6h5.6V61.65h-5.6v-5.61H72.84v-5.6h28.02v-5.6h5.6V33.63h-5.6v-5.61zM67.25 56.04v5.61h-5.6v5.6H44.84v-5.6h-5.6V44.84h5.6v-5.6h16.81v5.6h5.6v11.21zm89.89-28.02h-11.21v11.21h11.21zm33.63 11.21h11.21V28.02h-33.63v11.21z"></path><path d="M179.56 72.86h-11.21V39.23h-11.21v56.05h-11.21v11.21h33.63V95.28h-11.21V84.07h33.63V72.86zm22.42-22.42v22.42h11.21V39.23h-11.21zm33.63-22.42H224.4v11.21h11.21v33.63H224.4v11.21h33.63V72.86h-11.21V39.23h11.21V28.02h-11.21V16.81h-11.21z"></path><path d="M246.82 5.6v11.21h22.42V5.6zm56.05 56.05V5.6h-22.42v11.21h11.21v56.05h-11.21v11.21h33.63V72.86h-11.21zm33.63-11.21V39.23h-11.21v33.63h11.21zm22.42 0h-11.21v11.21h11.21zm0-11.21h11.21V28.02H336.5v11.21zm-11.21 33.63H336.5v11.21h33.63V72.86zm22.42-22.42v22.42h11.21V39.23h-11.21zm44.84-11.21V28.02h-22.42v11.21h11.21v22.42h11.21zm11.21 22.42h-11.21v11.21h11.21zm11.21 11.21h-11.21v11.21h11.21zm11.21-22.42V28.02h-11.21v44.84h11.21zm11.21 22.42H448.6v11.21h11.21zm11.21-11.21h-11.21v11.21h11.21zm11.21-33.63h-11.21v33.63h11.21V39.23h11.21V28.02z"></path></g></svg>
                       </a>
                   </foreignObject>
                   <foreignObject height="30" width="100%" x="19" y="603">
                       <div id="controls">
                           <a href={modelState.toMinUrl()}>
                               <svg id="permalink" width="30" height="30">
                                   <title>Permalink</title>
                                   <path transform="translate(0, 2)"
                                         d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5">
                                   </path>
                               </svg>
                           </a>
                           <svg id="stop" width="30" height="30">
                               <title>Stop</title>
                               <path
                                   d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8m4-4H8V8h8z"></path>
                           </svg>
                           <svg id="play" width="30" height="30">
                               <title>Start</title>
                               <path
                                   d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m-2.5-3.5 7-4.5-7-4.5z"></path>
                           </svg>
                           <svg id="share" width="30" height="30">
                               <title>Share</title>
                               <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92"></path>
                           </svg>
                       </div>
                   </foreignObject>
               </svg>
               <textarea id="source">
                   {modelState.toJson()}
               </textarea>
               <div id="footer">
                   <a href="https://github.com/pflow-xyz/pflow-app">
                       <svg viewBox="0 0 24 24" id="GitHubIcon" transform="translate(0, 3)">
                           <path
                               d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2 2 0 01.64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 010-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 010 2.93c.83.74 1.2 1.74 1.2 2.94 0 4.21-2.57 5.13-5.04 5.4.45.37.82.92.82 2.02v3.03c0 .27.1.64.73.55A11 11 0 0012 1.27">
                           </path>
                       </svg>
                       Fork me!
                   </a>
               </div>
           </React.Fragment>
       );
   }

   export default App;