import { scaleLinear, scaleTime, extent, timeFormat, bin, timeMonths, sum, max, brushX, select } from 'd3';
import { useRef, useEffect, useMemo } from 'react';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { Marks } from './Marks';

// these attributes will not be redefined every render

// const height = 100;
const margin = { top: 0, bottom: 20, left: 50, right: 30 };
const xAxisLabelOffset = 50;
const yAxisLabelOffset = 35;
const xAxisTickFormat = timeFormat("%Y-%m-%d"); 

const yValue = d => d['Total Dead and Missing'];

const yAxisLabel = 'Total Dead and Missing';
const xAxisLabel = 'Date';

export const DateHistogram = ({data, width, height, setBrushExtent, xValue}) => {

	const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;  

  const xScale = useMemo(
    () => 
      scaleTime()
        .domain(extent(data, xValue))
        .range([0, innerWidth])
        .nice(), 
    [data, xValue, innerWidth]
  );

  const binnedData = useMemo(() => {
    const [start, stop] = xScale.domain(); // destructuring syntax to unpack array of two elements
    return bin()
      .value(xValue)
      .domain(xScale.domain())
      .thresholds(timeMonths(start, stop))
      (data)
      .map(array => ({
        x0: array.x0,
        x1: array.x1,
        y: sum(array, yValue)
      }))
    }, 
    [xValue, xScale, data, yValue]
  );

  const yScale = useMemo(() => 
    scaleLinear()
      .domain([0, max(binnedData, d => d.y)])
      .range([innerHeight, 0])
      .nice(), // make scale terminate at "nice" numbers to fit all data points
    [binnedData, innerHeight]
  );

  const brushRef = useRef(); // react ref allows us to access raw dom element, which is exposed to us as brushRef.current

  // useEffect is only executed when rendering is complete, so dom elements are available
  // so brushRef.current would not be undefined
  useEffect(() => {
    const brush = brushX().extent([[0, 0], [innerWidth, innerHeight]]);
    brush(select(brushRef.current)); // set up brush by invoking brush as a function with d3 selection of g element
    brush.on('brush end', (event) => { // 'brush' and 'end' are events, second argument is a event listener
      setBrushExtent(event.selection ? event.selection.map(xScale.invert) : null); // .invert method accepts range and outputs domain
    });
  }, [innerWidth, innerHeight]); // each time these dependencies change, the effect is executed again

  return (
    <>
      <rect width={width} height={height} fill='white' />
      <g transform={`translate(${margin.left}, ${margin.top})`}>

        <AxisBottom 
          xScale={xScale} 
          innerHeight={innerHeight} 
          tickFormat={xAxisTickFormat}
          tickOffset={8} 
        />

        <AxisLeft 
          yScale={yScale}
          innerWidth={innerWidth}
          tickOffset={8}
        />

        <Marks 
          binnedData={binnedData} 
          xScale={xScale} 
          yScale={yScale}
          tooltipFormat={d => d}
          innerHeight={innerHeight}
        />

        <text 
          className="axis-label" 
          x={innerWidth/2} 
          y={innerHeight+xAxisLabelOffset} 
          textAnchor="middle"
        >
          {xAxisLabel}
        </text>

        <text 
          className="axis-label" 
          textAnchor="middle"
          transform={`translate(${-yAxisLabelOffset}, ${innerHeight/2}) rotate(-90)`}
        >
          {yAxisLabel}
        </text>

        <g ref={brushRef} />

      </g>
    </>
  )
} 