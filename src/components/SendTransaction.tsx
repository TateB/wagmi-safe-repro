"use client";

import {
  useAccount,
  useBlockNumber,
  useQuery,
  useSendTransaction,
  useWaitForTransaction,
  useWalletClient,
} from "wagmi";

import { Hash, parseGwei } from "viem";
import { NewSafeConnector } from "../utils/safe";
import { stringify } from "../utils/stringify";

export function SendTransaction() {
  const { data, error, isLoading, isError, sendTransaction } =
    useSendTransaction({
      to: "0x69420f05A11f617B4B74fFe2E04B2D300dFA556F",
      data: "0x",
      value: 0n,
      mode: "prepared",
      gas: 21000n,
      gasPrice: parseGwei("1.5"),
    });
  const { connector: activeConnector } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: blockNumber } = useBlockNumber({
    watch: true,
  });
  const { data: txFetchedFromSafe } = useQuery(
    [
      {
        query: "realTxHash",
        args: [walletClient?.account, data?.hash, blockNumber],
      },
    ],
    async () => {
      if (!walletClient?.account || !data?.hash) return null;
      try {
        const resp = await (
          activeConnector as NewSafeConnector
        ).getDetailsFromSafeHash(data.hash);
        console.log(resp);
        return resp;
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  );
  const { data: receipt } = useWaitForTransaction({ hash: data?.hash });
  const { data: receiptFetchedFromSafe } = useWaitForTransaction({
    hash: txFetchedFromSafe?.txHash as Hash,
  });

  return (
    <>
      {sendTransaction && (
        <button onClick={() => sendTransaction()}>Send Transaction</button>
      )}

      {isLoading && <div>Check wallet...</div>}
      {(data?.hash || txFetchedFromSafe || receipt) && (
        <>
          <div>Transaction pending...</div>
          <div>Safe Transaction Hash: {data?.hash}</div>
          <div>
            Safe Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
          </div>
          <div>Real Transaction Hash: {txFetchedFromSafe?.txHash}</div>
          <div>
            Real Transaction Receipt:{" "}
            <pre>{stringify(receiptFetchedFromSafe, null, 2)}</pre>
          </div>
        </>
      )}
      {isError && <div>Error: {error?.message}</div>}
    </>
  );
}
