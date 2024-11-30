import { TypeRoutes } from "./types";
import Dashboard from "pages/dashboards";
import Login from "pages/login";
import { Home20Regular, CalendarLtr20Regular, CalendarRtl20Regular, CalendarCheckmark20Regular, Book20Regular, Document20Regular, Apps20Regular, PersonCircle20Regular, TextBulletListSquareEdit20Regular } from '@fluentui/react-icons';
import Attendance from "pages/attendance";
import TimeTable from "pages/time-table";
import Exams from "pages/exams";
import Documents from "pages/documents";
import InteractiveServices from "pages/interactive_services";
import Subject from "pages/subject";
import MyInformation from "pages/my_information";
import SubjectView from "pages/subject/pages/subject_view";
import SubjectContent from "pages/subject/pages/subject_content";
import TestForTopic from "pages/subject/pages/topic_test";
import Balls from "pages/balls";
import ExamStudent from "pages/exams/final_exam/exam_student";
import TestResultPage from "pages/exams/components/test_result";
import ExamSubjectView from "pages/exams/components/exam_subject_vew";
import ExamControlStudent from "pages/exams/exam_controls/exam_student";

export const public_routes: Array<TypeRoutes> = [
  {
    name: "Login",
    path: "/",
    component: Login,
    config: {
      permission: "*",
      icon: CalendarLtr20Regular,
      structure: "layout",
      isMenu: false,
    },
    submenu: [],
  },
];

export const prived_routes: Array<TypeRoutes> = [
  {
    name: "Dashboard",
    path: "/",
    component: Dashboard,
    config: {
      permission: "*",
      icon: Home20Regular,
      structure: "layout",
      isMenu: true,
    },
    submenu: [],
  },
  {
    name: "Attendance",
    path: "/attendance",
    component: Attendance,
    config: {
      permission: "student-attend_index",
      icon: CalendarCheckmark20Regular,
      structure: "layout",
      isMenu: true,
    },
    submenu: [],
  },
  {
    name: "Subjects",
    path: "/subjects",
    component: Subject,
    config: {
      permission: "edu-semestr_index",
      icon: Book20Regular,
      structure: "layout",
      isMenu: true,
    },
    submenu: [],
  },
  {
    name: "Subject view",
    path: "/subjects/:id",
    component: SubjectView,
    config: {
      permission: "subject_view",
      icon: Book20Regular,
      structure: "layout",
      isMenu: false,
    },
    submenu: [],
  },
  {
    name: "Subject content",
    path: "/subjects/:id/topics/:topic_id",
    component: SubjectContent,
    config: {
      permission: "subject-content_index",
      icon: Book20Regular,
      structure: "layout",
      isMenu: false,
    },
    submenu: [],
  },
  {
    name: "Balls",
    path: "/balls",
    component: Balls,
    config: {
      permission: "edu-semestr_index",
      icon: Book20Regular,
      structure: "layout",
      isMenu: true,
    },
    submenu: [],
  },
  {
    name: "Topic test",
    path: "/subjects/:id/topics/:topic_id/test",
    component: TestForTopic,
    config: {
      permission: "test_index",
      icon: Book20Regular,
      structure: "layout",
      isMenu: false,
    },
    submenu: [],
  },
  {
    name: "Time table",
    path: "/time-table",
    component: TimeTable,
    config: {
      permission: "time-table_index",
      icon: CalendarRtl20Regular,
      structure: "layout",
      isMenu: true,
    },
    submenu: [],
  },


  // exams 
  {
    name: "Exams",
    path: "/exams",
    component: Exams,
    config: {
      permission: "*",
      icon: TextBulletListSquareEdit20Regular,
      structure: "layout",
      isMenu: true,
    },
    submenu: [],
  },

  {
    name: "Exams subject view",
    path: "/exams/subject/vew/:edu_subject_id",
    component: ExamSubjectView,
    config: {
      permission: "*",
      icon: TextBulletListSquareEdit20Regular,
      structure: "layout",
      isMenu: false,
    },
    submenu: [],
  },

  // exam control 
  {
    name: "Exam student",
    path: "/exam-contol-student/:id",
    component: ExamControlStudent,
    config: {
      permission: "exam-student_view",
      icon: TextBulletListSquareEdit20Regular,
      structure: "layout",
      isMenu: false,
    },
    submenu: [],
  },

  // exam 
  {
    name: "Exam student",
    path: "/exam-student/:id",
    component: ExamStudent,
    config: {
      permission: "exam-student_view",
      icon: TextBulletListSquareEdit20Regular,
      structure: "layout",
      isMenu: false,
    },
    submenu: [],
  },


  {
    name: "Test result",
    path: "/exam-student/test/result/:id",
    component: TestResultPage,
    config: {
      permission: "exam-student_view",
      icon: TextBulletListSquareEdit20Regular,
      structure: "layout",
      isMenu: false,
    },
    submenu: [],
  },


  {
    name: "Documents",
    path: "/documents",
    component: Documents,
    config: {
      permission: "*",
      icon: Document20Regular,
      structure: "layout",
      isMenu: true,
    },
    submenu: [],
  },
  {
    name: "My information",
    path: "/my-information",
    component: MyInformation,
    config: {
      permission: "*",
      icon: PersonCircle20Regular,
      structure: "layout",
      isMenu: true,
    },
    submenu: [],
  },
  {
    name: "Interactive services",
    path: "/interactive-services",
    component: InteractiveServices,
    config: {
      permission: "*",
      icon: Apps20Regular,
      structure: "layout",
      isMenu: true,
    },
    submenu: [],
  },

];
