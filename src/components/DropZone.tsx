"use client";
import { createClient } from "@supabase/supabase-js";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Image from "next/image";

const fileTypes = ["JPG", "JPEG", "PNG"];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DropZone = () => {
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState("");

  const handleUpload = async (file: File) => {
    // Create a local URL for preview
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    setFile(file); // Save file for later submission
  };

  const handleSubmit = async () => {
    if (file) {
      const filePath = `uploads/${file.name}`;
      const { data, error } = await supabase.storage
        .from("MapImages")
        .upload(filePath, file);

      if (data) {
        console.log("File uploaded to Supabase:", data);
      } else {
        console.error("Upload error:", error);
      }
    }
  };
  return (
    <>
      <FileUploader
        handleChange={(file: File) => handleUpload(file)}
        name="picture"
        types={fileTypes}
      />
      {previewUrl && (
        <Image src={previewUrl} alt="Preview" width={150} height={150} />
      )}
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
};

export default DropZone;
