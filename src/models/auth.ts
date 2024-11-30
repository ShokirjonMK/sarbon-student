import { IEduForm } from "./education"
import { IProfile } from "./user"
  
export interface IAuth {
  edu_form: IEduForm
  access_token: string,
  expire_time: string,
  first_name: string,
  last_name: string,
  oferta: number
  is_changed: number
  permissions: string[],
  role: string[],
  user_id: number,
  username: string,
  profile?: IProfile
}