import { Cartesian3, Cartographic } from "cesium";
import { useCesium } from "resium";
import styled from "styled-components";
import { getWebMercatorPosition, getWgs84Position } from "../../cesium-conversions.service";
import { useEffect } from "react";
import { useMapContextValues } from "../../map.context";
import { useOlMapContext } from "../ol-context";

const JsonDisplay = ({ value }: { value: { [key: string]: undefined | string | number | Cartesian3 | Cartographic } }) => {
  return (<StyledPre>{JSON.stringify(value, null, 2)}</StyledPre>)
}


export default function ValuesDisplay() {
  const { view } = useOlMapContext()
  const { location } = useMapContextValues()

  const data = Boolean(view) ? {
    center: view.getCenter(),
    resolution: view.getResolution(),
    heading: view.getRotation(),
    zoom: view.getZoom(),

  } : { noData: 'noData' };


  return (
    <StyledGrid>
      <JsonDisplay value={data} />
      <JsonDisplay value={location} />
    </StyledGrid>
  )
}

const StyledPre = styled.pre`
  text-wrap: wrap;
  word-wrap:break-word
`;

const StyledGrid = styled.div`
  display:grid;
  grid-template-columns: auto auto;
`;

