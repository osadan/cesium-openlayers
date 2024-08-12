import { useRef, useEffect } from "react";
interface Props {
  [key: string]: any;
}

const prev = {
  current: {
    // previous state of props
  } as Props
};

export default function useTraceUpdate(props: any) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries<Props>(props).reduce<Record<string, [any, any]>>((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps);
    }
    prev.current = props;
  });
}