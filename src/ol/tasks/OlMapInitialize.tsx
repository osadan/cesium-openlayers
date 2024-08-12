import { Coordinate } from "ol/coordinate";
import { ceil, toRadians } from 'ol/math';
import { useEffect } from "react";
import { useMapContext, useMapContextGetLocation, useMapContextValues } from "../../map.context";
import { useOlMapContext } from "../ol-context";
import { fromLonLat } from "ol/proj";

export default function OLMapInitialize({ destination }: { destination: Coordinate }) {
  console.log('--ol map initialize--', 'render')
  const { heading, zoom, headingChanged, zoomChanged, location: locationItem } = useMapContextValues()
  const { setLocationOl, clearCesiumLocationData } = useMapContextGetLocation()

  const { view, olMap } = useOlMapContext();

  useEffect(() => {
    if (view) {
      console.log('----heading----')
      const newHeading = view.getRotation() + toRadians(heading);
      view.setRotation(newHeading);
      setLocationOl({ heading: newHeading })
    }
  }, [headingChanged])

  useEffect(() => {
    if (view) {
      console.log('----zzzzommm-----')
      const newZoom = view.getZoom() + zoom;
      view.setZoom(newZoom)
      setLocationOl({ zoom: newZoom, resolution: view.getResolution() })
    }
  }, [zoomChanged])

  useEffect(() => {
    console.log('a', olMap, view);
    if (view) {
      console.log('b', locationItem.cesium)
      if (locationItem.cesium?.center) {
        console.log('-----location-item------', locationItem)
        console.log(view.getMaxResolution())
        view.setCenter(fromLonLat(locationItem.cesium?.center))
        //view.setZoom(12);
        view.setZoom(Math.log2(view.getMaxResolution() / locationItem.cesium?.resolution))
        view.setRotation(locationItem.cesium?.heading)

        clearCesiumLocationData()
      } else {
        view.setCenter(destination)
      }
    }
  }, [view, destination])

  return null
}