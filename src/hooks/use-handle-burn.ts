import { burnV1 } from "@metaplex-foundation/mpl-core";
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

export const useHandleBurn = () => {
  const mutation = useMutation<Output, Error, Input>({
    mutationFn: async ({ umi, assetPublicKey }: Input): Promise<Output> => {
      console.log(`Minting NFT for ${assetPublicKey}`);

      const asset = publicKey(assetPublicKey);

      let transactions = transactionBuilder();

      transactions = transactions.add(
        burnV1(umi, {
          asset: asset,
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
