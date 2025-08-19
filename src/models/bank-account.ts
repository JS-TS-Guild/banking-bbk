import { BankAccountId, BankId } from "@/types/Common";
import { v4 as uuid } from "uuid";

export default class BankAccount {
  private id: BankAccountId;
  private balance: number;
  private bankId: BankId;
  private isNegativeAllowed: boolean;

  constructor(
    initialBalance: number,
    bankId: BankId,
    isNegativeAllowed: boolean = false
  ) {
    this.id = uuid();
    this.balance = initialBalance;
    this.bankId = bankId;
    this.isNegativeAllowed = isNegativeAllowed;
  }

  getId(): BankAccountId {
    return this.id;
  }

  getBalance(): number {
    return this.balance;
  }

  getBankId(): BankId {
    return this.bankId;
  }

  canGoNegative(): boolean {
    return this.isNegativeAllowed;
  }

  debit(amount: number): void {
    if (!this.canDebit(amount)) {
      throw new Error("Insufficient funds");
    }
    this.balance -= amount;
  }

  credit(amount: number): void {
    this.balance += amount;
  }

  canDebit(amount: number): boolean {
    return this.isNegativeAllowed || this.balance >= amount;
  }
}
