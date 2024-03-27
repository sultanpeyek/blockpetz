// AssetCard.tsx
import { DELAY_BETWEEN_FEEDS, EXP_PER_LEVEL } from "@/app/config";
import type { AssetV1WithImage } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";

interface AssetCardProps {
  asset: AssetV1WithImage;
  handleFeed: (assetPublicKey: string) => void;
  handleBurn: (assetPublicKey: string) => void;
  feedIsPending: boolean;
  burnIsPending: boolean;
  feedIsDisabled: boolean;
  burnIsDisabled: boolean;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  handleFeed,
  handleBurn,
  feedIsPending,
  burnIsPending,
  feedIsDisabled,
  burnIsDisabled,
}) => {
  const attributeList = asset.attributes?.attributeList;

  const expAttribute = attributeList?.find((attr) => attr.key === "Exp");
  const expValue = expAttribute?.value ?? "0";

  const level = Math.floor(Number.parseInt(expValue) / EXP_PER_LEVEL);
  const progressToNextLevel = Number.parseInt(expValue) % EXP_PER_LEVEL;
  const progressPercentage = (
    (progressToNextLevel / EXP_PER_LEVEL) *
    100
  ).toFixed(2);

  const lastFedTimeAttribute = attributeList?.find(
    (attr) => attr.key === "Last Fed Time",
  );
  const lastFedTimeValue = lastFedTimeAttribute?.value ?? "0";

  const lastFedTime = Number.parseInt(lastFedTimeValue);
  const lastFedDate = new Date(lastFedTime * 1000);
  const lastFedDateString = lastFedDate.toLocaleString();

  const currentTime = Math.floor(Date.now() / 1000);
  const timeSinceLastFeed = currentTime - lastFedTime;
  const timeUntilNextFeed = DELAY_BETWEEN_FEEDS - timeSinceLastFeed;

  const [countdown, setCountdown] = useState(timeUntilNextFeed);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const canFeed = countdown <= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{asset.name}</CardTitle>
        <CardDescription className="max-w-[300px] truncate">
          <Link
            href={`https://solscan.io/token/${asset.publicKey.toString()}?cluster=devnet`}
            target="_blank"
            className="underline hover:no-underline text-violet-300"
          >
            {asset.publicKey.toString()}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm leading-loose">
        {asset?.image && (
          <div className="aspect-square rounded-sm overflow-hidden bg-slate-400">
            <Image
              src={asset.image}
              alt={asset.name}
              width={300}
              height={300}
              className="mx-auto w-full"
            />
          </div>
        )}
        <div className="mt-4">
          <p>Level: {level}</p>{" "}
          <p className="text-muted-foreground">{`Exp: ${progressToNextLevel}/${EXP_PER_LEVEL} (${progressPercentage}%)`}</p>
          <progress
            value={progressToNextLevel}
            max={EXP_PER_LEVEL}
            className="w-full h-2 rounded-sm overflow-hidden"
          />
        </div>
        <Link
          href={asset.uri}
          target="_blank"
          className="underline hover:no-underline text-violet-300"
        >
          Metadata URI
        </Link>
        <p className="block truncate max-w-[300px]">Owner:</p>
        <p className="block truncate max-w-[300px]">
          <Link
            href={`https://solscan.io/account/${asset.owner.toString()}?cluster=devnet`}
            target="_blank"
            className="underline hover:no-underline text-violet-300"
          >
            {asset.owner.toString()}
          </Link>
        </p>
        <p className="block truncate max-w-[300px]">Update Authority:</p>
        <p className="block truncate max-w-[300px]">
          <Link
            href={`https://solscan.io/account/${asset.updateAuthority.address?.toString()}?cluster=devnet`}
            target="_blank"
            className="underline hover:no-underline text-violet-300"
          >
            {asset.updateAuthority.address?.toString()}
          </Link>
        </p>
        <p className="block truncate max-w-[300px]">Last Fed Time:</p>
        <p className="block truncate max-w-[300px] text-muted-foreground">
          {lastFedDateString}
        </p>
        <p className="block truncate max-w-[300px]">Time Until Next Feed:</p>
        <p className="block truncate max-w-[300px] text-muted-foreground">
          {canFeed ? "Now" : `${Math.ceil(countdown / 60)} minutes`}
        </p>
      </CardContent>
      <CardFooter className="gap-4">
        <Button
          disabled={feedIsPending || !canFeed}
          onClick={() => handleFeed(asset.publicKey.toString())}
          className="w-full"
        >
          {feedIsPending && feedIsDisabled ? "Feeding..." : "Feed"}
        </Button>
        <Button
          variant="destructive"
          disabled={burnIsPending}
          onClick={() => handleBurn(asset.publicKey.toString())}
          className="w-full"
        >
          {burnIsPending && burnIsDisabled ? "Burning..." : "Burn"}
        </Button>
      </CardFooter>
    </Card>
  );
};
