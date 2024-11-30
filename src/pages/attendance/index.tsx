import { Drawer, Segmented, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import HeaderPage from 'components/HeaderPage';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import { TitleModal } from 'components/Titles';
import { globalConstants } from 'config/constants';
import useGetAllData from 'hooks/useGetAllData';
import useGetData from 'hooks/useGetData';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { IEduSemestr } from 'models/education';
import { IAttend } from 'models/student';
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IoClose } from 'react-icons/io5';

type TypeSubjectAttend = {
  subject_id: number
  subject_name: string,
  cause: number,
  uncause: number,
  count: number,
  attends: IAttend[]
}

const
Attends: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { urlValue, writeToUrl } = useUrlQueryParams({});
  const [acttiveSubject, setActtiveSubject] = useState<number>()


  const { data: semestrs } = useGetData<IEduSemestr>({
    queryKey: ["edu-semestrs"],
    url: `edu-semestrs?expand=semestr,eduSemestrSubjects.subject`,
    urlParams: { "per-page": 0 },
    options: {
      onSuccess: (res) => {
        writeToUrl({ name: "semestr_id", value: res?.items?.find(e => e?.status)?.id ?? res.items[0]?.id })
      }
    }
  });

  // const { data, isFetching, refetch } = useGetAllData<IAttend>({
  //   queryKey: ["attends", urlValue.filter?.semestr_id],
  //   url: "student-attends?expand=reason,timeTable.teacher,timeTable.para,timeTable.week,subjectCategory,subject",
  //   urlParams: {
  //     "per-page": 0,
  //     filter: { "edu_semestr_id": urlValue.filter?.semestr_id }
  //   },
  //   options: {
  //     enabled: !!urlValue.filter?.semestr_id,
  //   }
  // });

  const { data, isFetching } = useGetAllData<IAttend>({
    queryKey: ["timetable-attends", urlValue.filter?.semestr_id],
    url: "/timetable-attends?expand=timeTableDate.para,timeTableDate.week,subjectCategory,subject,student,student.profile",
    urlParams: {
      "per-page": 0,
      filter: { "edu_semestr_id": urlValue.filter?.semestr_id, }
    },
    options: {
      enabled: !!urlValue.filter?.semestr_id,
    }
  });

  const subject_attends = useMemo(() => {
    let attends: TypeSubjectAttend[] = []

    data?.items?.forEach(e => {
      const i = attends?.findIndex(a => a?.subject_id === e?.subject?.id)
      if(attends[i]){
        attends[i].attends?.push(e);
        attends[i].count++;
        if(e?.reason) attends[i].cause++;
        else attends[i].uncause++;
      } else {
        attends.push({
          subject_id: e?.subject?.id ?? 0,
          subject_name: e?.subject?.name ?? "",
          cause: e?.reason ? 1 : 0,
          uncause: e?.reason ? 0 : 1,
          count: 1,
          attends: [e]
        })
      }
    })

    return attends
  }, [data?.items])

  const subject_columns: ColumnsType<TypeSubjectAttend> = React.useMemo(
    () => [
      {
        title: "№",
        dataIndex: "order",
        render: (_, __, i) => i + 1,
        width: 45,
      },
      {
        title: t("Subject"),
        render: (e) => <span className='text-blue-600 cursor-pointer' onClick={() => {setActtiveSubject(e?.subject_id)}} >{e?.subject_name}</span>,
      },
      {
        title: t("Sababli(soat)"),
        render: (e) => <span style={{ opacity: e?.cause ? 1 : 0.25}} >{e?.cause*2}</span>,
        align: "center",
      },
      {
        title: t("Sababsiz(soat)"),
        render: (e) => <span style={{ opacity: e?.uncause ? 1 : 0.25}} >{e?.uncause*2}</span>,
        align: "center",
      },
      {
        title: t("Umumiy(soat)"),
        render: (e) => <span style={{ opacity: e?.count ? 1 : 0.25}} >{e?.count*2}</span>,
        align: "center",
      },
    ],
    [data?.items]
  );

  const attend_columns: ColumnsType<IAttend> = React.useMemo(
    () => [
      {
        title: t("Date"),
        render: (_, e, i) => <span>{i+1}.&nbsp;{e?.date}&nbsp;&nbsp;<span className='text-black text-opacity-40' >({e?.subjectCategory?.name}) {e?.timeTableDate?.para?.name} / {e?.timeTableDate?.week?.name}</span></span>,
      },
      {
        title: t("Status"),
        render: (e) => e?.reason ? <Tag color='success' >Sababli</Tag> : <Tag color='error' >Sababsiz</Tag>,
        align: "right"
      },
    ],
    [subject_attends]
  );

  return (
    <div className="">
      <HeaderExtraLayout title='Attends' breadCrumbData={[
        {
          name: "Home",
          path: "/"
        },
        {
          name: "Attends",
          path: "/attends"
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
      <div className="px-6 pt-3 max-md:px-2">
        <Table
          columns={subject_columns}
          dataSource={subject_attends}
          pagination={false}
          loading={isFetching}
          size="middle"
          className="mt-3"
          rowClassName="py-[12px]"
          scroll={{ x: 576 }}
        />
      </div>

      <Drawer
        title={
          <div className="flex items-center justify-between">
            <TitleModal>{"Qoldirilgan darslar"}</TitleModal>
            <IoClose
              onClick={() => setActtiveSubject(undefined)}
              className="text-[24px] cursor-pointer text-[#00000073]"
            />
          </div>
        }
        open={!!acttiveSubject}
        onClose={() => setActtiveSubject(undefined)}
        closable={false}
        placement="right"
        width={globalConstants.antdDrawerWidth}
        headerStyle={{ backgroundColor: "#F7F7F7" }}
        footerStyle={{ boxShadow: 'inset 0px 1px 0px #F0F0F0' }}
      >
        <div className="w-[432px] text-black text-opacity-90 text-xl font-medium leading-7">{subject_attends?.find(e => e?.subject_id === acttiveSubject)?.subject_name}</div>
        <Table
          columns={attend_columns}
          dataSource={subject_attends?.find(e => e?.subject_id === acttiveSubject)?.attends}
          pagination={false}
          loading={isFetching}
          size="small"
          className="mt-3"
          showHeader={false}
        />
      </Drawer>

    </div>
  );
};

export default Attends;