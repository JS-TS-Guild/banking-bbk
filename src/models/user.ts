import { v4 as uuid } from "uuid";
import { BankAccountId, UserId } from "@/types/Common";
import GlobalRegistry from "@/services/GlobalRegistry";

export default class User {
  private id: UserId;
  private name: string;
  private accountIds: BankAccountId[];
  private usageCounts: Map<BankAccountId, number> = new Map();

  constructor(id: UserId, name: string, accountIds: BankAccountId[]) {
    this.id = id;
    this.name = name;
    this.accountIds = [...accountIds];
  }

  static create(name: string, accountIds: BankAccountId[]): User {
    const userId = uuid();
    const user = new User(userId, name, accountIds);
    GlobalRegistry.registerUser(user);
    return user;
  }

  getId(): UserId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getAccountIds(): BankAccountId[] {
    return [...this.accountIds];
  }

  addAccount(accountId: BankAccountId): void {
    if (!this.accountIds.includes(accountId)) {
      this.accountIds.push(accountId);
    }
  }

  incrementUsage(accountId: BankAccountId): void {
    const currentCount = this.usageCounts.get(accountId) || 0;
    this.usageCounts.set(accountId, currentCount + 1);
  }

  getPrioritizedAccountIds(): BankAccountId[] {
    return [...this.accountIds].sort((a, b) => {
      const usageA = this.usageCounts.get(a) || 0;
      const usageB = this.usageCounts.get(b) || 0;

      if (usageB !== usageA) {
        return usageB - usageA;
      }

      return this.accountIds.indexOf(a) - this.accountIds.indexOf(b);
    });
  }
}
