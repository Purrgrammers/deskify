import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type ActionCardProps = {
  img: string;
  title: string;
  description: string;
  btnText: string;
  reverse?: boolean;
  href: string
};

const ActionCard = ({ img, title, description, btnText, reverse, href }: ActionCardProps) => {

    const imgPlacement = reverse? 'flex-row-reverse': 'flex-row'
    const btnPlacement = reverse? 'place-self-start': 'place-self-end'

  return (
    <Card className="w-[350px] p-4">
      <CardContent className={`flex gap-4 ${imgPlacement}`}>
      <Image src={img} alt="image" width={100} height={200} className="border-solid border-black border-2"/>
        <div className="flex flex-col">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="my-2">{description}</CardDescription>
          <Link href={`/${href}`} passHref>
          <Button className={`${btnPlacement}`}>{btnText}</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionCard;
