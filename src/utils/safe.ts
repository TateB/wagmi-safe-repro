import { default as SafeAppsSDK } from "@safe-global/safe-apps-sdk";
import { Hex } from "viem";
import { Chain } from "wagmi";
import { SafeConnector, SafeConnectorOptions } from "wagmi/connectors/safe";

export class NewSafeConnector extends SafeConnector {
  #sdk: SafeAppsSDK;

  constructor({
    chains,
    options: options_,
  }: {
    chains?: Chain[];
    options?: SafeConnectorOptions;
  }) {
    super({ chains, options: options_ });

    let SDK = SafeAppsSDK;
    if (
      typeof SafeAppsSDK !== "function" &&
      // @ts-expect-error This import error is not visible to TypeScript
      typeof SafeAppsSDK.default === "function"
    )
      SDK = (SafeAppsSDK as unknown as { default: typeof SafeAppsSDK }).default;

    this.#sdk = new SDK();
  }

  async getDetailsFromSafeHash(safeHash: Hex) {
    return this.#sdk.txs.getBySafeTxHash(safeHash);
  }
}
