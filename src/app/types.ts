import type { AssetV1 } from "@metaplex-foundation/mpl-core";

export interface AssetV1WithImage extends AssetV1 {
  image?: string;
}
