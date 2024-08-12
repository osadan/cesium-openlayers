import { Cartesian3, Cartographic } from "cesium";
import { useCesium } from "resium";
import styled from "styled-components";
import { getWebMercatorPosition, getWgs84Position } from "../../cesium-conversions.service";
import { useEffect } from "react";
import { useMapContextValues } from "../../map.context";

const JsonDisplay = ({ value }: { value: { [key: string]: string | number | Cartesian3 | Cartographic } }) => {
  return (<StyledPre>{JSON.stringify(value, null, 2)}</StyledPre>)
}

export function freeObject(object: any) {
  const keys = Object.keys(object)
  for (const key of keys) {
    delete object[key]
  }
}

export default function ValuesDisplay() {
  const { camera, globe, viewer } = useCesium()
  const { location } = useMapContextValues()
  const { heading, pitch, roll, position, up, right, direction, positionCartographic } = camera!;

  const wgsPosition = getWgs84Position(position)
  const webMercatorPosition = getWebMercatorPosition(globe!.ellipsoid, position)

  return (
    <StyledGrid>
      <JsonDisplay value={wgsPosition} />
      <JsonDisplay value={webMercatorPosition} />
      <JsonDisplay value={{ heading, pitch, roll, position, up, right, direction, positionCartographic }} />
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

