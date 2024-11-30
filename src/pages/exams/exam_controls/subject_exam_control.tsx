import { useMutation } from '@tanstack/react-query';
import { Button, Empty, Modal, Spin, Tabs, message } from 'antd';
import { AxiosError } from 'axios';
import instance from 'config/_axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TabsProps } from 'antd';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import ExamCard from '../components/exam_card';

const SubjectExamControl: React.FC<{semestrSubject:any, semestrSubjectFetching: boolean}> = ({semestrSubject, semestrSubjectFetching}): JSX.Element => {

  const navigate = useNavigate()
  const { urlValue } = useUrlQueryParams({});
  const [selectedTestStart, setselectedTestStart] = useState<any>();

  const { mutate: startTest, isLoading: startLoading } = useMutation({
    mutationFn: async (id: number | null) => {
      const response = await instance({
        url: `/final-exam-test-starts/${id}`,
        method: "GET",
      });
      return response.data;
    },
    onSuccess: async (res) => {
      if (res?.status === 1) {
        setselectedTestStart(undefined)
        navigate(`/exam-contol-student/${res?.data?.id}`)
      } else {
        message.error(res?.data ? res?.data?.message : "")
      }
    },
    onError: (error: AxiosError<any>) => {
      message.error(error?.response?.data ? error?.response?.data?.message : "")
    },
    retry: 0,
  });

  const items2: TabsProps['items'] = semestrSubject?.data?.finalExamStudent?.filter((i: any) => i?.exams_type_id === 1)?.map((item: any, index: number) => ({
    key: `${index + 1}`,
    label: [
      {id: 1, name: "1 shakl"},
      {id: 2, name: "1 A shakl"},
      {id: 3, name: "1 b shakl"},
    ]?.find((i) => i.id === item?.vedomst)?.name,
    children: item?.finalExamTestStudent?.status === 1 ? <div className='grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5'>
      {
        item?.finalExamTestStudent?.finalExamTestStart?.map((testStart: any, i: number) => (  
          <ExamCard index={i} testStart={testStart} item={item} setselectedTestStart={setselectedTestStart} url={'exam-contol-student'} />
        ))
      }
    </div> : <div></div>
  }));
  

  return (
    <Spin spinning={semestrSubjectFetching}>
      <div className="px-6 max-md:p-2 py-5">

      <Tabs defaultActiveKey="1" items={items2} onChange={() => {}} />

      {
        items2?.length === 0 ? <Empty description="Imtihon mavjud emas!" /> : ""
      }

      <Modal 
        title="Testni boshlash" 
        open={!!selectedTestStart} 
        footer={false}
        onCancel={() => setselectedTestStart(undefined)}
      >
        <div className="flex gap-5">
          <div>
            <p className='font-bold text-[16px]'>Imtihon davomiyligi:</p>
            <p className='font-bold text-[16px]'>Savollar soni:</p>
          </div>
          <div>
            <p className='font-bold text-[16px]'>{selectedTestStart?.duration} minut</p>
            <p className='font-bold text-[16px]'>{selectedTestStart?.question_count} ta</p>
          </div>
        </div>
        <p className='font-bold text-[16px]'>Omad!</p>

        <div className='flex justify-end gap-3 mt-5'>
          <Button onClick={() => setselectedTestStart(undefined)}>Yopish</Button>
          <Button onClick={() => startTest(selectedTestStart?.id)} loading={startLoading} type='primary'>Boshlash</Button>
        </div>
      </Modal>
      </div>
    </Spin>
  );
};

export default SubjectExamControl;