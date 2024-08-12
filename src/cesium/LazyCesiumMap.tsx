import { lazy, Suspense } from 'react';

const LazyCesiumWrapper = lazy(() => import('./CesiumMapContainer'))

export default function LazyCesiumMap () {
  return (
    <Suspense fallback={<div>loading</div>}>
      <LazyCesiumWrapper />
    </Suspense>
  )
}