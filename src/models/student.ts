import { ILanguage } from "components/Structure/header/components/Languages/types";
import { IBasic } from "./base";
import { IFaculty } from "./edu_structure";
import { ICourse, IGroup, IPara } from "./education";
import { IProfile, IUserField } from "./user";
import { ISimple } from "./other";
import { ISubject, ISubjectCategory } from "./subject";

export interface IStudent extends IBasic {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  username: string;
  avatar: string;
  categoryOfCohabitant?: any;
  category_of_cohabitant_id: number | null;
  course_id: number | null;
  description: string | null;
  diplom_date: string | null;
  diplom_number: string | null;
  diplom_seria: string | null;
  direction_id: number | null;
  eduForm : any,
  edu_form_id: number | null;
  edu_lang_id: number | null;
  edu_plan_id: number | null;
  eduType: any;
  edu_type_id: number | null;
  edu_year_id: number | null;
  faculty_id: number | null;
  is_contract: number;
  tutor_id: number;
  last_education: string | null;
  live_location: string | null;
  parent_phone: string | null;
  partners_count: null | string;
  res_person_phone: null | string;
  residence_status_id: number | null;
  studentSubjectRestrict: any;
  social_category_id: number | null;
  user_id: number;
  student_category_id: number | null;
  studentAttendsCount?: number;
  group_id: number | null;
  edu_language_id: number | null;
  form_of_payment_id: number | null;
  status: number;
  user: IUserField;
  profile?: IProfile;
  studentCategory?: any;
  country?: ISimple;
  region?: ISimple;
  area?: ISimple;
  permanentCountry?: ISimple;
  permanentRegion?: ISimple;
  permanentArea?: ISimple;
  socialCategory?: ISimple;
  course?: ICourse;
  faculty?: IFaculty;
  group?: IGroup;
  tutor?: any;
  eduLang?: ILanguage;
  nationality?: ISimple;
  direction?: ISimple;
  citizenship?: ISimple;
  type? : number,
  // studentAttends?: IStudentAttend[],
  // eduPlan?: IEducationPlan
  // eduType?: IEducationType
  // eduForm?: IEducationForm
  // eduYear?: IEducationYear
  // attends?: IStudentAttend[]
}

export interface IAttend extends IBasic {
  date: string;
  edu_plan_id: number;
  edu_semestr_id: number;
  edu_year_id: number;
  faculty_id: number;
  id: number;
  reason: number;
  order: number;
  status: number;
  student_ids: number[];
  subject_category_id: number;
  subject_id: number;
  time_table_id: number;
  type: number;
  timeTable?: ISimple;
  subject?: ISubject;
  subjectCategory?: ISubjectCategory;
  timeTableDate?: any
  para?: IPara
}
