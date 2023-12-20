"use client";
import Image from "next/image";
import success from "../../success.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Success = () => {
  return (
    <>
      <h1 className="text-center text-2xl font-medium mt-9 mb-6">
        Congratulations!
      </h1>
      <p className="text-center text-lg my-3">Your bookable map was created!</p>

      <p className="text-center text-lg">Now you can book rooms and desks.</p>
      <div className="flex justify-center mt-8">
        <Image
          src={success}
          alt="big green checkmark"
          width={200}
          height={200}
        />
      </div>
      <div className="flex justify-evenly mt-10">
        <Link href="/">
          <Button variant="outline" className="w-36">
            Home
          </Button>
        </Link>
        <Button className="w-36">Map</Button>
      </div>
    </>
  );
};

export default Success;
