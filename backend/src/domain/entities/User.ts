

export enum UserRole {
  USER = 'USER',
  PM = 'PM',
  ADMIN = 'ADMIN'
}

export class User {
  constructor(
    public readonly id: string,
    private _name: string,
    private _email: string,
    private _passwordHash: string,
    private _role: UserRole
  ) {}

  get name(): string { return this._name; }
  get email(): string { return this._email; }
  get passwordHash(): string { return this._passwordHash; }
  get role(): UserRole { return this._role; }

  public updateProfile(name: string, email: string): void {
    if (name.length < 3) throw new Error("Name too short");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email format");
    
    this._name = name;
    this._email = email;
  }

  public promoteToPM(): void {
    if (this._role === UserRole.ADMIN) {
      throw new Error('Admins cannot be assigned the PM role directly.');
    }
    
    this._role = UserRole.PM;
  }

  static create(id: string, name: string, email: string, passwordHash: string): User {
    if (name.length < 3) throw new Error("Name too short");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email format");
    
    return new User(
      id,
      name,
      email,
      passwordHash,
      UserRole.USER
    );
  }
}
