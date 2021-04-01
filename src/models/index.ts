export interface User {
  id?: number;
  name: string;
  distance: number;
  hours: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface BoardingPass {
  id?: number;
  user_id: number;
  status: string;
  invite_code: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ArrivedUser {
  name: string;
  distance: number;
  hours: number;
  boarding_pass_updated_at?: Date;
}
