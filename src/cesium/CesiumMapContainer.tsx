import { Cartesian3 } from "cesium";
import { useState } from "react";
import { MapInitialsDefaults } from "../enums";
import CesiumMap from "./CesiumMap";
import MapInitialize from "./tasks/CesiumMapInitialize";
import ValuesDisplay from "./widgets/ValuesDisplay";
import MapCurrentLocation from "./tasks/MapCurrentLocation";

export default function CesiumMapContainer() {
  const [initialPosition] = useState(Cartesian3.fromDegrees(35.19337844517548, 31.817524086924273, MapInitialsDefaults.InitialHeight))
  return (
    <>
      <CesiumMap>
        <>
          <MapInitialize destination={initialPosition} />
          <MapCurrentLocation />
          <ValuesDisplay />
        </>
      </CesiumMap>
    </>
  )
}