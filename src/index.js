import React, { useState } from 'react';
import ReactDOM from 'react-dom';
// import { scaleLinear, scaleTime, extent, timeFormat } from 'd3';
import { useWorldAtlas } from './useWorldAtlas';
import { useData } from './useData';
import { BubbleMap } from './BubbleMap/index.js';
import { DateHistogram } from './DateHistogram/index.js';

const width = window.innerWidth;
const height = window.innerHeight;
const dateHistogramSize = 0.25;

const xValue = d => d['Reported Date'];

const App = () => {
  const worldAtlas = useWorldAtlas();
  const data = useData();

  const [brushExtent, setBrushExtent] = useState();

  if (!worldAtlas || !data) {
    return <pre>Loading...</pre>;
  }

  const filteredData = brushExtent ? data.filter(d => {
    const date = xValue(d);
    return date > brushExtent[0] && date < brushExtent[1];
  }) : data;
  
  return (
    <svg 
      width={width} height={height}
    >
      <BubbleMap 
        data={data}
        filteredData={filteredData} 
        worldAtlas={worldAtlas}
        width={width}
        height={height}
      />
      <g transform={`translate(0, ${height - height*dateHistogramSize})`}>
        <DateHistogram data={data} width={width} height={height*dateHistogramSize} setBrushExtent={setBrushExtent} xValue={xValue}/>
      </g>
    </svg>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);






// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
