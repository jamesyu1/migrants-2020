import { useMemo } from 'react';
import { Marks } from './Marks';
import { max, scaleSqrt } from 'd3';

const sizeValue = d => d['Total Dead and Missing'];
const maxRadius = 25;

export const BubbleMap = ({data, filteredData, worldAtlas, width, height}) => {

  const sizeScale = useMemo(() => 
    scaleSqrt()
      .domain([0, max(data, sizeValue)])
      .range([0, maxRadius]),
    [data, sizeValue, maxRadius]
  );

  return (
    <Marks 
      worldAtlas={worldAtlas}
      data={filteredData}
      width={width}
      height={height}
      sizeScale={sizeScale}
      sizeValue={sizeValue}
    />
  );
}