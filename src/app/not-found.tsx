import Link from "next/link";
import notFoundImg from "../404.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const notFound = () => {
  return (
    <>
      <h1 className="text-center text-2xl font-medium mt-20 mb-6">
        Page not found
      </h1>
      <div className="flex justify-center mt-8">
        <Image
          src={notFoundImg}
          alt="big green checkmark"
          width={200}
          height={200}
        />
      </div>
      <p className="text-center text-lg my-3">This page does not exist.</p>

      <p className="text-center text-lg">Go back to home page or try again.</p>

      <div className="flex justify-evenly mt-10">
        <Link href="/">
          <Button className="w-36">Home</Button>
        </Link>
      </div>
    </>
  );
};

export default notFound;
