import { BASE_URL, EXP_PER_FEED, EXP_PER_LEVEL } from "@/app/config";
import {
  createPlugin,
  fetchAssetV1,
  updatePluginV1,
  updateV1,
} from "@metaplex-foundation/mpl-core";
import {
  setComputeUnitLimit,
  setComputeUnitPrice,
} from "@metaplex-foundation/mpl-toolbox";
import {
  type RpcConfirmTransactionResult,
  type Umi,
  publicKey,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import { useMutation } from "@tanstack/react-query";

interface Input {
  umi: Umi;
  assetPublicKey: string;
}

interface Output {
  signature: Uint8Array;
  result: RpcConfirmTransactionResult;
}

export const useHandleFeed = () => {
  const mutation = useMutation<Output, Error, Input>({
    mutationFn: async ({ umi, assetPublicKey }: Input): Promise<Output> => {
      console.log(`Feeding for ${assetPublicKey}`);

      const asset = await fetchAssetV1(umi, publicKey(assetPublicKey));
      const attributeList = asset.attributes?.attributeList;

      const expAttribute = attributeList?.find((attr) => attr.key === "Exp");
      const newExpValue = expAttribute
        ? Number.parseInt(expAttribute.value) + EXP_PER_FEED
        : EXP_PER_FEED;

      const level = Math.floor(newExpValue / EXP_PER_LEVEL);

      const newUri = getUriForLevel(level);

      const dateUnix = Math.floor(Date.now() / 1000).toString();

      let transactions = transactionBuilder();

      if (asset.uri !== newUri) {
        transactions = transactions.add(
          updateV1(umi, {
            asset: asset.publicKey,
            newName: asset.name,
            newUri,
          }),
        );
      }

      transactions = transactions.add(
        updatePluginV1(umi, {
          asset: asset.publicKey,
          plugin: createPlugin({
            type: "Attributes",
            data: {
              attributeList: [
                { key: "Exp", value: newExpValue.toString() },
                {
                  key: "Last Fed Time",
                  value: dateUnix,
                },
              ],
            },
          }),
        }),
      );

      transactions = transactions.prepend(
        setComputeUnitPrice(umi, { microLamports: 1_000_000 }),
      );
      transactions = transactions.prepend(
        setComputeUnitLimit(umi, { units: 800_000 }),
      );

      const result = await transactions.sendAndConfirm(umi, {
        send: {
          commitment: "finalized",
        },
        confirm: {
          commitment: "finalized",
        },
      });

      return result;
    },
  });

  return mutation;
};

function getUriForLevel(level: number): string {
  // Replace this with your own logic to get the URI for a given level
  if (level >= 3) {
    return `${BASE_URL}/assets/3.json`;
  }
  return `${BASE_URL}/assets/${level}.json`;
}
