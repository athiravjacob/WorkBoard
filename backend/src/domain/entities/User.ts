export enum UserRole {
  ADMIN = 'ADMIN',
  PM = 'PM',
  USER = 'USER'
}

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public emailid: string,
    public passwordHash: string,
    public role: UserRole
  ) {}

  public promoteToPM(): void {
    if (this.role === UserRole.ADMIN) {
      throw new Error('Admins cannot be assigned the PM role directly.');
    }
    
    this.role = UserRole.PM;
  }

  static create(id: string, name: string, emailid: string, passwordHash: string): User {
    if (name.length < 3) throw new Error("Name too short");
    
    return new User(
      id,
      name,
      emailid,
      passwordHash,
      UserRole.USER
    );
  }
}
