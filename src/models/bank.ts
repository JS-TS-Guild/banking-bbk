import { BankAccountId, BankId, UserId } from "@/types/Common";
import BankAccount from "./bank-account";
import { v4 as uuid } from "uuid";
import GlobalRegistry from "@/services/GlobalRegistry";
import TransactionService from "@/services/TransactionService";

interface BankOptions {
  isNegativeAllowed?: boolean;
}

export default class Bank {
  private id: BankId;
  private accounts: Map<BankAccountId, BankAccount>;
  private isNegativeAllowed: boolean;

  constructor(options: BankOptions = {}) {
    this.id = uuid();
    this.accounts = new Map();
    this.isNegativeAllowed = options.isNegativeAllowed || false;
  }

  static create(options: BankOptions = {}): Bank {
    const bank = new Bank(options);
    GlobalRegistry.registerBank(bank);
    return bank;
  }

  getId(): BankId {
    return this.id;
  }

  createAccount(initialBalance: number): BankAccount {
    const account = new BankAccount(
      initialBalance,
      this.id,
      this.isNegativeAllowed
    );
    this.accounts.set(account.getId(), account);
    GlobalRegistry.registerAccount(account);
    return account;
  }

  getAccount(accountId: BankAccountId): BankAccount {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error("Account not found");
    }
    return account;
  }

  send(
    fromUserId: UserId,
    toUserId: UserId,
    amount: number,
    toBankId?: BankId
  ): void {
    TransactionService.transfer(
      fromUserId,
      toUserId,
      amount,
      this.id,
      toBankId
    );
  }

  getAllowsNegative(): boolean {
    return this.isNegativeAllowed;
  }
}
