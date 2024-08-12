import { useCallback, useState, useTransition } from 'react';
import './App.css';
import { tMapValues } from './app.types';
import { MapInitialsDefaults, MapSceneMode } from './enums';
import MapContextProvider from './map.context';
import MapButtons from './MapButtons';
import OlMap from './ol/OlMap';
import LazyOlMap from './ol/LazyOlMap';
import LazyCesiumMap from './cesium/LazyCesiumMap';


export default function App() {
  console.log('APP RENDER')
  const [,startTransition]= useTransition()
  
  const [viewMode, setViewMode] = useState<MapSceneMode | null>(MapSceneMode.MODE_2D)
  
  const changeMapMode = (mode: MapSceneMode) => {
      startTransition(() => {
        setViewMode(viewMode === mode ? null : mode )
      })
  }

  return (
    <main>
      <MapContextProvider >
        <div>
          <button onClick={() => changeMapMode(MapSceneMode.MODE_3D)}>select Cesium</button><br/>
          <button onClick={() => changeMapMode(MapSceneMode.MODE_2D)}>select Ol</button>
        </div>
        <MapButtons/>
        {viewMode === MapSceneMode.MODE_2D && <LazyOlMap />}
        {viewMode === MapSceneMode.MODE_3D && <LazyCesiumMap /> }
      </MapContextProvider>
    </main>
  )
}