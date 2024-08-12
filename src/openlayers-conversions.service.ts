import { Cartesian2, Cartesian3, Ellipsoid, Scene } from "cesium";

export const zoomToCesiumHeight = (zoom: number, mapHeightInPixels: number, maxResolution = 156543.03392804097) => {
  const resolution = maxResolution / Math.pow(2, zoom);
  return resolution * mapHeightInPixels;
}

// Get map height in pixels and Cesium height
export const calculateCesiumHeight = (mapSize: [number, number], zoom: number, maxResolution = 156543.03392804097) => {
  // const mapSize = map.getSize();
  const mapHeightInPixels = mapSize[1];
  //const zoom = map.getView().getZoom();
  const cesiumHeight = zoomToCesiumHeight(zoom, mapHeightInPixels, maxResolution);
  console.log('Cesium Height:', cesiumHeight)
  return cesiumHeight;
}


const toLonLat = (center) => {

}
