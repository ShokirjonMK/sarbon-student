import { BookFilled, IosArrowRtl24Filled, IosArrowRtl24Regular } from '@fluentui/react-icons';
import { Alert, Empty, Segmented, Spin } from 'antd'
import Table, { ColumnsType } from 'antd/es/table';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import useGetAllData from 'hooks/useGetAllData';
import useGetData from 'hooks/useGetData';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { IEduSemestr } from 'models/education';
import { IAttend } from 'models/student';
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom';

const Subject: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { urlValue, writeToUrl } = useUrlQueryParams({});

  const { data: semestrs, isFetching } = useGetData<IEduSemestr>({
    queryKey: ["edu-semestrs"],
    url: `edu-semestrs?expand=semestr,eduSemestrSubjects.subject,eduSemestrSubjects.timeTableTeacher`,
    urlParams: { "per-page": 0 },
    options: {
      onSuccess: (res) => {
        writeToUrl({ name: "semestr_id", value: res?.items?.find(e => e?.status)?.id ?? res.items[0]?.id })
      }
    }
  });

  const { data: attends } = useGetAllData<IAttend>({
    queryKey: ["attends", urlValue.filter?.semestr_id],
    url: "student-attends?expand=subject",
    urlParams: {
      "per-page": 0,
      filter: { "edu_semestr_id": urlValue.filter?.semestr_id }
    },
    options: {
      enabled: !!urlValue.filter?.semestr_id,
    }
  });

  const subkectAttends = (id: number) => {
    let sum = 0;

    attends?.items?.forEach(e => {
      if( e?.subject?.id === id && !e?.reason) sum += 1;
    });

    return <span>{sum}</span>
  }

  return (
    <div>
      <HeaderExtraLayout title='Subjects' breadCrumbData={[
        {
          name: "Home",
          path: "/"
        },
        {
          name: "Subjects",
          path: "/subjects"
        },
      ]}
        btn={
          <div>
            <span className="text-black text-opacity-40 text-sm font-normal leading-snug">Semestr:</span>&nbsp;&nbsp;
            <Segmented
              value={urlValue.filter?.semestr_id}
              options={(semestrs?.items ?? [])?.map(e => ({ label: e?.semestr?.id, value: e?.id }))}
              onChange={(e) => { writeToUrl({ name: "semestr_id", value: e }) }}
            />
          </div>
        }
      />
      <div className="p-6 max-md:p-3 pb-0">
        <Alert message={t("Please select the relevant semester to view previous semester information considering the academic semester has changed!")} type="warning" showIcon className='mb-3' />
        <Spin spinning={isFetching}>
          {
            !semestrs?.items?.length && isFetching ? <div className="h-60"></div> : null
          }
          {
            semestrs?.items?.length ? semestrs.items?.find(e => e?.id === Number(urlValue?.filter?.semestr_id))?.eduSemestrSubjects?.map((subject, i) => (
              <div key={i} onClick={() => { navigate(`/subjects/${subject?.subject_id}?semestr_id=${urlValue?.filter?.semestr_id}`) }} className="h-max px-5 max-md:px-2 py-4 max-md:py-2 bg-neutral-100 rounded-lg items-center gap-5 max-md:gap-3 flex mb-3 cursor-pointer">
                <div className="grow shrink basis-0 justify-start items-start gap-4 max-md:gap-2 flex">
                  <BookFilled className='' fontSize={32} color='#2F54EB' />
                  <div className="flex gap-1 flex-col">
                    <div className="text-black text-opacity-90 text-base font-medium">{subject?.subject?.name}</div>
                    <div className="d-f gap-2 flex-wrap">
                      {/* <div className="text-black text-opacity-40 text-[13px] font-normal leading-[17.03px]">Ma’ruza: Axmedov Komil</div>
                      <div className="h-5 w-[0px] border border-solid border-black border-opacity-5 max-[400px]:hidden"></div>
                      <div className="text-black text-opacity-40 text-[13px] font-normal leading-[17.03px]">Seminar: Axmedov Komil</div> */}
                      {/* <div className="h-5 w-[0px] border border-solid border-black border-opacity-5 max-[400px]:hidden"></div> */}
                      <div className="text-black text-opacity-40 text-[13px] font-normal leading-[17.03px]">Credit: {subject?.credit}</div>
                      <div className="h-5 w-[0px] border border-solid border-black border-opacity-5 max-[400px]:hidden"></div>
                      <div className="text-black text-opacity-40 text-[13px] font-normal leading-[17.03px]">Auditoriya soati: {subject?.auditory_time}</div>
                      <div className="h-5 w-[0px] border border-solid border-black border-opacity-5 max-[400px]:hidden"></div>
                      <div className="text-black text-opacity-40 text-[13px] font-normal leading-[17.03px]">Davomat: {subkectAttends(subject?.subject_id)}</div>
                    </div>
                  </div>
                </div>
                {/* <IosArrowRtl24Filled /> */}
                <IosArrowRtl24Regular className='text-[12px]' fontSize={12} />
              </div>
            )) : !isFetching ? <Empty className='mt-12' /> : null
          }
        </Spin>
      </div>
    </div>
  )
}

export default Subject