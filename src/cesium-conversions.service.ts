import { Ellipsoid, Cartesian3, WebMercatorProjection, Cartographic, Math as CesiumMath, Rectangle, FrustumGeometry, PerspectiveFrustum, Scene, Cartesian2 } from "cesium";
import { Extent } from "ol/extent";
import { Projection, get as getProjection } from "ol/proj";


export const getWebMercatorPosition = (ellipsoid: Ellipsoid, position: Cartesian3) => {


  const cameraPositionCartographic = ellipsoid.cartesianToCartographic(position);
  const webMercatorProjection = new WebMercatorProjection(ellipsoid);

  // Convert Cartographic to Web Mercator
  return { webMercator: webMercatorProjection.project(cameraPositionCartographic) };

};
export const getWgs84Position = (position: Cartesian3) => {
  const cartographic = Cartographic.fromCartesian(position);
  const longitude = CesiumMath.toDegrees(cartographic.longitude);
  const latitude = CesiumMath.toDegrees(cartographic.latitude);
  const height = cartographic.height;
  return { longitude, latitude, height };
};

export const getExtentCenterAndSize = (extent: Extent) => {
  let minX = extent[0];
  let minY = extent[1];
  let maxX = extent[2];
  let maxY = extent[3];

  let centerX = (minX + maxX) / 2;
  let centerY = (minY + maxY) / 2;
  let width = maxX - minX;
  let height = maxY - minY;

  return {
    center: [centerX, centerY],
    width: width,
    height: height
  };
}

export const getExtentFromCamera = (rect: Rectangle) => {
  return [
    CesiumMath.toDegrees(rect.west),
    CesiumMath.toDegrees(rect.south),
    CesiumMath.toDegrees(rect.east),
    CesiumMath.toDegrees(rect.north)
  ];
}

export const heightToZoom = ({ ellipsoid, position, pitch }: any) => {
  if (pitch < 0) {
    pitch = Math.PI / 2
  }
  const calcPitch = pitch < 0 ? Math.PI / 2 : pitch;
  const earthCircumference = 40075016.686;  // in meters

  const cartographicPosition = ellipsoid.cartesianToCartographic(position);

  const longitudeInDegrees = CesiumMath.toDegrees(cartographicPosition.longitude);
  const latitudeInDegrees = CesiumMath.toDegrees(cartographicPosition.latitude);
  const altitudeInMeters = cartographicPosition.height;




  let effectiveAltitude;
  if (Math.abs(Math.cos(calcPitch)) < 1e-5) { // using a small epsilon to deal with floating-point precision issues
    effectiveAltitude = altitudeInMeters;  // Use raw altitude if looking straight down
  } else {
    effectiveAltitude = altitudeInMeters / Math.cos(calcPitch);
  }


  const resolution = effectiveAltitude / 225000;
  // Compute zoom level
  const zoomLevel = Math.log2((earthCircumference * Math.cos(Math.abs(latitudeInDegrees * Math.PI / 180))) / (resolution * 256));
  const calibratedZoomLevel = Math.max(1, Math.min(zoomLevel, 15)); // Clamp zoom to typical OpenLayers range


  return zoomLevel


}

export const positionToCartographicDeg = (ellipsoid: Ellipsoid, position: Cartesian3, positionWc: Cartesian3) => {

  const cartographicPosition = ellipsoid.cartesianToCartographic(position);
  const longitudeInDegrees = CesiumMath.toDegrees(cartographicPosition.longitude);
  const latitudeInDegrees = CesiumMath.toDegrees(cartographicPosition.latitude);
  return {
    lon: longitudeInDegrees,
    lat: latitudeInDegrees,
    alt: positionToDistance(ellipsoid, positionWc)
  }
}

export const positionToDistance = (ellipsoid: any, positionWC: any) => {
  var cameraPosition = positionWC;
  var ellipsoidPosition = ellipsoid.scaleToGeodeticSurface(cameraPosition);
  var distance = Cartesian3.magnitude(Cartesian3.subtract(cameraPosition, ellipsoidPosition, new Cartesian3()));
  return distance
}

export const heightToZoom3 = (canvas: HTMLCanvasElement, frustum: any, projection: Projection, distance: number, latitude: number) => {

  // @ts-ignore TS2341
  const fovy = frustum.fovy; // vertical field of view
  console.assert(!isNaN(fovy));
  const metersPerUnit = projection.getMetersPerUnit();

  const visibleMeters = 2 * distance * Math.tan(fovy / 2);
  const relativeCircumference = Math.cos(Math.abs(latitude));
  const visibleMapUnits = visibleMeters / metersPerUnit! / relativeCircumference;
  const resolution = visibleMapUnits / canvas.clientHeight;

  return resolution;
}

export function calcDistanceForResolution(
  canvas: HTMLCanvasElement,
  frustum: any,
  // projection: Projection, 
  //distance: number, 
  resolution: number,
  latitude: number,
  //latitude: number,
  //scene: Scene,
  projection: Projection
): number {
  // @ts-ignore TS2341
  const fovy = frustum.fovy; // vertical field of view
  console.assert(!isNaN(fovy));
  const metersPerUnit = projection.getMetersPerUnit();

  // number of "map units" visible in 2D (vertically)
  const visibleMapUnits = resolution * canvas.clientHeight;

  // The metersPerUnit does not take latitude into account, but it should
  // be lower with increasing latitude -- we have to compensate.
  // In 3D it is not possible to maintain the resolution at more than one point,
  // so it only makes sense to use the latitude of the "target" point.
  const relativeCircumference = Math.cos(Math.abs(latitude));

  // how many meters should be visible in 3D
  const visibleMeters = visibleMapUnits * metersPerUnit! * relativeCircumference;

  // distance required to view the calculated length in meters
  //
  //  fovy/2
  //    |\
  //  x | \
  //    |--\
  // visibleMeters/2
  const requiredDistance = (visibleMeters / 2) / Math.tan(fovy / 2);

  // NOTE: This calculation is not absolutely precise, because metersPerUnit
  // is a great simplification. It does not take ellipsoid/terrain into account.

  return requiredDistance;
}



export const getHeading = (heading: number) => {
  return 360 * Math.PI / 180 - heading
}

export const heightToResolution4 = (canvas: any, pitch: number, positionCartographic: any) => {

  const cameraHeight = positionCartographic.height
  const clientHeight = canvas.clientHeight;
  const effectiveHeight = cameraHeight * Math.cos(Math.abs(pitch)); // need to make sure the pitch is positive
  console.log(clientHeight, positionCartographic, cameraHeight, effectiveHeight, pitch)
  return effectiveHeight / clientHeight

}


// ---------------------------------------------------
/**
 * Get the 3D position of the given pixel of the canvas.
 */
export function pickOnTerrainOrEllipsoid(scene: Scene, pixel: Cartesian2): Cartesian3 {
  const ray = scene.camera.getPickRay(pixel);
  const target = scene.globe.pick(ray!, scene);
  return target || scene.camera.pickEllipsoid(pixel);
}


export function pickCenterPoint(scene: Scene): Cartesian3 | undefined {
  const canvas = scene.canvas;
  const center = new Cartesian2(
    canvas.clientWidth / 2,
    canvas.clientHeight / 2);
  return pickOnTerrainOrEllipsoid(scene, center);
}

export function pickBottomPoint(scene: Scene): Cartesian3 | undefined {
  const canvas = scene.canvas;
  const bottom = new Cartesian2(
    canvas.clientWidth / 2, canvas.clientHeight);
  return pickOnTerrainOrEllipsoid(scene, bottom);
}

export function f22222(scene: any) {
  const x = pickCenterPoint(scene);
  const globe = scene.globe;
  const carto = scene.camera.positionCartographic.clone();
  const height = globe.getHeight(carto);
  carto.height = height || 0;
  const bestTarget = Ellipsoid.WGS84.cartographicToCartesian(carto);
  const distance_ = Cartesian3.distance(bestTarget, scene.camera.position);
  const bestTargetCartographic = Ellipsoid.WGS84.cartesianToCartographic(bestTarget);

  const canvas = scene.canvas;
  const camera = scene.camera;
  // @ts-ignore TS2341
  const fovy = camera.frustum.fovy; // vertical field of view
  console.assert(!isNaN(fovy));
  const metersPerUnit = getProjection('EPSG:3857')!.getMetersPerUnit();

  const visibleMeters = 2 * distance_ * Math.tan(fovy / 2) / Math.cos(scene.camera.pitch);
  const relativeCircumference = Math.cos(Math.abs(bestTargetCartographic.latitude));
  const visibleMapUnits = visibleMeters / metersPerUnit! / relativeCircumference;
  const resolution = visibleMapUnits / canvas.clientHeight;

  return resolution;
}