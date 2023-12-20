
'use client';
import { Button } from '@/components/ui/button';
import { MapContextProvider } from '@/contexts/MapContext';
import dynamic from 'next/dynamic';

const Canvas = dynamic(() => import('@/components/Canvas'), {
  ssr: false,
});


const CreateMap = ()=> {
  
  return (
    <>
    <MapContextProvider>
    <h1 className='text-2xl'>Create your office map</h1>
    <p>Drag and drop bookable rooms and desks onto your map</p>
    <div id='canvas-wrapper' className='border-2 border-solid border-black h-screen'>
    <Canvas></Canvas>
    </div>
    </MapContextProvider>
    </>
  );
}

export default CreateMap