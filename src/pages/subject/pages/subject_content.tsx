import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ISubjectContent, ISubjectContentTypes, ITopic } from 'models/subject';
import useGetOneData from 'hooks/useGetOneData';
import { Empty, Segmented, Spin } from 'antd';
import { DocumentRegular, ImageRegular, ListRegular, MoviesAndTvRegular, MusicNote2Regular } from '@fluentui/react-icons';
import Content from '../components/content';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import "../style.scss";
import useWindowSize from 'hooks/useWindowSize';

export type ContentType = "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" | "FILE";

export type UpdateContentType = {
  id: number,
  order: number,
  type: ISubjectContentTypes,
  content?: ISubjectContent
}

const SubjectContent: React.FC = (): JSX.Element => {
  const { id, topic_id } = useParams();
  const [types, setTypes] = useState<any>([]);
  const [active_type, setActiveType] = useState<number>(0);
  const {width} = useWindowSize()

  useGetOneData<ISubjectContentTypes>({
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
  });


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
          {width > 768 ? <span>&nbsp;{e?.type}</span> : <span className='opacity-0' >.</span>}
        </div>,
        value: e?.id,
      })
    })
    return arr
  }, [types]);


  return (
    <div className="relative subject-content-wrapper" >
      <div>
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
            </div>
          }
        />
      </div>
      <Spin spinning={isFetching}>
        <div className="p-3 overflow-y-auto max-md:px-2">
          <div className='max-w-[760px] mx-auto' >
            {
              contents?.length ? contents?.map((content, i) => {
                return <div key={i}>
                  <Content
                    content={content}
                  />
                </div>
              }) : <Empty className='mt-12' />
            }
          </div>
        </div>
      </Spin>
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