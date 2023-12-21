
'use client';
import { MapContextProvider } from '@/contexts/MapContext';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';

const Canvas = dynamic(() => import('@/components/Canvas'), {
  ssr: false,
});


const CreateMap = () => {
  const router = useRouter()
  const path = usePathname()
  const id = path.replace('/create-map/', '')

  return (
    <>
    <MapContextProvider>
    <div className="pl-10 pt-10">
    <h1 className='text-2xl'>Create your office map</h1>
    <p>Drag and drop bookable rooms and desks onto your map</p>
    </div>
    <div id='canvasWrapper' className='h-screen'>
    <Canvas mapId={Number(id)}></Canvas>
    </div>
    </MapContextProvider>
    </>
  );
}

export default CreateMap