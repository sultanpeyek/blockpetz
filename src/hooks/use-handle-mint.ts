import { BASE_URL, UPDATE_AUTHORITY } from "@/app/config";
import { createPlugin, createV1, ruleSet } from "@metaplex-foundation/mpl-core";
import {
  setComputeUnitLimit,
  setComputeUnitPrice,
} from "@metaplex-foundation/mpl-toolbox";
import {
  type RpcConfirmTransactionResult,
  type Umi,
  generateSigner,
  publicKey,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import { useMutation } from "@tanstack/react-query";

interface Input {
  umi: Umi;
  minterPublicKey: string;
}

interface Output {
  signature: Uint8Array;
  result: RpcConfirmTransactionResult;
}

export const useHandleMint = () => {
  const mutation = useMutation<Output, Error, Input>({
    mutationFn: async ({ umi, minterPublicKey }: Input): Promise<Output> => {
      console.log(`Minting NFT for ${minterPublicKey}`);

      const asset = generateSigner(umi);

      let transactions = transactionBuilder();

      const dateUnix = Math.floor(Date.now() / 1000).toString();

      transactions = transactions.add(
        createV1(umi, {
          asset: asset,
          name: `BlockPetz ${dateUnix}`,
          uri: `${BASE_URL}/assets/1.json`,
          plugins: [
            {
              plugin: createPlugin({
                type: "Royalties",
                data: {
                  basisPoints: 500,
                  creators: [
                    {
                      address: publicKey(UPDATE_AUTHORITY),
                      percentage: 100,
                    },
                  ],
                  ruleSet: ruleSet("None"),
                },
              }),
              authority: null,
            },
            {
              plugin: createPlugin({
                type: "Attributes",
                data: {
                  attributeList: [
                    { key: "Exp", value: "500" },
                    {
                      key: "Last Fed Time",
                      value: dateUnix,
                    },
                  ],
                },
              }),
              authority: null,
            },
          ],
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
