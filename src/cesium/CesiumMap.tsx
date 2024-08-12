import {
  Cartesian2,
  Camera as CesiumCamera,
  Viewer as CesiumViewer,
  createWorldTerrainAsync,
  ShadowMode,
  Terrain,
  UrlTemplateImageryProvider,
  WebMercatorProjection,
  WebMercatorTilingScheme
} from "cesium";
import { ReactNode, useEffect, useRef } from 'react';
import {
  Camera,
  CesiumComponentRef,
  Globe,
  Scene,
  Viewer
} from "resium";


//Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NmEyNjM1ZC0wZjA4LTQ3ODYtYjg3Yi0yNTUzOTE3YjQ4MjUiLCJpZCI6MTIwNSwiaWF0IjoxNTI3NDEyMTMxfQ.QIjChrObgyJXDtDPnHdwBJ9ZRYectKGIeOvbDanRSKk"


const firstPath = "https://dev.govmap.gov.il/backgroundMaps/streets_and_buildings"
const firstFullPath = "https://dev.govmap.gov.il/backgroundMaps/streets_and_buildings/{z}/{x}/{y}.png"
const secondPath = "https://dev.govmap.gov.il/tms/streets_and_buildings"

const imageryProvider = new UrlTemplateImageryProvider({
  url: firstFullPath, ///firstPath + "/{z}/{x}/{y}.png",
  maximumLevel: 19,
  minimumLevel: 7,
  tilingScheme: new WebMercatorTilingScheme({
    rectangleSouthwestInMeters: new Cartesian2(-20037508.342789244,
      -20037508.342789244),
    rectangleNortheastInMeters: new Cartesian2(20037508.342789244, 20037508.342789244)
  })
})

//const heading = Math.toRadians(20.0)
//const pitch = Math.toRadians(-35.0)

const terrainProvider = await createWorldTerrainAsync();

type IProps = {
  children: ReactNode
}
export default function CesiumMap({ children }: IProps) {
  const viewerRef = useRef<CesiumComponentRef<CesiumViewer> | null>(null);

  useEffect(() => {
    return () => {
      // Destroy the viewer on unmount
      console.log('cesium viewer unmount', viewerRef.current)
      if (viewerRef.current && (viewerRef.current as CesiumViewer).destroy) {
        (viewerRef.current as CesiumViewer).entities.removeAll();
        (viewerRef.current as CesiumViewer).destroy();
      }
      console.log('viewer ref on unmount function', viewerRef.current)
    }
  }, []);

  return (
    <Viewer
      ref={viewerRef}
      timeline={false}
      baseLayerPicker={false}
      geocoder={false}
      shadows={false}
      animation={false}
      homeButton={false}
      infoBox={false}
      sceneModePicker={false}
      navigationHelpButton={false}
      selectionIndicator={false}
      fullscreenButton={false}
      className='cesium-container'
      //   terrainProvider={terrainProvider}
      terrainShadows={ShadowMode.ENABLED}
      terrain={Terrain.fromWorldTerrain({
        requestWaterMask: false,
        requestVertexNormals: true,
      })}
      scene3DOnly={true}
      mapProjection={new WebMercatorProjection()}
    >
      {/* <ImageryLayer 
        imageryProvider={imageryProvider}
      ></ImageryLayer>  */}
      <Scene />
      <Globe
        // enableLighting={true}
        depthTestAgainstTerrain={true}
      />
      <Camera
      />
      {children}
    </Viewer>)
    ;
}