import React, { useState } from 'react';
import { Modal, Spin } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import useGetOneData from 'hooks/useGetOneData';
import { IExamStudent } from 'models/exam';
import { useNavigate, useParams } from 'react-router-dom';
import TestIUNew from '../components/testUINew';

const ExamControlStudent: React.FC = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [_data, setData] = useState<IExamStudent>()

  const { data, isFetching, refetch } = useGetOneData({
    queryKey: ["final-exam-test-starts", id],
    url: `/final-exam-test-starts/${id}?expand=finalExamTestQuestion,finalExamTestQuestion.test`,
    options: {
      onSuccess: (res) => {
        setData(res.data);
      },
      onError: () => {
        Modal.error({
          title: "Malumot olishda xatolik!!!",
          content: "Ortga qaytish uchun 'ok' tugmasini bosing",
          onOk: () => {
            navigate(`/exams/subject/vew/${data?.data?.edu_semestr_subject_id}?tab=exam_control`);
          }
        });
      },
      enabled: !!id,
    }
  });

  return (
    <div className="">
      <HeaderExtraLayout
        title={data?.data?.exam?.name ?? "Oraliq nazorat"}
        isBack
        backUrl={`/exams?tab=exam_control`}
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Exams", path: `/exams/subject/vew/${data?.data?.edu_semestr_subject_id}?tab=exam_control` },
          { name: "Oraliq nazorat", path: "exam-student" }
        ]}
      />
      <Spin spinning={isFetching}>
        <TestIUNew data={data?.data} refetch={refetch} />
      </Spin>
    </div>
  );
};

export default ExamControlStudent;

/**
  * exam-student_index
  * exam-student_delete
  * exam-student_update
  * exam-student_view
*/