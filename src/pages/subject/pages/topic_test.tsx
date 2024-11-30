import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Button, Divider, Modal, Spin, message } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { ArrowLeftRegular, ArrowRightRegular } from '@fluentui/react-icons';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { useNavigate, useParams } from 'react-router-dom';
import useGetAllData from 'hooks/useGetAllData';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Notification } from 'utils/notification';
import { AxiosError } from 'axios';
import instance from 'config/_axios';
import useGetOneData from 'hooks/useGetOneData';
import { ITopic } from 'models/subject';
import { FILE_URL } from 'config/utils/index - Copy';
import { toHHmmss } from 'utils/others_functions';

const test = [
  {
    id: 1,
    question: "sdasdsa sadasdas dasd sadas d sad as das dasdasdasd",
    image: "cv",
    answers: [
      {
        id: 11,
        text: "fgdfhhdghdhdfgh fgdhfhtyd hdhfght",
        image: "",
      },
      {
        id: 12,
        text: "fgdfhhdghdhdfgh fgdhfhtyd hdhfght",
        image: "dg",
      },
      {
        id: 13,
        text: "fgdfhhdghdhdfgh fgdhfhtyd hdhfght",
        image: "fg",
      },
    ],
  },
  {
    id: 2,
    question: "sdasdsa sadasdas dasd sadas d sad as das dasdasdasd",
    image: "fg",
    answers: [
      {
        id: 21,
        text: "fgdfhhdghdhdfgh fgdhfhtyd hdhfght",
        image: "",
      },
      {
        id: 22,
        text: "fgdfhhdghdhdfgh fgdhfhtyd hdhfght",
        image: "",
      },
      {
        id: 23,
        text: "fgdfhhdghdhdfgh fgdhfhtyd hdhfght",
        image: "",
      },
    ],
  },
  {
    id: 3,
    question: "sdasdsa sadasdas dasd sadas d sad as das dasdasdasd",
    image: "",
    answers: [
      {
        id: 31,
        text: "fgdfhhdghdhdfgh fgdhfhtyd hdhfght",
        image: "",
      },
      {
        id: 32,
        text: "fgdfhhdghdhdfgh fgdhfhtyd hdhfght",
        image: "",
      },
      {
        id: 33,
        text: "fgdfhhdghdhdfgh fgdhfhtyd hdhfght",
        image: "",
      },
    ],
  },
  {
    id: 4,
    question: "sdasdsa sadasdas dasd sadas d sad as das dasdasdasd",
    image: "",
    answers: [
      {
        id: 41,
        text: "fgdfhhdghdhdfgh fgdhfhtyd hdhfght",
        image: "",
      },
      {
        id: 42,
        text: "fgdfhhdghdhdfgh fgdhfhtyd hdhfght",
        image: "",
      },
      {
        id: 43,
        text: "fgdfhhdghdhdfgh fgdhfhtyd hdhfght",
        image: "",
      },
    ],
  },
]

const TestForTopic: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { id, topic_id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { urlValue, writeToUrl } = useUrlQueryParams({});
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [time, setTime] = useState<number>(0);
  const [tests, setTests] = useState<any[]>([]);
  const [result, setResult] = useState<any>();

  const { data: topic, isFetching } = useGetOneData<ITopic>({
    queryKey: ["subject-topic", topic_id],
    url: `/subject-topics/${topic_id}`,
    options: {
      onSuccess: (res) => {
        if (res.data?.isPermission?.status) {
          // setTime(res.data.allotted_time ?? 60);
          getTests();
        } else {
          Modal.error({
            title: "Test ishlash uchun ruhsat yo'q",
            content: "Kontentga qaytish uchun 'ok' tugmasini bosing",
            onOk: () => { navigate(`/subjects/${id}/topics/${topic_id}`) }
          });
        }
      }
    }
  });

  useEffect(() => {
    if (!urlValue.filter_like?.test)
      writeToUrl({ name: "test", value: 1 });
    // if (topic_id)
    //   setAnswers(JSON.parse(localStorage.getItem(topic_id) ?? "{}"));
  }, []);

  const checkAnswer = (answer_id: number, option_id: number) => {
    checkVariant({ option_id, answer_id });
    // if (topic_id) {
    //   let data = JSON.parse(localStorage.getItem(topic_id) ?? "{}");

    //   data = { ...data, [answer_id]: option_id };

    //   localStorage.setItem(topic_id, JSON.stringify(data));
    //   setAnswers(data);
    // }
  }

  const { mutate: getTests, isLoading } = useMutation({
    mutationFn: async () => {
      const formdata = new FormData();

      if (topic_id) {
        formdata.append("topic_id", topic_id);

        const response = await instance({
          url: "/subject-topic-tests/topic-tests?expand=result.now",
          method: "POST",
          data: formdata,
        });
        return response.data;
      } else {
        message.error("Topic_id not found !!!")
      }
    },
    onSuccess: async (res) => {
      queryClient.setQueryData(["subject-topic-tests/topic-tests", topic_id], res);
      if (res?.status === 1) {
        if(topic?.data?.allotted_time){
          // setTime((topic?.data?.allotted_time - (res.data?.result?.current_time - res.data?.result?.start_time)) ?? 60)
          setTime(60)
        } else {
          setTime(60);
        }
        setTests(res.data?.questions);
        setResult(res.data?.result)
        Notification("success", "read", res?.message);
      } else {
        // Notification("error", "read", res?.message);
        if (res?.data?.errors) {
          Modal.error({
            title: Object.entries(res?.data?.errors[0])[0][0] + ": " + Object.entries(res?.data?.errors[0])[0][1],
            content: "Kontentga qaytish uchun 'ok' tugmasini bosing",
            onOk: () => { navigate(`/subjects/${id}/topics/${topic_id}`) }
          });
        }
      }
    },
    onError: (error: AxiosError<any>) => {

      if (error?.response?.data?.errors) {
        Modal.error({
          title: Object.entries(error?.response?.data?.errors[0])[0][0] + ": " + Object.entries(error?.response?.data?.errors[0])[0][1],
          content: "Kontentga qaytish uchun 'ok' tugmasini bosing",
          onOk: () => { navigate(`/subjects/${id}/topics/${topic_id}`) }
        });
      } else {
        Modal.error({
          title: "Malumot olishda xatolik",
          content: "Kontentga qaytish uchun 'ok' tugmasini bosing",
          onOk: () => { navigate(`/subjects/${id}/topics/${topic_id}`) }
        });
      }
    },
    retry: 0,
  });

  useEffect(() => {
    if(result && time > 0){
      const interval = setInterval(() => {
        setTime(p => {
          if (p <= 0) {
            clearInterval(interval);
            Modal.warning({
              title: 'Test vaqti yakunlandi',
              content: "Kontentga qaytish uchun 'ok' tugmasini bosing",
              onOk: () => { navigate(`/subjects/${id}/topics/${topic_id}`) }
            });
            finishTest(result?.id)
            return 0
          }
          return p - 1
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [result]);

  const { mutate: checkVariant, isLoading: checkLoading } = useMutation({
    mutationFn: async ({ answer_id, option_id }: { answer_id: number, option_id: number }) => {
      const formdata = new FormData();

      formdata.append("answer_id", answer_id?.toString());
      formdata.append("option_id", option_id?.toString());

      const response = await instance({
        url: "/subject-topic-tests/answers?expand=questions,answers,subjectTopic",
        method: "POST",
        data: formdata,
      });
      return response.data;
    },
    onSuccess: async (res) => {
      queryClient.setQueryData(["subject-topic-tests/answers", topic_id], res);
      if (res?.status === 1) {
        setTests(res.data);
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
    mutationFn: async (result_id: number) => {
      const formdata = new FormData();

      formdata.append("result_id", result_id?.toString());

      const response = await instance({
        url: "/subject-topic-tests/finishs",
        method: "POST",
        data: formdata,
      });
      return response.data;
    },
    onSuccess: async (res) => {
      queryClient.setQueryData(["/subject-topic-tests/finishs", topic_id], res);
      if (res?.status === 1) {
        navigate(`/subjects/${id}/topics/${topic_id}`);
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
    <div className="">
      <HeaderExtraLayout title={`Topic test`} isBack
        breadCrumbData={[
          { name: "Home", path: '/' },
          { name: "Subjects", path: 'subjects' },
          { name: "Subject info", path: `subjects/${id}` },
          { name: "Topic contents", path: `subjects/${id}/topics/${topic_id}` },
          { name: "Topic tests", path: 'subject_test' },
        ]}
      // btn={<Button type='primary' danger onClick={() => { }} >{("Testni yakunlash")}</Button>}
      />
      <Spin spinning={isLoading || isFetching}>
        <div className="flex max-md:flex-col gap-6 px-6 max-md:px-2">
          <div className="w-full max-w-[980px] mx-auto">
            {/* <div className="">
              <p className='text-end text-lg font-semibold ' >{Math.floor(time / 3600) || "00"}:{Math.floor(time / 60) || "00"}:{time % 60}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {
                  test?.map((e, i) => (
                    <div onClick={() => { writeToUrl({ name: "test", value: i + 1 }) }} className={`h-[36px] w-[36px] flex-center rounded-lg border border-solid cursor-pointer ${answers[e.id] ? "bg-[#EAF0FD] text-[#3776E7] border-[#3775e750]" : "bg-[#F7F7F7] border-gray-200"} ${Number(urlValue.filter_like?.test) === i + 1 ? "border-[#3775e750]" : ""} hover:border-[#3776E760]`}>{i + 1}</div>
                  ))
                }
              </div>
            </div> */}
            <div className="min-h-[260px] bg-[#F7F7F7] rounded-lg border border-solid border-gray-200 p-4 my-2 mt-6 max-md:mt-2">
              {
                tests?.map((e, i) => i + 1 == Number(urlValue.filter_like.test) && (
                  <div className="test" key={i}>
                    <div className="flex max-md:flex-col gap-3">
                      {/* <h4 className='w-1/2 max-md:w-full' >{i + 1}. {e.questions?.text}</h4> */}
                      <div className='w-1/2 max-md:w-full' dangerouslySetInnerHTML={{ __html: e.questions?.text ?? "" }} />
                      {e.questions?.file ? <>
                        {/* <div className="w-1/2 max-md:w-full h-80 rounded-lg bg-[#3775e750]"></div> */}
                        <img src={FILE_URL + e.questions?.file} alt='image' className='w-1/2 max-md:w-full rounded-lg' />
                      </> : null}
                    </div>
                    <Divider className='-ml-4 w-[calc(100%+32px)]' />
                    <div className="variants flex flex-col gap-4 my-4">
                      {
                        e.answers?.map((v: any, idx: number) => (
                          <div key={idx} className="flex gap-2" onClick={() => { e?.option_id != v.id && checkAnswer(e.id, v.id) }} >
                            <div className={`h-[44px] w-[44px] flex-center rounded-lg border border-solid p-3 cursor-pointer ${e?.option_id == v.id ? "bg-[#EAF0FD] text-[#3776E7] border-[#3775e750]" : "bg-[#fff] border-gray-200"}`}>{idx == 0 ? "A" : idx === 1 ? "B" : "C"}</div>
                            <div className={`w-full flex max-md:flex-col gap-3 rounded-lg border border-solid p-3 cursor-pointer ${e?.option_id == v.id ? "bg-[#EAF0FD] text-[#3776E7] border-[#3775e750]" : "bg-[#fff] border-gray-200"} hover:border-[#3776E760]`}>
                              {/* <p className='w-3/5 max-md:w-full' >{v.text}</p> */}
                              <div className='w-3/5 max-md:w-full' dangerouslySetInnerHTML={{ __html: v.text ?? "" }} />
                              {v.file ? <>
                                {/* <div className="w-2/5 max-md:w-full h-80 rounded-lg bg-[#e78c3750]"></div> */}
                                <img src={FILE_URL + v.file} alt='image' className='w-2/5 max-md:w-full rounded-lg' />
                              </> : null}
                            </div>
                          </div>
                        ))
                      }
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
              <p className='text-end text-lg font-semibold ' ><span className='text-sm text-black text-opacity-50' >Qolgan vaqt:&nbsp;</span> {toHHmmss(time)}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {
                  tests?.map((e, i) => (
                    <div key={i} onClick={() => { writeToUrl({ name: "test", value: i + 1 }) }} className={`h-[36px] w-[36px] flex-center rounded-lg border border-solid cursor-pointer ${Number(urlValue.filter_like?.test) === i + 1 ? (e?.option_id ? "text-[#3776E7] bg-[#EAF0FD]" : "text-[#3776E7] bg-white") : e?.option_id ? "bg-[#EAF0FD] text-[#3776E7] border-[#3775e750]" : "bg-white border-gray-200"} hover:border-[#3776E7]`}>{i + 1}</div>
                  ))
                }
              </div>
            </div>
            <div className='text-center' >
              <Button type='primary' danger onClick={() => {
                Modal.warning({
                  title: 'Testni yakunlash',
                  content: "Testni rosdan ham yakunlamoqchimisiz",
                  okText: "Yakunlash",
                  onOk: () => { finishTest(result?.id) }
                });
              }} className='w-full max-w-[320px]' >{("Testni yakunlash")}</Button>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default TestForTopic;


/**
  * test_index
  * test_delete
  * test_update
  * test_view
*/