import React, { useState } from 'react';
import { Modal, Spin } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import useGetOneData from 'hooks/useGetOneData';
import { IExamStudent } from 'models/exam';
import { useNavigate, useParams } from 'react-router-dom';
import TestIUNew from '../components/testUINew';

const ExamStudent: React.FC = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [_data, setData] = useState<IExamStudent>()

  const { data, isFetching, refetch } = useGetOneData({
    queryKey: ["final-exam-test-starts", id],
    url: `/final-exam-test-starts/${id}?expand=finalExamTestQuestion,finalExamTestQuestion.test,finalExamTest.finalExam.subject,eduSemestrSubject.subject`,
    options: {
      onSuccess: (res) => {
        setData(res.data);
      },
      onError: (error: any) => {
        Modal.error({
          title: "Malumot olishda xatolik!!!",
          content: error?.response?.data?.status === 2 ? "Sizning qurilmangizga ruxsat berilmagan. Iltimos imtihon uchun belgilangan universitet kompyuteridan foydalaning!" : "Ortga qaytish uchun 'ok' tugmasini bosing",
          onOk: () => {
            navigate(`/exams`);
          }
        });
      },
      enabled: !!id,
    }
  });

  return (
    <div className="">
      <HeaderExtraLayout
        title={data?.data?.exam?.name ?? "Yakuniy imtihon"}
        isBack
        backUrl={`/exams/subject/vew/${data?.data?.edu_semestr_subject_id}?tab=finaly-exam`}
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Exams", path: `/exams/subject/vew/${data?.data?.edu_semestr_subject_id}?tab=finaly-exam` },
          { name: "Yakuniy imtihon", path: "exam-student" }
        ]}
      />
      <Spin spinning={isFetching}>
        <TestIUNew data={data?.data} refetch={refetch} />
      </Spin>
    </div>
  );
};

export default ExamStudent;

/**
  * exam-student_index
  * exam-student_delete
  * exam-student_update
  * exam-student_view
*/