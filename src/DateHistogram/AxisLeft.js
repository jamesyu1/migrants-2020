export const AxisLeft = ({yScale, innerWidth, tickOffset = 3}) => 
  yScale.ticks().map(tickValue => (
    <g 
      className="tick" 
      key={tickValue} 
      transform={`translate(0, ${yScale(tickValue)})`}
    >
      <line x1={0} y1={0} x2={innerWidth} y2={0} />
      <text dy=".42em" x={-tickOffset} style={{textAnchor: 'end'}}>
        {tickValue}
      </text>
    </g>
  ))