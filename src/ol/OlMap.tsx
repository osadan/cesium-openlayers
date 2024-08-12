import { View, Map } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { ReactElement, useEffect, useMemo, useState } from "react";
import useFirstRender from "../hooks/use-first-render.hook";
import { useMapContextValues } from "../map.context";
import { fromLonLat, transformExtent } from "ol/proj";
import OlMapProvider, { initializeOlMapContext } from "./ol-context";
import MapInitialize from "./tasks/OlMapInitialize";
import MapCurrentLocation from "./tasks/MapCurrentLocation";
import ValuesDisplay from "./widgets/ValuesDisplay";

const OlMapInit = ({ children }: { children: ReactElement }) => {
  console.log('olmap init')
  const { initializeOlMapContextRefs, clearOlMapContextRefs } = initializeOlMapContext();
  useEffect(() => {
    console.log('in use effect')
    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM()
        }),
      ],
      controls: [],
      view: new View({
        projection: 'EPSG:3857',
        center: [0, 0],
        zoom: 10,
      }),
    });
    console.log(map, map.getView())
    initializeOlMapContextRefs(map, map.getView())
    return () => {
      console.log('on ol map unmount')
      map.setTarget(undefined);
      clearOlMapContextRefs();
    };
  }, []);
  //const height = window.innerWidth * (2 / 3);
  const height = '424px'
  return (<>
    <div id="map" style={{ width: "100%", height }} />
    {children}
  </>)
}

export default function OlMap({ }) {
  // use memo to prevent re render 
  const initialPosition = useMemo(() => fromLonLat([35.19337844517548, 31.817524086924273]), []);

  return (
    <OlMapProvider>
      <OlMapInit>
        <>
          <MapInitialize destination={initialPosition} />
          <MapCurrentLocation />
          <ValuesDisplay />
        </>
      </OlMapInit>
    </OlMapProvider>
  );
}