import { createContext, ReactNode, useCallback, useContext, useState } from 'react'
import { MapInitialsDefaults } from './enums';

export type headingDirection = 'left' | 'right';

export type IContextProps = {
  heading: number;
  pitch: number;
  roll: number;
  zoom: number;
  zoomChanged?: number;
  headingChanged?: number;
  pitchChanged?: number;
  rollChanged?: number;
}

const initialValues = {
  heading: MapInitialsDefaults.InitialHeading,
  pitch: MapInitialsDefaults.InitialPitch,
  roll: MapInitialsDefaults.InitialRoll,
  zoom: MapInitialsDefaults.InitialHeight,
  zoomChanged: 0,
  headingChanged: 0,
  pitchChanged: 0,
  rollChanged: 0,
}

const MapContext = createContext<any>(
  undefined
);

export const useMapContext = () => useContext(MapContext)

export const useMapContextValues = () => {
  const context = useContext(MapContext)
  return {
    ...context.vals,
    location: context.location
  }
}

export const useMapContextGetLocation = () => {
  const { setLocation, location } = useMapContext();

  const setLocationOl = useCallback((values: any) => {
    console.log('-----set ol-----')
    setLocation({
      ...location,
      ol: { ...location.ol, ...values }
    })
  }, [location])

  const setLocationCesium = useCallback((values: any) => {
    console.log('-- set cesium--', values);
    setLocation({
      ...location,
      cesium: { ...location.cesium, ...values }
    })
  }, [location])
  const clearCesiumLocationData = useCallback(() => {
    console.log('--------clear cesium----------------')
    // setLocation({
    //   ...location,
    //   cesium: {}
    // })
  }, [location]);
  const clearOlLocationData = useCallback(() => {
    console.log("-----------clear ol--------------", location)
    // setLocation({
    //   ...location,
    //   ol: {}
    // })
  }, [location])
  return {
    setLocationOl,
    setLocationCesium,
    clearCesiumLocationData,
    clearOlLocationData
  }
}

export default function MapContextProvider({ children, init }: { children: ReactNode, init?: any }) {

  const [vals, setVals] = useState<IContextProps>(initialValues)
  const [location, setLocation] = useState<any>({ ol: {}, cesium: {} });
  return (
    <MapContext.Provider value={{
      vals,
      setVals,
      location,
      setLocation
    }}>
      {children}
    </MapContext.Provider>
  )
}
