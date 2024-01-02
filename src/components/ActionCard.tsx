import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

type ActionCardProps = {
  img: StaticImageData;
  title: string;
  description: string;
  btnText: string;
  reverse?: boolean;
  href: string;
};

const ActionCard = ({
  img,
  title,
  description,
  btnText,
  reverse,
  href,
}: ActionCardProps) => {
  const imgPlacement = reverse ? "flex-row-reverse" : "flex-row";
  // const btnPlacement = reverse ? "place-self-start" : "place-self-end";

  return (
    <Card className="w-[350px] md:w-[500px] lg:w-[600px] p-4 lg:p-6 md:p-5 ">
      <CardTitle className="text-xl mb-3">{title}</CardTitle>
      <CardContent
        className={`flex gap-4 xl:max-h-80 justify-evenly rounded-xl border-solid bg-gray-50 border-gray border shadow-sm ${imgPlacement} `}
      >
        <Image
          src={img}
          alt="image"
          width={500}
          height={700}
          className="border-solid rounded-xl border-black border-1 w-40 md:w-52 lg:w-56 xl:w-64"
        />

        <div className={`flex `}>
          <div className="flex flex-col justify-between items-center">
            <CardDescription className="my-2 text-center mt-7 px-2 text-xs md:text-base md:pt-10 ">
              {description}
            </CardDescription>
            <Link href={`/${href}`} passHref>
              <Button
                size={"sm"}
                className={`justify-self-center mb-5 xl:mb-8`}
              >
                {btnText}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionCard;
