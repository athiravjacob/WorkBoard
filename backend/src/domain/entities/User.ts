export enum UserRole {
  ADMIN = 'ADMIN',
  PM = 'PM',
  USER = 'USER'
}

export class User {
  constructor(
    public readonly id: string,
    public username: string,
    public passwordHash: string,
    public role: UserRole
  ) {}

  public promoteToPM(): void {
    if (this.role === UserRole.ADMIN) {
      throw new Error('Admins cannot be assigned the PM role directly.');
    }
    
    this.role = UserRole.PM;
  }

  static create(id: string, username: string, passwordHash: string): User {
    if (username.length < 3) throw new Error("Username too short");
    
    return new User(
      id,
      username,
      passwordHash,
      UserRole.USER
    );
  }
}
