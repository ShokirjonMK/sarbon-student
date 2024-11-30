import useUrlQueryParams from "hooks/useUrlQueryParams";
import HeaderUserView from "pages/users/components/vewHeader";
import { useTranslation } from "react-i18next";
import SubjectExamControl from "../exam_controls/subject_exam_control";
import SubjectExam from "../final_exam/subject_exam";
import { useParams } from "react-router-dom";
import useGetOneData from "hooks/useGetOneData";

const ExamSubjectView = () => {

    const { t } = useTranslation();
    const { urlValue } = useUrlQueryParams({});
    const { edu_subject_id } = useParams()    

    const { data: semestrSubject, isFetching: semestrSubjectFetching } = useGetOneData({
        queryKey: ["edu-semestr-subjects", edu_subject_id],
        url: `edu-semestr-subjects/${edu_subject_id}?expand=subject,finalExamStudent,finalExamStudent.building,finalExamStudent.room,finalExamStudent.finalExamTestStudent.finalExamTestStart`,
        options: {
          enabled: !!edu_subject_id,
        }
    });
      
    return (
        <>
            <HeaderUserView
                title={urlValue.filter_like?.tab === "finaly-exam" ? "Yakuniy nazorat" : "Oraliq nazorat"}
                breadCrumbData={[
                    {
                        name: "Home",
                        path: "/",
                    },
                    {
                        name: "Exams",
                        path: "/exams",
                    },
                    {
                        name: semestrSubject?.data?.subject?.name,
                        path: "/exams",
                    },
                ]}
                tabs={[
                {
                    key: "exam_control",
                    label: t("Exam control"),
                    children: <SubjectExamControl semestrSubject={semestrSubject} semestrSubjectFetching={semestrSubjectFetching} />,
                },
                {
                    key: "finaly-exam",
                    label: t("Finally exam"),
                    children: <SubjectExam semestrSubject={semestrSubject} semestrSubjectFetching={semestrSubjectFetching} />,
                },
                ]}
            />
        </>
    );
};
export default ExamSubjectView;