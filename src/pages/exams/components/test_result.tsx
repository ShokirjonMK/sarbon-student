import React, { useState } from 'react';
import { Spin } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import useGetOneData from 'hooks/useGetOneData';
import { IExamStudent } from 'models/exam';
import { Link, useParams } from 'react-router-dom';
import { Result } from 'antd';

const TestResultPage: React.FC = (): JSX.Element => {
  
  const { id } = useParams();
  const [_data, setData] = useState<IExamStudent>()

  const { data, isFetching } = useGetOneData({
    queryKey: ["final-exam-test-starts", id],
    url: `/final-exam-test-starts/${id}`,
    urlParams: {
      expand: "studentMark"
    },
    options: {
      onSuccess: (res) => {
        setData(res.data);
      },
      enabled: !!id,
    }
  });

  return (
    <div className="">
      <HeaderExtraLayout
        title={data?.data?.exam?.name ?? "Exams"}
        isBack
        backUrl={`/exams`}
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Exams", path: `/exams` },
          { name: "Exams", path: "exam-student" }
        ]}
      />
      <Spin spinning={isFetching}>
        <Result
          status="success"
          title="Imtihonni yakunladingiz!"
          extra={[
            <h3>Maksimal bal: {data?.data?.studentMark?.max_ball}</h3>,
            <h3 className='my-1'>To'plagan balingiz: {data?.data?.ball}</h3>,
            <h3>Imtihon davomiyligi: {data?.data?.duration} minut</h3>,
            <Link to={`/exams/subject/vew/${data?.data?.edu_semestr_subject_id}?tab=${data?.data?.studentMark?.exam_type_id === 3 ? "finaly-exam" : "exam_control"}`} className='mt-5 block text-[18px]'>Imtihonlar ro'yxatiga qaytish</Link>
          ]}
        />
      </Spin>
    </div>
  );
};

export default TestResultPage;

/**
  * exam-student_index
  * exam-student_delete
  * exam-student_update
  * exam-student_view
*/