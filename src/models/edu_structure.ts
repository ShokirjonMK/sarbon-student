import { IBasic } from "./base";


export interface IDepartment extends IBasic {
  id: number;
  parent_id: number;
  name: string;
  status: number;
  parent: any
  type: number
  description?: string | number;
  types?: {id: number, name: string};
  leader?: any
}

export interface IKafedra extends IBasic {
  id: number;
  faculty_id: number;
  direction_id: number;
  name: string;
  description: string;
  status: number;
  leader?: any,
  faculty: any,
  direction: any,
}

export interface IFaculty extends IBasic {
  id: number,
  user_id: number,
  name: string,
  description: string,
  status: number,
  leader: any,
}

export interface IEmployee extends IBasic {
  id: number,
  user_id: number,
  role_name: string,
  jobTitle: string,
  workRate: string | number,
  table_id: number,
  is_leader: number,
  user: any,
}