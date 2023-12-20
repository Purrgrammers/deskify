
'use client';
import { Button } from '@/components/ui/button';
// import Canvas from '@/components/Canvas';
import dynamic from 'next/dynamic';

const Canvas = dynamic(() => import('@/components/Canvas'), {
  ssr: false,
});

const CreateMap = ()=> {
  return (
    <>
    <h1 className='text-2xl'>Create your office map</h1>
    <p>Drag and drop bookable rooms and desks onto your map</p>
    <Canvas></Canvas>
    <Button variant="secondary">Back</Button>
    <Button>Create map</Button>
    </>
  );
}

export default CreateMap