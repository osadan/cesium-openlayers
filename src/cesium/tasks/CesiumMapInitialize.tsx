import { Camera, Cartesian3, Cartographic, Ellipsoid, Globe, HeadingPitchRange, Math as MathCesium, Matrix4 } from "cesium";
import { useEffect, useState } from "react";
import { useCesium } from "resium";
import { useMapContext, useMapContextGetLocation, useMapContextValues } from "../../map.context";
import { calcDistanceForResolution, getHeading, getWgs84Position } from "../../cesium-conversions.service";
import { get as getProjection } from 'ol/proj'
import { toRadians } from "ol/math";


// Function to adjust height within Cartesian3, considering it's in 3D.
const adjustHeight = (camera: Camera, distance: number) => {
  const direction = camera.direction;
  const movementVector = Cartesian3.multiplyByScalar(direction, distance, new Cartesian3());
  Cartesian3.add(camera.position, movementVector, camera.position);
}

export default function MapInitialize({ destination }: { destination: Cartesian3 }) {
  console.log('map initialize render');
  const [mapReady, setMapReady] = useState(false);
  const { heading, pitch, roll, zoom, zoomChanged, headingChanged, pitchChanged, rollChanged, location } = useMapContextValues()
  const { camera, scene } = useCesium();
  const { clearOlLocationData } = useMapContextGetLocation()

  if (!camera) {
    return null
  }

  useEffect(() => {
    if (!mapReady) {
      return;
    }
    console.log('view set - heading',)
    camera?.setView({
      orientation: {
        heading: camera.heading + MathCesium.toRadians(heading),
        pitch: camera.pitch,
        roll: camera.roll
      }
    })
  }, [headingChanged])


  useEffect(() => {
    if (!mapReady) {
      return;
    }
    console.log('view set - pitch', camera.pitch, pitch, MathCesium.toRadians(pitch))
    camera?.setView({
      orientation: {
        heading: camera.heading,
        pitch: camera.pitch + MathCesium.toRadians(pitch),
        roll: camera.roll
      }
    })
  }, [pitchChanged])


  useEffect(() => {
    if (!mapReady) {
      return;
    }
    console.log('view set - roll')
    camera?.setView({
      orientation: {
        heading: camera.heading,
        pitch: camera.pitch,
        roll: camera.roll + roll
      }
    })
  }, [rollChanged])



  useEffect(() => {
    if (!mapReady) {
      return;
    }
    console.log('adjust height', zoom, zoomChanged)
    adjustHeight(camera!, zoom);
  }, [zoomChanged])

  useEffect(() => {
    console.log('--cesium initialize data--', location.ol)
    if (!Boolean(camera)) {
      return;
    }
    if (location.ol?.center) {
      const cartographic = getWgs84Position(location.ol.center);

      const distance = calcDistanceForResolution(
        scene!.canvas,
        camera.frustum,
        location.ol.resolution,
        MathCesium.toRadians(location.ol.centerLonLat[1]),
        getProjection('EPSG:3857')!);

      console.log('distance ', distance, location.ol.heightV2, distance * Math.cos(MathCesium.toRadians(-45)));
      const offset = new HeadingPitchRange(
        getHeading(location.ol.heading),
        MathCesium.toRadians(-45),
        distance * Math.cos(MathCesium.toRadians(-45))
      );
      camera.lookAt(
        Cartesian3.fromDegrees(location.ol.centerLonLat[0], location.ol.centerLonLat[1]),
        offset
      );
      camera.lookAtTransform(Matrix4.IDENTITY);


      clearOlLocationData()
    } else {
      camera!.setView({
        destination
      })
    }
    setMapReady(true);
  }, [camera, destination])
  return null
}