import { useTransactionState } from "./context/TransactionContext";
import { TransactionState } from "./types";

export const useCurrentTransactionState = (myId: string | RegExp): TransactionState => {
  const {transactionsState} = useTransactionState();
  const keys = transactionsState.keys();
  //console.log("myId", myId);
  const currentStateId = keys.find(
    transactionUiId =>
      (typeof myId === "string" ? transactionUiId === myId : (myId instanceof RegExp ? transactionUiId.match(myId) : null))
        ? transactionUiId : null
  )
  //console.log("currentStateId", currentStateId);

  if(typeof currentStateId === "undefined")
    return { type: "idle" };

  const transaction = transactionsState.getValue(currentStateId);

  return transaction.type !== "idle" ? transaction : { type: "idle" };
};