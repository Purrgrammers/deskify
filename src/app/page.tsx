'use client'

import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

type User = {
  id: number;
  created_at: string;
  name: string;
};


const Home = async () => {

  useEffect(() => {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const getDb =  async () => {
      const { data, error } = await supabase.from("Users").select();
      console.log(data, error)
    }
    getDb()
  })


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello</h1>
      {/* <p>{(data as unknown as User).name}</p> */}
    </main>
  );
};

export default Home;
