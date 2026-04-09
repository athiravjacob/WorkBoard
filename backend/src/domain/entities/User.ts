export enum UserRole {
  ADMIN = 'ADMIN',
  PM = 'PM',
  USER = 'USER'
}

export class User {
  constructor(
    public readonly id: string,
    private _name: string,
    private _emailid: string,
    private _passwordHash: string,
    private _role: UserRole
  ) {}

  get name(): string { return this._name; }
  get emailid(): string { return this._emailid; }
  get passwordHash(): string { return this._passwordHash; }
  get role(): UserRole { return this._role; }

  public updateProfile(name: string, emailid: string): void {
    if (name.length < 3) throw new Error("Name too short");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailid)) throw new Error("Invalid email format");
    
    this._name = name;
    this._emailid = emailid;
  }

  public promoteToPM(): void {
    if (this._role === UserRole.ADMIN) {
      throw new Error('Admins cannot be assigned the PM role directly.');
    }
    
    this._role = UserRole.PM;
  }

  static create(id: string, name: string, emailid: string, passwordHash: string): User {
    if (name.length < 3) throw new Error("Name too short");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailid)) throw new Error("Invalid email format");
    
    return new User(
      id,
      name,
      emailid,
      passwordHash,
      UserRole.USER
    );
  }
}
