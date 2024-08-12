import { useCallback, useState } from 'react';
import styled from "styled-components"
import { tMapValues } from './app.types';
import { useMapContext } from './map.context';

type IIncrements = 'up'| 'down';

type IProps = {
  changeItem: (propType: tMapValues, value: number, direction: IIncrements) => void;
}

type IControlButtonProps ={
  label: string, 
  value: number, 
  action: (value: number, direction:IIncrements) => void
}

const MapDirectionControleButton = ({label, value, action}:IControlButtonProps )  => {
const [stValue, setValue] = useState(value);
  return (
  <StyledUl>
    <li>
      {label}
    </li>
          <li>
            <button onClick={() => action(stValue, 'up')}>
             +
            </button>
          </li>
          <li>
            <button onClick={() => action(stValue, 'down')}>
               -
            </button>
          </li>
          <li>
            <input  value={stValue} onChange={(e => setValue(parseFloat(e?.target?.value ?? '0') as unknown as number))} />
          </li>
        </StyledUl>
)
}

export default function MapButtons() {
const {vals,setVals}  = useMapContext();

const changeItem = (propType: tMapValues, value: number, direction:'up' | 'down') => {
  console.log(propType, value,direction,vals)

//  if(propType !== 'zoom'){
//     setVals({
//       ...vals, 
//       [propType] : direction === 'up' ? vals[propType] + value : vals[propType] - value,
//       [`${propType}Changed`]: `${propType}Changed` + 1
//     })
//   }else{
  setVals({
    ...vals, 
    [propType] : direction === 'up' ? value : -1 * value,
    [`${propType}Changed`]: vals[`${propType}Changed`] + 1
  })
  //}
}
  

  return (
    <>
      <MapDirectionControleButton label='heading' value={10} action={
         (value: number, direction: IIncrements) => changeItem('heading', value, direction) 
        } />
      <MapDirectionControleButton label='pitch' value={25} action={
         (value: number, direction: IIncrements) => changeItem('pitch', value, direction) 
        } />
      <MapDirectionControleButton label='roll' value={0} action={
         (value: number, direction: IIncrements) => changeItem('roll', value, direction) 
      } />
      <MapDirectionControleButton label='zoom' value={500} action={
         (value: number, direction: IIncrements) => changeItem('zoom', value, direction) 
      } />
      
    </>
  )
}




const StyledUl = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap:wrap;
  padding:0;
  margin:0;
  li {
    list-style-type:none;
    button{
      border:1px solid black;
      font-size:12px;
      background-color:#e3e3e3;
      padding:5px;
      max-width:100px;
      min-width:35px;
    }
    input {
      margin-left:20px;
    }
  }
`