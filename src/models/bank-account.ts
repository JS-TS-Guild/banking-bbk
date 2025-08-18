export default class BankAccount {
  private id: string = "1";
  constructor(amount: number) {}

  create(amount: number) {
    return new BankAccount(amount);
  }

  getId() {
    return this.id;
  }
}
