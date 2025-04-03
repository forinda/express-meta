export interface baseModel {
  id: string;
  created_at: string;
  updated_at: string;
}

export class baseEntity implements baseModel {
  id: string;
  created_at: string;
  updated_at: string;

  constructor(data: Partial<baseModel>) {
    this.id = data.id || crypto.randomUUID();
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || this.created_at;
  }

  toJSON(): baseModel {
    return {
      id: this.id,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
} 