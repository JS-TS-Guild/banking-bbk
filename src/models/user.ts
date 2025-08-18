export default class User {
  constructor(name: string, options: any[]) {}

  static create(name: string, options: any[]) {
    return new User(name, options);
  }
}
