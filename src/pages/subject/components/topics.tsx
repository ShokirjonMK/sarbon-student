import { Checkmark24Filled, Eye24Regular, LockClosed24Regular } from '@fluentui/react-icons';
import { Empty, Segmented, Spin } from 'antd';
import useGetData from 'hooks/useGetData';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { ISubjectCategory, ITopic } from 'models/subject';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Topics: React.FC<{ id: string | undefined, topics: ITopic[], loading: boolean }> = ({ id, topics, loading }): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { urlValue, writeToUrl } = useUrlQueryParams({});

  const { data: subjectCategory, isFetching } = useGetData<ISubjectCategory>({
    queryKey: ["subject-categories"],
    url: `subject-categories`,
    urlParams: { "per-page": 0 },
  });

  useEffect(() => {
    if (!urlValue.filter?.subject_category_id) {
      writeToUrl({ name: "subject_category_id", value: 1000 })
    }
  }, []);

  return (
    <div className="p-6 max-md:p-2 py-2">
      <Spin spinning={isFetching || loading}>
        <div className="d-f md:justify-end mb-3 w-full overflow-auto">
          <Segmented
            // block
            value={urlValue.filter?.subject_category_id}
            options={[{ label: "All", value: 1000 }, ...(subjectCategory?.items ?? [])?.map(e => ({ label: e?.name, value: e?.id }))]}
            onChange={(e) => { writeToUrl({ name: "subject_category_id", value: e }) }}
          />
        </div>
        {
          topics?.length ? topics?.filter(e => urlValue.filter?.subject_category_id === 1000 || e?.subject_category_id === urlValue.filter?.subject_category_id)?.map((topic, i) => {
            // const lock = topic?.isPermission;
            return (
              // <div onClick={() => { if((topic?.subject_category_id === 1 && !!lock) || topic?.subject_category_id !== 1) navigate(`/subjects/${id}/topics/${topic?.id}`) }} className="min-h-[90px] px-5 max-md:px-2 py-4 max-md:py-2 bg-neutral-100 rounded-lg justify-start items-center gap-6 max-md:gap-3 flex mb-3 cursor-pointer">
              <div key={i} onClick={() => navigate(`/subjects/${id}/topics/${topic?.id}`)} className="min-h-[90px] px-5 max-md:px-2 py-4 max-md:py-2 bg-neutral-100 rounded-lg justify-start items-center gap-6 max-md:gap-3 flex mb-3 cursor-pointer">
                <div className="grow shrink basis-0 flex-col justify-start items-center gap-2 inline-flex">
                  <div className="self-stretch flex-col justify-center items-start flex">
                    <div className="text-blue-600 text-base font-normal leading-normal">{topic?.name}</div>
                  </div>
                  <div className="self-stretch h-px bg-black bg-opacity-5" />
                  <div className="self-stretch justify-start items-center gap-2 inline-flex">
                    <div className="text-black text-opacity-40 text-[13px] font-normal leading-[17.03px]">{topic?.subjectCategory?.name}</div>
                    <div className="w-5 h-[0px] origin-top-left -rotate-90 border border-black border-opacity-5"></div>
                    <div className="text-black text-opacity-40 text-[13px] font-normal leading-[17.03px]">Ajratilgan soat: {topic?.hours}</div>
                  </div>
                </div>
                {/* <IosArrowRtl24Regular /> */}
                {/* { topic?.subject_category_id === 1 ? lock ? lock.status === 2 ? <div className='text-green-500' ><Checkmark24Filled /><Checkmark24Filled className='-ml-2' /></div> : lock.status === 1 ? <Checkmark24Filled className='text-blue-500' /> : <Eye24Regular /> : topic?.parent?.isPermission?.status ? <Eye24Regular /> : <LockClosed24Regular /> : <Eye24Regular />} */}
              </div>
            )
          })
            : !loading ? <Empty className='mt-12' /> : null
        }
      </Spin>
    </div>
  );
};

export default Topics;