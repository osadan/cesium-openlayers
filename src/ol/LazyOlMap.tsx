import { lazy, Suspense } from 'react';

const LazyOlMapWrapper = lazy( () => import('./OlMap'))

export default function LazyOlMap (){
  return (
    <Suspense fallback={<div>loading</div>} >
      <LazyOlMapWrapper />
    </Suspense>
  )
}