import { Map, View } from "ol";
import React, { createContext, useContext, useState } from "react";

const OLMapContext = createContext<any>(null);

export const useOlMapContext = () => useContext(OLMapContext);

export const initializeOlMapContext = () => {
  const { setOlMapRef, setOlViewRef } = useContext(OLMapContext)
  return {
    initializeOlMapContextRefs: (map: Map, view: View) => {
      setOlMapRef(map);
      setOlViewRef(view)
    },
    clearOlMapContextRefs: () => {
      console.log('clear ol map context')
      setOlMapRef(null);
      setOlViewRef(null)
    }
  }
}

export const clearOlMapContext = () => {
  const { setOlMapRef, setOlViewRef } = useContext(OLMapContext)
  setOlMapRef(null);
  setOlViewRef(null)
}

export default function OlMapProvider({ children, map, view }: any) {
  const [olMapRef, setOlMapRef] = useState<Map | null>(map);
  const [olViewRef, setOlViewRef] = useState<View | null>(view);

  return (
    <OLMapContext.Provider value={{
      olMap: olMapRef,
      view: olViewRef,
      setOlMapRef,
      setOlViewRef
    }}>
      {children}
    </OLMapContext.Provider>
  );
};