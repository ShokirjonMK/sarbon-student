import { IBasic } from "./base";
import { IKafedra } from "./edu_structure";
import { IEduForm, IEduType, ISemestr } from "./education";
import { ISimple } from "./other";

export interface ISubject extends IBasic {
  id: number;
  name: string;
  course: number;
  description?: string;
  kafedra_id: number;
  semestr_id: number;
  edu_form_id: number;
  edu_type_id: number;
  parent_id: number | null;
  type: number;
  status: number;
  credit: number | null;
  edu_semestr_exams_types: string | null;
  edu_semestr_subject_category_times: string | null;
  parent?: ISubject;
  semestr?: ISemestr;
  kafedra?: IKafedra;
  eduType?: IEduType;
  eduForm?: IEduForm;
  topics?: ITopic[];
}

export interface ITopic extends IBasic {
  description?: string | null;
  hours: number | null;
  id: number;
  lang_id: number;
  name: string;
  order: number;
  status: number;
  subject_category_id: number;
  subject_id: number;
  teacher_access_id: number | null;
  duration_reading_time: number | null;
  isPermission: {
    id: number;
    attempts_count: number | null;
    status: number;
    student_id: number;
    topic_id: number;
    user_id: number;
  } | null;
  isRead: number;
  min_percentage: number | null;
  test_count: number;
  attempts_count: number | null;
  allotted_time: number | null;
  subjectCategory?: ISubjectCategory;
  content: ISubjectContent[];
  parent?: ITopic
}

export interface ISubjectCategory extends IBasic {
  id: number;
  name: string;
  status: number;
}

export interface IExamType extends IBasic {
  id: number;
  name: string;
  status: number;
}

export interface ISubjectTopic extends IBasic {
  id: number;
  name: string;
  description: string;
  hours: number;
  teacher_access_id: number;
  subject_id: number;
  lang_id: number;
  subject_category_id: number;
  teacherAccess: any;
  subject: any;
  subjectCategory: any;
  lang: any;
  status: number;
  order: number;
}

export interface ISubjectContent extends IBasic {
  id: number;
  text: string | null;
  description: string | null;
  file: string | null;
  subject_topic_id: number;
  file_extension: string;
  lang_id: number;
  type: number;
  status: number;
  order: number;
  types?: ISubjectContentTypes;
}

export interface ISubjectContentTypes {
  type: ContentType;
  id: number;
  size: number;
  extension: string;
}

export type ContentType = "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" | "FILE";
