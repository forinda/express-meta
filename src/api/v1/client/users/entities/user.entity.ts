export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDto extends Omit<User, 'id' | 'created_at' | 'updated_at'> {}
export interface UpdateUserDto extends Partial<CreateUserDto> {} 