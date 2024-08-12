import { useCallback, useEffect } from "react";
import { useMapContext, useMapContextGetLocation } from "../../map.context";
import { useOlMapContext } from '../ol-context';
import { transform, METERS_PER_UNIT, get as getProjection } from "ol/proj";
import { Cartesian3 } from "cesium";
import { calculateCesiumHeight, f2222 } from "../../openlayers-conversions.service";

export default function OLMapCurrentLocation() {
  const { setLocationOl } = useMapContextGetLocation()
  const { olMap, view } = useOlMapContext();

  const moveEndEvent = useCallback((...args: any) => {
    const viewCenter = view.getCenter();
    const lonLat = transform(viewCenter, 'EPSG:3857', 'EPSG:4326')

    const metersPerUnit = getProjection('EPSG:3857')?.getMetersPerUnit();
    const olZoom = view.getZoomForResolution(view.getResolution());

    console.log('---map point---', lonLat, olZoom)
    setLocationOl({
      extent: view.calculateExtent(olMap.getSize()),
      center: Cartesian3.fromDegrees(lonLat[0], lonLat[1]),
      centerLonLat: lonLat,
      centerOl: viewCenter,
      heading: view.getRotation(),
      resolution: view.getResolution(),
      zoom: view.getZoom(),
      height: view.getMaxResolution() / Math.pow(2, olZoom),
      heightV2: calculateCesiumHeight(olMap.getSize(), view.getZoom(), view.getMaxResolution()),
      //heightF222: f2222(view.getResolution(),lonLat[1])
    });
  }, [view])

  useEffect(() => {
    console.log('--map current location--, use effect', 'view', Boolean(view), 'map', Boolean(olMap))
    if (view) {
      view.on('change', moveEndEvent);
    }
    return () => {
      if (view) {
        view.un('change', moveEndEvent)
      }
    }
  }, [view])
  return null;
}