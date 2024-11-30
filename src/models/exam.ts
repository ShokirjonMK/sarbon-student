import { updateSpreadAssignment } from "typescript";
import { IBasic } from "./base";

export interface IExam extends IBasic {
  id: number;
  name: string;
  description: string;
  status: number;
}

export interface IExamControl extends IBasic {
  id: number;
  course_id: number;
  direction_id: number;
  duration: number;
  edu_plan_id: number;
  edu_semestr_exam_type_id: number;
  edu_semestr_id: number;
  edu_semestr_subject_id: number;
  edu_year_id: number;
  exam_type_id: number;
  faculty_id: number;
  file: string | null;
  finish_time: number;
  group_id: number;
  language_id: number;
  max_ball: number;
  name: string;
  order: number;
  question: string | null;
  question_count: number | null;
  semestr_id: number;
  start_time: number;
  status: number;
  subject_category_id: number;
  type: number;
  user_id: number;
  examControlStudents?: IExamControlStudent[];
  examTimes?: {
    start: number | null;
    finish: number | null;
    current: number;
  };
}

export interface IExamControlStudent extends IBasic {
  id: number;
  course_id: number;
  direction_id: number;
  duration: number;
  edu_plan_id: number;
  edu_semestr_exam_type_id: number;
  edu_semestr_id: number;
  edu_semestr_subject_id: number;
  edu_year_id: number;
  exam_type_id: number;
  faculty_id: number;
  answer_text: string | null;
  answer_file: string | null;
  finish_time: number;
  group_id: number;
  language_id: number;
  max_ball: number;
  name: string;
  order: number;
  question: string | null;
  semestr_id: number;
  start_time: number;
  status: number;
  subject_category_id: number;
  type: number;
  user_id: number;
  user_status: number;
  fileInformation?: {
    extension: string;
    size: number;
  };
  studentTimes?: {
    start: number | null;
    finish: number | null;
    current: number;
  };
  examControl?: IExamControl;
  examControlTest?: IExamControlTest[];
}

export interface IExamControlTest {
  exam_control_student_id: number;
  exam_test_id: number;
  id: number;
  status: number;
  subject_id: number;
  user_id: number;
  options: string | null;
  exam_test_option_id: number | null;
  isCorrect?: number;
  test: {
    file: string | null;
    id: number;
    status: number;
    text: string | null;
    options: {
      created_at: number;
      created_by: number;
      file: string | null;
      id: number;
      is_correct: number;
      order: number;
      question_id: number;
      status: number;
      text: string | null;
      updated_at: number;
      updated_by: number;
    }[];
  };
}

export interface IExam extends IBasic {
  id: number;
  course_id: number;
  direction_id: number;
  duration: number;
  edu_plan_id: number;
  edu_semestr_exam_type_id: number;
  edu_semestr_id: number;
  edu_semestr_subject_id: number;
  edu_year_id: number;
  exam_type_id: number;
  faculty_id: number;
  file: string | null;
  finish_time: number;
  group_id: number;
  language_id: number;
  max_ball: number;
  name: string;
  order: number;
  question: string | null;
  question_count: number | null;
  semestr_id: number;
  start_time: number;
  status: number;
  subject_category_id: number;
  type: number;
  user_id: number;
  studentMark?: 0 | 1
  examStudents?: IExamControlStudent[];
  examTimes?: {
    start: number | null;
    finish: number | null;
    current: number;
  };
}

export interface IExamStudent extends IBasic {
  id: number;
  course_id: number;
  direction_id: number;
  duration: number;
  edu_plan_id: number;
  edu_semestr_exam_type_id: number;
  edu_semestr_id: number;
  edu_semestr_subject_id: number;
  edu_year_id: number;
  exam_type_id: number;
  faculty_id: number;
  answer_text: string | null;
  answer_file: string | null;
  finish_time: number;
  group_id: number;
  language_id: number;
  max_ball: number;
  name: string;
  order: number;
  question: string | null;
  semestr_id: number;
  start_time: number;
  status: number;
  subject_category_id: number;
  type: number;
  user_id: number;
  user_status: number;
  student_ball: number | null
  fileInformation?: {
    extension: string;
    size: number;
  };
  studentTimes?: {
    start: number | null;
    finish: number | null;
    current: number;
  };
  exam?: IExam;
  examStudentQuestion?: IExamQuestion[];
}

export interface IExamQuestion {
  exam_control_student_id: number;
  exam_test_id: number;
  id: number;
  status: number;
  subject_id: number;
  student_ball: number | null
  desctiption: string | null
  user_id: number;
  options: string | null;
  isCorrect?: number;
  question: {
    file: string | null;
    id: number;
    status: number;
    student_option: number | null;
    text: string | null;
    answer_file: null | string;
    answer_text: string | null;
    option: {
      created_at: number;
      created_by: number;
      file: string | null;
      id: number;
      is_correct: number;
      order: number;
      question_id: number;
      status: number;
      text: string | null;
      updated_at: number;
      updated_by: number;
    }[];
  };
}
