import { ColumnsType } from 'antd/es/table';
import useGetAllData from 'hooks/useGetAllData';
import useGetData from 'hooks/useGetData';
import { IPara } from 'models/education';
import { ISimple } from 'models/other';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Segmented, Select, Table, Tag } from "antd"
import { BookRegular, BuildingRegular, PersonVoiceRegular } from '@fluentui/react-icons';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import "./style.scss";
import { useAppSelector } from 'store';


const generateColor = (name: string) => {
  const colors = [
    {
      bg: "#E4F5FF",
      color: "#a8defd"
    },
    {
      bg: "#DAF8E7",
      color: "#a5eec4"
    },
    {
      bg: "#EBE7FF",
      color: "#c0b6f1"
    },
    {
      bg: "#fceeda",
      color: "#fcce73"
    },
    {
      bg: "#ffe9ef",
      color: "#faacbf"
    },
  ];

  const i = Math.round((name?.toUpperCase().charCodeAt(0) - 65) / 5)
  return colors[i];
}

const TimeTable: React.FC = (): JSX.Element => {

  const user = useAppSelector(p => p.auth.user);
  const { t } = useTranslation();
  const ref = useRef<any>(null)
  const { urlValue, writeToUrl } = useUrlQueryParams({});

  const { data: semestrs } = useGetData({
    queryKey: ["edu-semestrs"],
    url: `edu-semestrs?expand=semestr,eduSemestrSubjects.subject,weeks`,
    urlParams: { "per-page": 0 },
    options: {
      onSuccess: (res) => {
        writeToUrl({ name: "semestr_id", value: res?.items?.find(e => e?.status)?.id ?? res.items[0]?.id })
      }
    }
  });  

  const { data, isFetching } = useGetAllData({
    queryKey: ["timetable-dates", urlValue.filter?.semestr_id, urlValue.filter_like, user?.user_id],
    url: "timetable-dates",
    urlParams: {
      "per-page": 0,
      user_id: user?.user_id,
      expand: "room,building,user.profile,subject,subjectCategory,studentIsGroup,secondGroup.studentIsGroup,secondGroup.room,secondGroup.building,secondGroup.user.profile,secondGroup.subject,secondGroup.subjectCategory",
      filter: `{"edu_semestr_id":${urlValue.filter?.semestr_id}}`,
      start_date: urlValue.filter_like?.edu_week?.split("and")[0],
      end_date: urlValue.filter_like?.edu_week?.split("and")[1],
    },
    options: {
      enabled: !!urlValue.filter?.semestr_id,
    }
  });

  useEffect(() => {
      ref.current?.scrollIntoView({
      behavior: "smooth",
      block: 'center',
    });
  }, [data?.items]);

  const { data: weeks, isFetching: loadingWeek } = useGetData<ISimple>({
    queryKey: ["weeks"],
    url: "weeks",
    options: { staleTime: Infinity, refetchOnWindowFocus: false, retry: 0 },
  });

  const { data: paras, isFetching: loadingPara } = useGetData<IPara>({
    queryKey: ["paras"],
    url: "paras",
    options: { staleTime: Infinity, refetchOnWindowFocus: false, retry: 0 },
  });

  const renderData = (time_table: any, color: any) => {
    return <div className={`rounded-r-lg lg:p-2 text-start`}  >
      <p className='' ><BookRegular fontSize={16} className='me-2' /><span className='text-blue-60000 lg:text-[16px] text-[13px]'>{time_table?.subject?.name}</span>&nbsp;&nbsp; <i>({time_table?.subjectCategory?.name})</i></p>
      <p className='uppercase lg:my-2 my-1' ><PersonVoiceRegular fontSize={16} className='me-2' /><span className='text-black text-opacity-50 lg:text-[16px] text-[13px]' >{time_table?.user?.profile?.last_name}&nbsp;{time_table?.user?.profile?.first_name?.slice(0, 1)}. {time_table?.user?.profile?.middle_name?.slice(0, 1)}.</span></p>
      <p className='flex items-start' ><BuildingRegular fontSize={16} className='me-2' /><span className='lg:text-[16px] text-[13px]'>{time_table?.building?.name}&nbsp;&nbsp;{time_table?.room?.name?.replace(/\D/g, '')}-xona ({time_table?.room?.capacity})</span></p>
    </div>
  }

  const renderTimeTable = (para_id: number, week_id: number) => {
    if (data?.items?.length) {
      for (const item of data?.items) {
        if (item?.para_id === para_id && item?.week_id === week_id) {

          // const paer_1 = data?.items?.find(e => e?.para_id === para_id && e?.week_id === week_id && e?.type === 1)
          // const paer_2 = data?.items?.find(e => e?.para_id === para_id && e?.week_id === week_id && e?.type === 2)
          if(item?.two_group === 1) {
            return renderData(item?.studentIsGroup === 1 ? item : item?.secondGroup, generateColor(item?.subject?.name))
          } else {
            return renderData(item, generateColor(item?.subject?.name))
          }
          // <>
          //   {
          //     item?.type === 2 && !paer_1 ? null : paer_1 && paer_1?.type !== item?.type ? <div className='mb-2' >{renderData(paer_1, generateColor(paer_1?.subject?.name))}</div> : ""
          //   }
          //   <div>{renderData(item, generateColor(item?.subject?.name))}</div>
          //   {
          //     item?.type === 1 && !paer_2 ? null : paer_2 && paer_2?.type !== item?.type ? <div className='mt-2' >{renderData(paer_2, generateColor(paer_2?.subject?.name))}</div> : ""
          //   }
          // </>
          // return <> {renderData(item, generateColor())} </>
        }
      }
    } else {
      return null
    }
    return null

  }

  const columns: ColumnsType<any> = [
    {
      title: t('Vaqti'),
      fixed: "left",
      width: 30,
      align: "center",
      render: (e, _, i) => <div className='-rotate-0' ><p>{e?.start_time}</p> <p>{e?.end_time}</p></div>,
    },
    ...(weeks?.items?.filter(e => e?.status)?.map(e => {
      // const today = e?.id == data?.items[0]?.now[6];
      return {
        title: <div >{e?.name}</div>,
        // title: <div ref={today ? ref : null} >{e?.name} {today ? ` (${data?.items[0]?.now[2]})` : null}</div>,
        className: `p-1 `,
        width: 100,
        render: (item: IPara) => renderTimeTable(item?.id, e?.id),
        rowScope: undefined,
      }
    }) || [])
  ]

  return (
    <div className="time-table-wrapper student-time-table">
      <HeaderExtraLayout title='Time table' breadCrumbData={[
        {
          name: "Home",
          path: "/"
        },
        {
          name: "Time table",
          path: "/time-table"
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
        <div className="px-6 max-md:px-2">
          <Select
            showSearch
            placeholder="Haftani tanlang"
            className='w-[350px] mt-4'
            optionFilterProp="children"
            value={urlValue?.filter_like?.edu_week}
            onChange={(e) => writeToUrl({name: "edu_week", value: e})}
            filterOption={(input: string, option?: { label: string; value: string }) => (option?.label ?? '')?.toLowerCase().includes(input?.toLowerCase())}
            options={semestrs?.items?.find((i: any) => i?.id === urlValue.filter?.semestr_id)?.weeks?.map((week: any) => ({ value: `${week?.start_date}and${week?.end_date}and${week?.week}`, label: <div className='flex items-center'>{week?.week} - hafta / {week?.start_date} - {week?.end_date}</div>}))}
          />
          <Table
            columns={columns}
            dataSource={paras?.items}
            pagination={false}
            loading={isFetching || loadingPara || loadingWeek}
            size="middle"
            className="mt-3 mb-5"
            rowClassName="py-[12px]"
            scroll={{ x: 1600 }}
            bordered
          />
        </div>
    </div>
  );
};

export default TimeTable;