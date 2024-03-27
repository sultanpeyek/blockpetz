import type { AssetV1WithImage } from "@/app/types";
import { Key, getAssetV1GpaBuilder } from "@metaplex-foundation/mpl-core";
import { type Umi, publicKey } from "@metaplex-foundation/umi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useAssetsByOwner = (umi: Umi, ownerPublicKey: string) => {
  return useQuery<AssetV1WithImage[], Error>({
    queryKey: ["assets-by-owner", ownerPublicKey],
    queryFn: async () => {
      if (!ownerPublicKey && ownerPublicKey !== "") {
        throw new Error("Owner public key is required.");
      }

      const assetsByOwner = await getAssetV1GpaBuilder(umi)
        .whereField("key", Key.AssetV1)
        .whereField("owner", publicKey(ownerPublicKey))
        .getDeserialized();

      const assetsWithImages = await Promise.all(
        assetsByOwner.map(async (asset) => {
          try {
            const response = await axios.get(asset.uri);
            return {
              ...asset,
              image: response.data.image as string,
            };
          } catch (error) {
            console.error(`Failed to fetch URI: ${asset.uri}`, error);
            return asset;
          }
        }),
      );

      const sortedAssets = assetsWithImages.sort((a, b) =>
        a.publicKey.toString().localeCompare(b.publicKey.toString()),
      );

      return sortedAssets;
    },
    enabled: !!umi && ownerPublicKey !== "",
    refetchOnWindowFocus: false,
    retry: 3,
  });
};
