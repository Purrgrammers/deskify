"use client";
import { createClient } from "@supabase/supabase-js";
import React from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "JPEG", "PNG"];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DropZone = () => {
  const handleChange = async (file: File) => {
    const filePath = `uploads/${file.name}`;
    const { data, error } = await supabase.storage
      .from("MapImages")
      .upload(filePath, file);
    if (data) {
      console.log(data);
    } else {
      console.log(error);
    }
  };
  return (
    <FileUploader
      handleChange={(file: File) => handleChange(file)}
      name="picture"
      types={fileTypes}
    />
  );
};

export default DropZone;
