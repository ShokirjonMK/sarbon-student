import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ISubjectContent, ISubjectContentTypes, ITopic } from 'models/subject';
import useGetOneData from 'hooks/useGetOneData';
import { Button, Empty, Modal, Segmented, Spin } from 'antd';
import { DocumentRegular, ImageRegular, ListRegular, MoviesAndTvRegular, MusicNote2Regular } from '@fluentui/react-icons';
import Content from '../components/content';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import { useTranslation } from 'react-i18next';
import instance from 'config/_axios';
import "../style.scss";

export type ContentType = "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" | "FILE";

export type UpdateContentType = {
  id: number,
  order: number,
  type: ISubjectContentTypes,
  content?: ISubjectContent
}

const _duration = 0;

const getTime = () => {
  return Math.floor((new Date().getTime()) / 1000)
}

const SubjectContent: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id, topic_id } = useParams();
  const [types, setTypes] = useState<any>([]);
  const [active_type, setActiveType] = useState<number>(0);
  const [duration, setDuration] = useState<number>(1);
  const [visible, setVisible] = useState<boolean>(false);
  const [isRead, setIsRead] = useState<boolean>(false);

  const head_ref = useRef<any>(null);
  const contents_ref = useRef<any>(null);
  // const loader_ref = useRef<any>(null);
  const interval = useRef<any>(null);
  const start_time = useRef<any>(getTime());

  const { } = useGetOneData<ISubjectContentTypes>({
    queryKey: ["content-types"],
    url: "/subject-contents/types",
    urlParams: { "per-page": 0 },
    options: {
      onSuccess: (res) => {
        setTypes(res);
      }
    }
  });

  const { data: topic, isFetching } = useGetOneData<ITopic>({
    queryKey: ["subject-topic", topic_id],
    url: `/subject-topics/${topic_id}?expand=content,content.types`,
    options: {
      onSuccess: (res) => {
        if (res.data.subject_category_id === 1) {
          if (!res.data?.isPermission?.status) {
            setDuration(res.data?.duration_reading_time ?? _duration);
            start_time.current = getTime();
          } else {
            setIsRead(true);
          }
        } else {
          // loader_ref.current.style.display = "none"
        }
      }
    }
  });

  useEffect(() => {
    if (contents_ref.current) {
      contents_ref.current.style.height = `${window.innerHeight - head_ref?.current?.offsetHeight - 60}px`;
    }
  }, [topic?.data]);

  useEffect(() => {
    console.log(duration);
    // if (topic?.data) {
    //   if (topic?.data?.duration_reading_time) {
    //     loader_ref.current.style.width = `${(head_ref.current.offsetWidth / (topic?.data.duration_reading_time)) * (topic?.data.duration_reading_time - duration)}px`
    //   } else {
    //     loader_ref.current.style.width = "100%"
    //   }
    // }

    if (duration === 0 && topic?.data.subject_category_id === 1) {
      readed(start_time.current, getTime().toString());
    }
  }, [duration, topic?.data]);

  useEffect(() => {
    if (topic?.data && !topic.data?.isPermission?.status) {
      _interval();

      // window.addEventListener("focus", () => {
      //   console.log("Tab is focused");
      //   _interval();
      // });
      // window.addEventListener("blur", () => {
      //   console.log("Tab is blurred");
      //   _clearInterval();
      // });

      return () => {
        _clearInterval();
        // if (loader_ref?.current?.style)
        //   loader_ref.current.style.width = 0;
        // console.log("component is inActive");

        // document.removeEventListener("focus", () => { _interval(); });
        // window.removeEventListener("blur", () => { _clearInterval(); });
      }
    }
  }, [topic?.data]);

  const _interval = () => {
    interval.current = setInterval(() => {
      setDuration(p => {
        if (p <= 0) {
          _clearInterval();
          return p
        } else {
          return --p
        }
      });
    }, 1000)
  };

  const _clearInterval = () => {
    clearInterval(interval.current);
  }

  const readed = async (start_time: string, end_time: string) => {
    const formdata = new FormData();

    if (topic_id) {
      formdata.append("topic_id", topic_id)
      formdata.append("start_time", start_time)
      formdata.append("end_time", end_time)

      // const res = await instance({ url: `/student-topic-permissions/permissions`, method: "POST", data: formdata });
      // if (res?.data?.status) {
      //   setIsRead(true);
      // }
    }
  }

  const contents = useMemo(() => {
    if (active_type === 0) return topic?.data?.content?.sort((a, b) => a.order - b.order);
    return topic?.data?.content?.filter(e => e.type === active_type)?.sort((a, b) => a.order - b.order);
  }, [topic?.data, active_type])

  const types_tab = useMemo(() => {
    const arr: any = [{ label: "All", value: 0, }];
    types?.forEach((e: ISubjectContentTypes) => {
      arr.push({
        label: <div className="d-f">
            {
              e?.type === "AUDIO" ? <MusicNote2Regular fontSize={15} />
                : e?.type === "TEXT" ? <ListRegular fontSize={15} />
                  : e?.type === "VIDEO" ? <MoviesAndTvRegular fontSize={15} />
                    : e?.type === "IMAGE" ? <ImageRegular fontSize={15} />
                      : <DocumentRegular fontSize={15} />
            }
          {head_ref?.current?.offsetWidth > 768 ? <span>&nbsp;{e?.type}</span> : <span className='opacity-0' >.</span>}
        </div>,
        value: e?.id,
      })
    })
    return arr
  }, [types]);

  console.log("Header ref => ", head_ref?.current?.offsetWidth, head_ref?.current?.innerWidth,);
  // console.log("Loader ref => ", loader_ref?.current?.offsetWidth, loader_ref?.current?.innerWidth);


  return (
    <div className="relative subject-content-wrapper" >
      <div ref={head_ref} >
        <HeaderExtraLayout title={topic?.data?.name ?? "Subject content"} isBack
          breadCrumbData={[
            { name: "Home", path: '/' },
            { name: "Subjects", path: 'subjects' },
            { name: "Subject info", path: `subjects/${id}` },
            { name: "Topic contents", path: 'subject_content' }
          ]}
          btn={
            <div className='w-full d-f md:justify-end max-md:flex-wrap max-md:justify-between gap-1'>
              <div className="w-full overflow-auto"></div>
              <Segmented options={types_tab} value={active_type} onChange={(e) => setActiveType(Number(e))} />
              {/* {
                isRead && topic?.data.subject_category_id === 1 ? <Button type='primary' onClick={() => { setVisible(true) }} >{t("Test ishlash")}</Button> : null
              } */}
            </div>
          }
        />
        {/* <div ref={loader_ref} className={`loader w-0 h-0 border-2 border-solid ${isRead ? "border-green-500" : "border-blue-400"}`}></div> */}
      </div>
      {/* <span className="relative flex h-12 w-12 mx-auto my-6">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-12 w-12 bg-sky-500"></span>
      </span> */}
      <Spin spinning={isFetching}>
        <div className="p-3 overflow-y-auto max-md:px-2" ref={contents_ref} >
          <div className='max-w-[760px] mx-auto' >
            {
              contents?.length ? contents?.map((content, i) => {
                return <div key={i}>
                  {/* view */}
                  <Content
                    content={content}
                  />
                </div>
              }) : <Empty className='mt-12' />
            }
          </div>
        </div>
      </Spin>

      <Modal title="Mavzu uchun test" open={visible} onCancel={() => setVisible(false)} footer={[
        <Button danger onClick={() => setVisible(false)}>Bekor qilish</Button>,
        <Button type='primary' disabled={!topic?.data?.isPermission?.attempts_count} onClick={() => { navigate(`/subjects/${id}/topics/${topic_id}/test`) }}>Boshlash</Button>
      ]}>
        <div className="mt-3 p-2">
          <p className='font-semibold' ><span className='text-black text-opacity-50 me-2' >Urinishlar soni:&nbsp;</span>{topic?.data?.attempts_count}</p>
          <p className='font-semibold' ><span className='text-black text-opacity-50 me-2' >Qolgan urinishlar soni:&nbsp;</span>{topic?.data?.isPermission?.attempts_count}</p>
          <p className='font-semibold' ><span className='text-black text-opacity-50 me-2' >Testga berilgan vaqt:&nbsp;</span>{topic?.data?.allotted_time} s</p>
          <p className='font-semibold' ><span className='text-black text-opacity-50 me-2' >Savollar soni:&nbsp;</span>{topic?.data?.test_count}</p>
          <p className='font-semibold' ><span className='text-black text-opacity-50 me-2' >O'tish bali:&nbsp;</span>{topic?.data?.min_percentage} %</p>
        </div>
      </Modal>
    </div>
  );
};

export default SubjectContent;

/**
  * subject-content_index
  * subject-content_delete
  * subject-content_update
  * subject-content_view
*/

// subjects/5/topics/49/contents