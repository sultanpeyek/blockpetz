"use client";

import { AssetCard } from "@/app/(provider)/components/asset-card";
import { DELAY_BETWEEN_FEEDS, EXP_PER_FEED, EXP_PER_LEVEL } from "@/app/config";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAssetsByOwner } from "@/hooks/use-assets-by-owner";
import { useHandleBurn } from "@/hooks/use-handle-burn";
import { useHandleFeed } from "@/hooks/use-handle-feed";
import { useHandleMint } from "@/hooks/use-handle-mint";
import { getErrorMessage } from "@/lib/get-error-message";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

export default function Home() {
  const queryClient = useQueryClient();

  const wallet = useWallet();

  const umi = createUmi(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST as string)
    .use(mplCore())
    .use(walletAdapterIdentity(wallet));

  const walletPublicKey = wallet.publicKey?.toString() ?? "";

  const { toast } = useToast();

  const LoadingIcon = () => (
    <UpdateIcon className="animate-spin h-5 w-5 mr-3" />
  );

  const {
    data: assetsByOwner,
    error: assetsByOwnerError,
    status: assetsByOwnerStatus,
    isFetching: assetsByOwnerIsFetching,
  } = useAssetsByOwner(umi, walletPublicKey);

  const mint = useHandleMint();
  const handleMint = async () => {
    try {
      toast({
        itemID: "mint-flow",
        title: "Minting your BlockPetz",
        description:
          "Once you have signed, it's waiting for confirmation from the blockchain...",
        duration: Number.POSITIVE_INFINITY,
        action: <LoadingIcon />,
      });

      const result = await mint.mutateAsync({
        umi,
        minterPublicKey: walletPublicKey,
      });

      toast({
        itemID: "mint-flow",
        title: "BlockPetz minted successfully",
        duration: 15_000,
      });

      mint.reset();
      queryClient.refetchQueries({
        queryKey: ["assets-by-owner", walletPublicKey],
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast({
        itemID: "mint-flow",
        variant: "destructive",
        title: errorMessage,
        duration: 15_000,
      });
    }
  };

  const burn = useHandleBurn();
  const handleBurn = async (assetPublicKey: string) => {
    try {
      toast({
        itemID: "burn-flow",
        title: "Burning your BlockPetz",
        description:
          "Once you have signed, it's waiting for confirmation from the blockchain...",
        duration: Number.POSITIVE_INFINITY,
        action: <LoadingIcon />,
      });

      const result = await burn.mutateAsync({
        umi,
        assetPublicKey,
      });

      toast({
        itemID: "burn-flow",
        title: "BlockPetz burned successfully",
        duration: 15_000,
      });

      burn.reset();
      queryClient.refetchQueries({
        queryKey: ["assets-by-owner", walletPublicKey],
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast({
        itemID: "burn-flow",
        variant: "destructive",
        title: errorMessage,
        duration: 15_000,
      });
    }
  };

  const feed = useHandleFeed();
  const handleFeed = async (assetPublicKey: string) => {
    try {
      toast({
        itemID: "feed-flow",
        title: "Feeding your BlockPetz",
        description:
          "Once you have signed, it's waiting for confirmation from the blockchain...",
        duration: Number.POSITIVE_INFINITY,
        action: <LoadingIcon />,
      });

      const result = await feed.mutateAsync({
        umi,
        assetPublicKey,
      });

      toast({
        itemID: "feed-flow",
        title: "BlockPetz fed successfully",
        duration: 15_000,
      });

      feed.reset();
      queryClient.refetchQueries({
        queryKey: ["assets-by-owner", walletPublicKey],
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast({
        itemID: "feed-flow",
        variant: "destructive",
        title: errorMessage,
        duration: 15_000,
      });
    }
  };

  return (
    <>
      <div className="container max-w-screen-lg">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to BlockPetz</CardTitle>
            <CardDescription>
              This project is a showcase of the Metaplex "Core" capabilities.
              Here, you can mint, feed, and burn your BlockPetz. Learn more
              about Metaplex "Core" in the{" "}
              <Link
                href="https://developers.metaplex.com/core"
                target="_blank"
                className="underline hover:no-underline text-violet-500"
              >
                documentation
              </Link>
              .
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="container max-w-screen-lg">
        <Card>
          <CardHeader>
            <CardTitle>Mint your BlockPetz</CardTitle>
            <CardDescription>
              Please ensure your wallet's network is set to Devnet. You can fund
              your wallet with SOL from{" "}
              <Link
                href="https://faucet.solana.com"
                target="_blank"
                className="underline hover:no-underline text-violet-500"
              >
                faucet.solana.com
              </Link>
              . Click the button below to mint your BlockPetz.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={handleMint}
              disabled={mint.isPending || !wallet?.connected}
              size="lg"
              className="w-full"
            >
              {mint.isPending
                ? "Minting..."
                : wallet?.connected
                  ? "Mint"
                  : "Connect Wallet"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {wallet?.connected && (
        <div className="container max-w-screen-lg space-y-6">
          <Card className="min-h-[765px]">
            <CardHeader>
              <CardTitle>Your BlockPetz</CardTitle>
              <CardDescription>
                You can feed your BlockPetz to level them up. Each feeding will
                add {EXP_PER_FEED} EXP. Each time your BlockPetz gains{" "}
                {EXP_PER_LEVEL} EXP, it will level up. You can feed your
                BlockPetz every {DELAY_BETWEEN_FEEDS / 60} minutes. BlockPetz at
                levels 1, 2, and 3 above will have different looks. You can also
                choose to burn your BlockPetz.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assetsByOwnerIsFetching && (
                <p className="text-center min-h-[765px] flex justify-center items-center">
                  Loading...
                </p>
              )}
              {assetsByOwnerStatus === "error" && !assetsByOwnerIsFetching && (
                <p className="text-center min-h-[765px] flex justify-center items-center">
                  Error: {assetsByOwnerError.message}
                </p>
              )}
              {assetsByOwnerStatus === "success" &&
                !assetsByOwnerIsFetching &&
                (assetsByOwner?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[765px]">
                    {assetsByOwner.map((asset) => (
                      <AssetCard
                        key={asset.publicKey.toString()}
                        asset={asset}
                        handleFeed={handleFeed}
                        handleBurn={handleBurn}
                        feedIsPending={feed.isPending}
                        burnIsPending={burn.isPending}
                        feedIsDisabled={
                          feed.variables?.assetPublicKey ===
                          asset.publicKey.toString()
                        }
                        burnIsDisabled={
                          burn.variables?.assetPublicKey ===
                          asset.publicKey.toString()
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center min-h-[765px] flex justify-center items-center">
                    No BlockPetz found.
                  </p>
                ))}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
