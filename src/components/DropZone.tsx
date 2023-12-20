"use client";
import { createClient } from "@supabase/supabase-js";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

const fileTypes = ["JPG", "JPEG", "PNG"];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const uploadSuccess = () => toast.success("Your picture has been uploaded.");
const missingFile = () => toast.error("You need to upload a file.");
const uploadFail = (error: Error) =>
  toast.error(`${error.message}. Try another picture.`);

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
    if (!file) {
      missingFile();
      return;
    }
    const filePath = `uploads/${file.name}`;
    try {
      const { data, error } = await supabase.storage
        .from("MapImages")
        .upload(filePath, file);
      if (error) throw error;
      console.log("File uploaded to Supabase:", data);
      setPreviewUrl("");
      uploadSuccess();
    } catch (error) {
      uploadFail(error as Error);
    }
  };
  return (
    <>
      <Toaster
        containerStyle={{
          top: 20,
          left: 20,
          bottom: 20,
          right: 20,
        }}
        toastOptions={{
          success: {
            style: {
              background: "#a3cfac",
            },
          },
          error: {
            style: {
              background: "#f6b2b5",
            },
          },
        }}
      />
      <FileUploader
        handleChange={(file: File) => handleUpload(file)}
        name="picture"
        types={fileTypes}
      />

      {previewUrl && (
        <div className="flex justify-center mt-4">
          <Image src={previewUrl} alt="Preview" width={250} height={250} />
        </div>
      )}
      <div className="flex justify-end mt-5">
        <div className="flex gap-2">
          <Button variant="outline">Skip</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </>
  );
};

export default DropZone;
