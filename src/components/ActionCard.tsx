import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
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
    <Card className="w-[350px] p-4">
      <CardTitle className="text-xl mb-3">{title}</CardTitle>
      <CardContent className={`flex gap-4 justify-between ${imgPlacement} `}>
        <Image
          src={img}
          alt="image"
          width={150}
          height={250}
          className="border-solid border-black border-1"
        />

        <div className={`flex `}>
          <div className="flex flex-col justify-between items-center">
            <CardDescription className="my-2 text-center mt-4">
              {description}
            </CardDescription>
            <Link href={`/${href}`} passHref>
              <Button className={`justify-self-center mb-5`}>{btnText}</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionCard;
