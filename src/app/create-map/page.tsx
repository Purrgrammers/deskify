
'use client';
// import Canvas from '@/components/Canvas';
import dynamic from 'next/dynamic';

const Canvas = dynamic(() => import('@/components/Canvas'), {
  ssr: false,
});

const CreateMap = ()=> {
  return (
    <Canvas></Canvas>
  );
}

export default CreateMap