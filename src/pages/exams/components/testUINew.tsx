import React, { useEffect, useState } from 'react';
import { Alert, Button, Divider, Modal, Spin, message } from "antd";
import { ArrowLeftRegular, ArrowRightRegular } from '@fluentui/react-icons';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import instance from 'config/_axios';
import { FILE_URL } from 'config/utils/index - Copy';
import { toHHmmss } from 'utils/others_functions';
import useGetOneData from 'hooks/useGetOneData';
import useFullScreenPage from 'hooks/useFullScreenPage';
import useBlockContextMenuAndF12 from 'hooks/useBlockContextMenuAndF12';

type TypeTestIUNew = {
  data: any;
  refetch: () => void;
};

const TestIUNew: React.FC<TypeTestIUNew> = ({ data, refetch }): JSX.Element => {

  const { id } = useParams();
  const navigate = useNavigate();
  useFullScreenPage()
  useBlockContextMenuAndF12()

  const { urlValue, writeToUrl } = useUrlQueryParams({});
  const [time, setTime] = useState<number>(0);
  const [tests, setTests] = useState<any>([]);

  const [isTabActive, setIsTabActive] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setIsTabActive(true); // Tab aktiv
      } else {
        setIsTabActive(false); // Tab noaktiv
      }
    };

    // Hodisani tinglash
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Tozalash
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);  

  const { data: timeData, isFetching, isError } = useGetOneData({
    queryKey: ["final-exam-test-starts/time", isTabActive],
    url: `final-exam-test-starts/time`,
    options: {
      enabled: isTabActive,
      staleTime: 0,
      refetchInterval: 10000,
    }
  });

  const refreshTime = (current_time:any) => {   
        
    const finish = (data?.finish_time ?? 0) - (current_time ?? 0);
    const _time = (data?.finish_time ?? 0) - (current_time ?? 0);
    // const _time = (data?.duration ?? 0) * 60 - ((current_time ?? 0) - (data?.start_time ?? 0));

    if ((data?.finish_time ?? 0) < (current_time ?? 0)) {
      setTime(0);
    } else {
      if (_time < finish)
        setTime(_time);
      else
        setTime(finish);
    }
  }

  useEffect(() => {
    if(isError){
      const cTime = Date.now() / 1000;
      if(data) {
        refreshTime(cTime)
      }
    }

    if(timeData?.data?.time) {
      if(!isFetching){
        
        const cTime = timeData?.data?.time;
        if(data) {
          refreshTime(cTime)
        }
      }
    }
  }, [isFetching, isTabActive, timeData?.data?.dateTime, data]);
  
  useEffect(() => {

    if(data){            
      setTests(data?.finalExamTestQuestion ?? []);
      refreshTime(data?.currect_time)

      if (!urlValue.filter_like?.test) {
        writeToUrl({ name: "test", value: 1 });
      }
      
      if (data?.status !== 1 && data?.status !== 2) {
        Modal.error({
          title: "Imtihon vaqti yakunlangan!!!",
          content: "Ortga qaytish uchun 'ok' tugmasini bosing",
          onOk: () => {
            if (!data?.user_status) finishTest();
            else navigate(`/exam-student/test/result/${id}`);
          }
        });
      }
  
      if (data && !data?.finalExamTestQuestion?.length) {
        Modal.error({
          title: "Testlar mavjud emas!!!",
          content: "Ortga qaytish uchun 'ok' tugmasini bosing",
          onOk: () => { navigate(`/exams/subject/vew/${data?.edu_semestr_subject_id}?tab=exam_control`) }
        });
      }
    }
  }, [data]);

  const checkAnswer = (answer_id: number, option_id: number) => {
    checkVariant({ option_id, answer_id });
  }

  useEffect(() => {    
    if (data && time > 0) {
      const interval = setInterval(() => {
        setTime(p => {
          if (p <= 0) {
            clearInterval(interval);
            Modal.warning({
              title: 'Test vaqti yakunlandi',
              content: "Ortga qaytish uchun 'ok' tugmasini bosing",
              onOk: () => { finishTest(); }
            });
            return 0;
          }
          return p - 1
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [data, tests]);

  const { mutate: checkVariant, isLoading: checkLoading } = useMutation({
    mutationFn: async ({ answer_id, option_id }: { answer_id: number, option_id: number }) => {
      const formdata = new FormData();

      formdata.append("option_id", option_id?.toString());

      const response = await instance({
        url: `/final-exam-test-starts/student-update/${answer_id}`,
        method: "PUT",
        data: formdata,
      });
      return response.data;
    },
    onSuccess: async (res) => {
      if (res?.status === 1) {        
        refreshTime(res?.data?.time)
        const newTests = tests?.map((i: any) => {
          if(i?.id == res?.data?.id){
            return ({...i, option_id: res?.data?.option_id})
          } else {
            return i
          }
        })

        setTests(newTests)

      } else {
        message.error(res?.data ? res?.data?.message : "")
      }
    },
    onError: (error: AxiosError<any>) => {
      message.error(error?.response?.data ? error?.response?.data?.message : "")
    },
    retry: 0,
  });

  const { mutate: finishTest, isLoading: finishLoading } = useMutation({
    mutationFn: async () => {
      const response = await instance({
        url: `/final-exam-test-starts/finish/${id}`,
        method: "PUT",
      });
      return response.data;
    },
    onSuccess: async (res) => {
      if (res?.status === 1) {
        navigate(`/exam-student/test/result/${id}`);
      } else {
        message.error(res?.data ? res?.data?.message : "")
      }
    },
    onError: (error: AxiosError<any>) => {
      message.error(error?.response?.data ? error?.response?.data?.message : "")
    },
    retry: 0,
  });

  return (
    <div 
      style={{userSelect: "none"}}
    >
      <Spin spinning={checkLoading}>
        <div className="flex max-md:flex-col gap-6 px-6 max-md:px-2">
          <div className="w-full max-w-[980px] mx-auto">
            <div className="min-h-[260px] bg-[#F7F7F7] rounded-lg border border-solid border-gray-200 p-4 my-2 mt-6 max-md:mt-2">
              {
                tests?.map((e: any, i: number) => i + 1 == Number(urlValue.filter_like.test) && (
                  <div className="test" key={i}>
                    <div className="flex max-md:flex-col gap-3">
                      <div className='w-1/2 max-md:w-full' dangerouslySetInnerHTML={{ __html: e?.test?.question?.text ?? "" }} />
                      {e?.test?.question?.file ? <>
                        <img src={FILE_URL + e?.test?.question?.file} alt='image' className='w-1/2 max-md:w-full rounded-lg' />
                      </> : null}
                    </div>
                    <Divider className='-ml-4 w-[calc(100%+32px)]' />
                    <div className="variants flex flex-col gap-4 my-4">
                      {
                        JSON.parse(e?.option)?.map((jsonItem: {id: number}, idx: number) => {

                          const currItem = e?.test?.options?.find((v: any) => (v?.id == jsonItem?.id));

                          return <div key={currItem?.id} className="flex gap-2" onClick={() => { e?.option_id != currItem?.id && checkAnswer(e?.id, currItem?.id) }} >
                            <div className={`h-[44px] w-[44px] flex-center rounded-lg border border-solid p-3 cursor-pointer ${e?.option_id == currItem?.id ? "bg-[#EAF0FD] text-[#3776E7] border-[#3775e750]" : "bg-[#fff] border-gray-200"}`}>{idx == 0 ? "A" : idx === 1 ? "B" : idx === 2 ? "C" : idx === 3 ? "D" : "E"}</div>
                            <div className={`w-full flex max-md:flex-col gap-3 rounded-lg border border-solid p-3 cursor-pointer ${e?.option_id == currItem?.id ? "bg-[#EAF0FD] text-[#3776E7] border-[#3775e750]" : "bg-[#fff] border-gray-200"} hover:border-[#3776E760]`}>
                              <div className='w-3/5 max-md:w-full' dangerouslySetInnerHTML={{ __html: currItem?.text ?? "" }} />
                              {currItem?.file ? <>
                                <img src={FILE_URL + currItem?.file} alt='image' className='w-2/5 max-md:w-full' />
                              </> : null}
                            </div>
                          </div>
                        })
                      }
                      {/* {
                        e?.test?.options?.map((v: any, idx: number) => (
                          <div key={idx} className="flex gap-2" onClick={() => { e?.option_id != v?.id && checkAnswer(e?.id, v?.id) }} >
                            <div className={`h-[44px] w-[44px] flex-center rounded-lg border border-solid p-3 cursor-pointer ${e?.option_id == v?.id ? "bg-[#EAF0FD] text-[#3776E7] border-[#3775e750]" : "bg-[#fff] border-gray-200"}`}>{idx == 0 ? "A" : idx === 1 ? "B" : idx === 2 ? "C" : idx === 3 ? "D" : "E"}</div>
                            <div className={`w-full flex max-md:flex-col gap-3 rounded-lg border border-solid p-3 cursor-pointer ${e?.option_id == v?.id ? "bg-[#EAF0FD] text-[#3776E7] border-[#3775e750]" : "bg-[#fff] border-gray-200"} hover:border-[#3776E760]`}>
                              <div className='w-3/5 max-md:w-full' dangerouslySetInnerHTML={{ __html: v?.text ?? "" }} />
                              {v?.file ? <>
                                <img src={FILE_URL + v?.file} alt='image' className='w-2/5 max-md:w-full rounded-lg' />
                              </> : null}
                            </div>
                          </div>
                        ))
                      } */}
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="flex-center my-5">
              <Button type='primary' ghost className='me-3' disabled={1 === Number(urlValue.filter_like?.test)} onClick={() => { writeToUrl({ name: "test", value: Number(urlValue.filter_like?.test) - 1 }) }} ><div className="d-f"><ArrowLeftRegular className='me-5' /> {("Back")}</div></Button>
              <Button type='primary' disabled={tests?.length <= Number(urlValue.filter_like?.test)} onClick={() => { writeToUrl({ name: "test", value: Number(urlValue.filter_like?.test) + 1 }) }} ><div className="d-f" >{("Next")} <ArrowRightRegular className='ms-5' /></div></Button>
            </div>
          </div>
          <div className="w-96 max-md:w-full h-max min-h-[320px] flex flex-col justify-between gap-4 sticky top-5 bg-[#F7F7F7] rounded-lg border border-solid border-gray-200 shadow-md- p-3 my-6">
            <div>
              <h2 className='text-center text-3xl my-5 mt-3' >{toHHmmss(time)}</h2>
              <div className="flex flex-wrap gap-2 mt-4">
                {
                  tests?.map((e: any, i: number) => (
                    <div key={i} onClick={() => { writeToUrl({ name: "test", value: i + 1 }) }} className={`h-[36px] w-[36px] flex-center rounded-lg border border-solid cursor-pointer ${Number(urlValue.filter_like?.test) === i + 1 ? (e?.option_id ? "text-[#3776E7] bg-[#EAF0FD]" : "text-[#3776E7] bg-white") : e?.option_id ? "bg-[#EAF0FD] text-[#3776E7] border-[#3775e750]" : "bg-white border-gray-200"} hover:border-[#3776E7]`}>{i + 1}</div>
                  ))
                }
              </div>
            </div>
            <div className='text-center' >
              <Button type='primary' danger onClick={() => {
                Modal.confirm({
                  title: 'Testni yakunlash',
                  content: <div>
                    { 
                      time > 180 ? tests?.filter((e: any) => !e?.option_id)?.length ? 
                        <Alert description="Testni yakunlash uchun testlar to'liq belgilangan bo'lishi kerak!" type='warning' /> 
                          : null : ""
                    }
                    <span> Testni yakunlamoqchimisiz? </span>
                  </div>,
                  okText: "Yakunlash",
                  okButtonProps: {loading: finishLoading, disabled: time < 180 ? false : tests?.filter((e: any) => e?.option_id)?.length !== tests?.length},
                  cancelText: "Testga qaytish",
                  onOk: () => { finishTest() },
                });
              }} className='w-full max-w-[320px]' >{("Testni yakunlash")}</Button>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default TestIUNew;