import { useCallback, useEffect } from "react";
import { useCesium } from "resium";
import { f22222, getExtentCenterAndSize, getExtentFromCamera, getHeading, heightToResolution4, heightToZoom, heightToZoom3, positionToCartographicDeg, positionToDistance } from "../../cesium-conversions.service";
import { useMapContext, useMapContextGetLocation } from "../../map.context";
import { get as ProjectionProvider } from "ol/proj";
import { PerspectiveFrustum } from "cesium";

export default function CesiumMapCurrentLocation() {
  const { camera, globe, scene } = useCesium();
  const { setLocationCesium } = useMapContextGetLocation()

  const moveEndEvent = useCallback((...args: any) => {
    const rect = camera?.computeViewRectangle(globe?.ellipsoid)

    const extent = getExtentFromCamera(rect!);

    const mapCenterAndSize = getExtentCenterAndSize(extent)

    const position = positionToCartographicDeg(globe?.ellipsoid!, camera?.position!, camera?.positionWC!);

    const resolution = heightToZoom3(
      scene?.canvas!, camera?.frustum, ProjectionProvider('EPSG:3857')!, position.alt, position.lat
    )

    console.log('cesium current location', resolution, mapCenterAndSize, getHeading(camera!.heading))
    setLocationCesium({
      extent,
      ...mapCenterAndSize,
      heading: getHeading(camera?.heading!),
      pitch: camera?.pitch,
      roll: camera?.roll,
      resolutionHeightToZoom3: resolution,
      resolutionPositionToDistance: positionToDistance(globe?.ellipsoid, camera?.positionWC),
      resolutionHeightToResolution4: heightToResolution4(scene?.canvas, camera?.pitch!, camera?.positionCartographic),
      zoom: heightToZoom({ ellipsoid: globe?.ellipsoid, position: camera?.position, pitch: camera?.pitch }),
      resolution: f22222(scene)

    });
  }, [camera])

  // const changedEvent = useCallback((... args: any) =>{
  //   console.log('--changed callback--', args);

  // },[camera,globe])

  useEffect(() => {
    //    camera?.changed.addEventListener(changedEvent);
    camera?.moveEnd.addEventListener(moveEndEvent);
    return () => {
      camera?.moveEnd.removeEventListener(moveEndEvent)
      //    camera?.changed.addEventListener(moveEndEvent);
    }
  }, [])
  return null;
}