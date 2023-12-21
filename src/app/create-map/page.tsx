
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
    <div className="pl-10 pt-10">
    <h1 className='text-2xl'>Create your office map</h1>
    <p>Drag and drop bookable rooms and desks onto your map</p>
    </div>
    <div id='canvasWrapper' className='h-screen'>
    <Canvas></Canvas>
    </div>
    </MapContextProvider>
    </>
  );
}

export default CreateMap