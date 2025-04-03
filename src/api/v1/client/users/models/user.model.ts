import { baseEntity, baseModel } from '@/api/v1/client/shared/models/base.model';

export interface userModel extends baseModel {
  name: string;
  email: string;
  age?: number;
  last_login_at?: string;
}

export class user extends baseEntity implements userModel {
  name: string;
  email: string;
  age?: number;
  last_login_at?: string;
  updated_at: string;

  constructor(data: Partial<userModel>) {
    super(data);
    this.name = data.name || '';
    this.email = data.email || '';
    this.age = data.age;
    this.last_login_at = data.last_login_at;
    this.updated_at = data.updated_at || new Date().toISOString();
  }

  toJSON(): userModel {
    return {
      ...super.toJSON(),
      name: this.name,
      email: this.email,
      age: this.age,
      last_login_at: this.last_login_at,
      updated_at: this.updated_at
    };
  }

  update(data: Partial<userModel>): void {
    if (data.name) this.name = data.name;
    if (data.email) this.email = data.email;
    if (data.age !== undefined) this.age = data.age;
    if (data.last_login_at) this.last_login_at = data.last_login_at;
    this.updated_at = new Date().toISOString();
  }
} 