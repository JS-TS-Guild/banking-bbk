import { BankId, UserId } from "@/types/Common";
import GlobalRegistry from "./GlobalRegistry";
import BankAccount from "@/models/bank-account";

class TransactionService {
  transfer(
    fromUserId: UserId,
    toUserId: UserId,
    amount: number,
    fromBankId: BankId,
    toBankId?: BankId
  ): void {
    if (amount <= 0) {
      throw new Error("Transfer amount must be positive");
    }

    const fromUser = GlobalRegistry.getUser(fromUserId);

    const fromAccounts = GlobalRegistry.getUserAccountsInBank(
      fromUserId,
      fromBankId
    );

    if (fromAccounts.length === 0) {
      throw new Error("No accounts found for sender in specified bank");
    }

    let toAccount: BankAccount;

    if (toBankId) {
      const toAccounts = GlobalRegistry.getUserAccountsInBank(
        toUserId,
        toBankId
      );
      if (toAccounts.length === 0) {
        throw new Error("No accounts found for receiver in specified bank");
      }
      toAccount = toAccounts[0];
    } else {
      const toAccounts = GlobalRegistry.getUserAccountsInBank(
        toUserId,
        fromBankId
      );
      if (toAccounts.length === 0) {
        throw new Error("No accounts found for receiver in same bank");
      }
      toAccount = toAccounts[0];
    }

    let remainingAmount = amount;
    const debits: Array<{ account: BankAccount; amount: number }> = [];

    for (const account of fromAccounts) {
      if (remainingAmount <= 0) break;

      const availableAmount = account.canGoNegative()
        ? remainingAmount
        : Math.min(account.getBalance(), remainingAmount);

      if (availableAmount > 0) {
        debits.push({ account, amount: availableAmount });
        remainingAmount -= availableAmount;
      }
    }

    if (remainingAmount > 0) {
      throw new Error("Insufficient funds");
    }

    try {
      for (const { account, amount: debitAmount } of debits) {
        account.debit(debitAmount);
        fromUser.incrementUsage(account.getId());
      }

      toAccount.credit(amount);
    } catch (error) {
      for (const { account, amount: debitAmount } of debits) {
        account.credit(debitAmount);
      }
      throw error;
    }
  }
}

export default new TransactionService();
