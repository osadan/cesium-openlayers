import { createContext, useContext, useReducer } from 'react';

const MapControlContext = createContext(null);

const MapControlDispatchContext = createContext<any>(undefined);

export function MapControlProvider({ children }: { children: any }) {
  const [data, dispatch] = useReducer(
    mapControlReducer,
    initialState
  );

  return (
    <MapControlContext.Provider value={data}>
      <MapControlDispatchContext.Provider value={dispatch}>
        {children}
      </MapControlDispatchContext.Provider>
    </MapControlContext.Provider>
  );
}

export function useMapControl() {
  return useContext(MapControlContext);
}

export function useMapControlDispatch() {
  return useContext(MapControlDispatchContext);
}

function mapControlReducer(state: any, action: any) {
  switch (action.type) {
    case 'plus':
      return {
        ...state,
        value: state.value + 1,
      }
    case 'minus':
      return {
        ...state,
        value: state.value - 1,
      }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  };
}

const initialState = {
  value: 0
}