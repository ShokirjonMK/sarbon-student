import { Segmented, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import HeaderPage from 'components/HeaderPage';
import useGetAllData from 'hooks/useGetAllData';
import useGetData from 'hooks/useGetData';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { IEduSemestr } from 'models/education';
import { IAttend } from 'models/student';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Attends: React.FC<{ id: string | undefined }> = ({ id }): JSX.Element => {
  const {t} = useTranslation();
  const { urlValue, writeToUrl } = useUrlQueryParams({});

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

  const { data, isFetching, refetch } = useGetAllData<IAttend>({
    queryKey: ["attends", id, urlValue.filter?.semestr_id],
    url: "student-attends?expand=timeTable.teacher,timeTable.para,timeTable.week,subjectCategory",
    urlParams: {
      "per-page": 0,
      filter: { "subject_id": Number(id), "edu_semestr_id": urlValue.filter?.semestr_id }
    },
    options: {
      enabled: !!id && !!urlValue.filter?.semestr_id,
    }
  });

  const columns: ColumnsType<any> = React.useMemo(
    () => [
      {
        title: "№",
        dataIndex: "order",
        render: (_, __, i) => i+1,
        width: 45,
      },
      {
        title: t("Subject category"),
        render: (e) => <>{e?.subjectCategory?.name}</>,
        // className: (e: any) => e?.reason ? "bg" : ""
      },
      {
        title: t("Teacher"),
        render: (e) => <>{e?.timeTable?.teacher?.last_name} {e?.timeTable?.teacher?.first_name}</>,
      },
      // {
      //   title: t("Week"),
      //   render: (e) => <>{e?.timeTable?.week?.name}</>,
      // },
      // {
      //   title: t("Para"),
      //   render: (e) => <>{e?.timeTable?.para?.name}</>,
      // },
      {
        title: t("Date"),
        dataIndex: "date",
        align: "center",
      },
      {
        title: t("Reason"),
        dataIndex: "reason",
        render: (e) => e ? <Tag color='success'>Sababli</Tag> : <Tag color='error'>Sababsiz</Tag>,
        align: "center",
      },
    ],
    [data?.items]
  );

  return (
    <div className="px-6 max-md:p-2">
      <HeaderPage title='Attendance' create_permission='' createOnClick={() => { }} buttons={
        <div>
          <span className="text-black text-opacity-40 text-sm font-normal leading-snug">Semestr:</span>&nbsp;&nbsp;
          <Segmented
            value={urlValue.filter?.semestr_id}
            options={(semestrs?.items ?? [])?.map(e => ({ label: e?.semestr?.id, value: e?.id }))}
            onChange={(e) => { writeToUrl({ name: "semestr_id", value: e }) }}
          />
        </div>
      } />
      <Table
          columns={columns}
          dataSource={data?.items}
          // bordered
          pagination={false}
          loading={isFetching}
          size="middle"
          className="mt-3"
          rowClassName="py-[12px]"
          scroll={{ x: 576 }}
        />
    </div>
  );
};

export default Attends;