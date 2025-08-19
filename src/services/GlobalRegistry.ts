import Bank from "@/models/bank";
import BankAccount from "@/models/bank-account";
import User from "@/models/user";
import { BankAccountId, BankId, UserId } from "@/types/Common";

class GlobalRegistry {
  private banks: Map<BankId, Bank>;
  private accounts: Map<BankAccountId, BankAccount>;
  private users: Map<UserId, User>;

  constructor() {
    this.banks = new Map();
    this.accounts = new Map();
    this.users = new Map();
  }

  registerBank(bank: Bank): void {
    this.banks.set(bank.getId(), bank);
  }

  registerAccount(account: BankAccount): void {
    this.accounts.set(account.getId(), account);
  }

  registerUser(user: User): void {
    this.users.set(user.getId(), user);
  }

  getBank(bankId: BankId): Bank {
    const bank = this.banks.get(bankId);
    if (!bank) {
      throw new Error(`Bank with id ${bankId} not found`);
    }
    return bank;
  }

  getAccount(accountId: BankAccountId): BankAccount {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error(`Account with id ${accountId} not found`);
    }
    return account;
  }

  getUser(userId: UserId): User {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    return user;
  }

  clear(): void {
    this.banks.clear();
    this.accounts.clear();
    this.users.clear();
  }

  getUserAccountsInBank(userId: UserId, bankId: BankId): BankAccount[] {
    const user = this.getUser(userId);
    const accountIds = user.getPrioritizedAccountIds();

    return accountIds
      .map((accountId) => this.getAccount(accountId))
      .filter((account) => account.getBankId() === bankId);
  }
}

export default new GlobalRegistry();
