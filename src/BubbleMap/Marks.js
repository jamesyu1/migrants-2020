import { geoNaturalEarth1, geoPath, geoGraticule } from 'd3';
import { useMemo } from 'react';

const projection = geoNaturalEarth1();
const graticule = geoGraticule();

export const Marks = ({
  worldAtlas: {land, interiors},
  data,
  width,
  height,
  sizeScale,
  sizeValue
}) => {
  const path = geoPath(projection.fitSize([width, height], land));

  return (
    <g className="marks">
      { useMemo(() => {
        console.log('rendering map');
        return <>
          <path className="sphere" d={path({type: 'Sphere'})} />

          <path className="graticules" d={path(graticule())} />

          {land.features.map(feature => (
            <path className="land" d={path(feature)} />
          ))}

          <path className="interiors" d={path(interiors)} />
        </>
        },
        // [path, graticule, land, interiors]
        [graticule, land, interiors]
        )
      }

      {data.map(d => {
        const [x, y] = projection(d.coords);
        return <circle cx={x} cy={y} r={sizeScale(sizeValue(d))} />
      })}
    </g>
  )
};