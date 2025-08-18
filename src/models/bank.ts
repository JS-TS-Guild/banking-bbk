import BankAccount from "./bank-account";

export default class Bank {
  private id: string = "1";
  construcutor() {}

  static create() {
    return new Bank();
  }

  createAccount(amount: number) {
    return new BankAccount(amount);
  }

  getId() {
    return this.id;
  }
}
