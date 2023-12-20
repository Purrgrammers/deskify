"use client";
import { createClient } from "@supabase/supabase-js";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const fileTypes = ["JPG", "JPEG", "PNG"];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

//Toasters
const uploadSuccess = () => toast.success("Your picture has been uploaded.");
const missingFile = () => toast.error("You need to upload a file.");
const uploadFail = (error: Error) =>
  toast.error(`${error.message}. Try another picture.`);

const uploadImgToDb = async (userId: number, url: string) => {
  const { data, error } = await supabase
    .from("Maps")
    .insert({ userId, img: url })
    .select("id");
  //returns created mapId.
  return data;
};

const DropZone = () => {
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState("");
  const router = useRouter()

  const handleUpload = async (file: File) => {
    // Create a local URL only for preview
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    // Saves file to state
    setFile(file); // Save file for later submission
  };

  const handleSubmit = async () => {
    // Show toster when user try to submit without picture
    if (!file) {
      missingFile();
      return;
    }
    const filePath = `uploads/${file.name}`;
    try {
      // Uploads picture to bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("MapImages")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      // Gets public URL of the file from bucket
      const { data } = supabase.storage
        .from("MapImages")
        .getPublicUrl(filePath);
      const publicUrl = data.publicUrl;
      console.log("Public URL:", publicUrl);

      // Uploads userId and public URL to database and saves created mapId
      const mapId = await uploadImgToDb(1, publicUrl);
      console.log("File uploaded to Supabase:", data);
      console.log("This is id of created map:", mapId);

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
