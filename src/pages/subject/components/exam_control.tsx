import { Button, Modal, Segmented } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import HeaderPage from 'components/HeaderPage';
import dayjs from 'dayjs';
import useGetAllData from 'hooks/useGetAllData';
import useGetData from 'hooks/useGetData';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { IEduSemestr } from 'models/education';
import { IExamControl } from 'models/exam';
import { IAttend } from 'models/student';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import checkPermission from 'utils/checkPermission';

const ExamControl: React.FC<{ id: string | undefined, isSubject?: boolean }> = ({ id, isSubject }): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { urlValue, writeToUrl } = useUrlQueryParams({});

  const { data: semestrs } = useGetData<IEduSemestr>({
    queryKey: ["edu-semestrs"],
    url: `edu-semestrs?expand=semestr,eduSemestrSubjects.subject`,
    urlParams: { "per-page": 0 },
    options: {
      onSuccess: (res) => {
        writeToUrl({ name: "semestr_id", value: res?.items?.find(e => e?.status)?.id ?? res.items[0]?.id })
      },
      enabled: isSubject
    }
  });

  const { data, isFetching, refetch } = useGetAllData<IExamControl>({
    queryKey: ["exam-controls", id, urlValue.filter?.semestr_id, urlValue.filter?.subject_id],
    url: "/exam-controls?sort=-id&expand=type,examControlStudents,examTimes",
    urlParams: {
      "per-page": 0,
      filter: { "subject_id": isSubject ? Number(id) : urlValue?.filter?.subject_id, "edu_semestr_id": urlValue.filter?.semestr_id }
    },
    options: {
      enabled: !!id && !!urlValue.filter?.semestr_id,
    }
  });

  const columns: ColumnsType<IExamControl> = React.useMemo(
    () => [
      {
        title: "№",
        dataIndex: "order",
        render: (_, __, i) => i + 1,
        width: 45,
      },
      {
        title: t("Name"),
        dataIndex: "name",
      },
      {
        title: t("Type"),
        dataIndex: "type",
        render: (e) => <span>{e === 1 ? "Yozma" : e === 2 ? "Test" : ""}</span>
      },
      {
        title: t("Date"),
        render: (e) => <span>{dayjs(e?.start_time * 1000).format("YYYY.MM.DD HH:mm")} - {dayjs(e?.finish_time * 1000).format("YYYY.MM.DD HH:mm")}</span>
      },
      {
        title: t("Duration"),
        dataIndex: "duration",
        render: (e) => <span>{e ?? 0} minut</span>
      },
      {
        title: t("Ball"),
        render: (e) => <span>{e?.examControlStudents[0]?.student_ball ?? "_"} / {e?.max_ball}</span>,
        align: "center"
      },
      {
        title: t("Boshlash"),
        render: (i, e) => checkPermission("exam-control-student_view") ? e?.examControlStudents?.length ? e?.finish_time > (e?.examTimes?.current ?? 0) && !e?.examControlStudents[0]?.user_status ?
          <Button
            size='small'
            type='primary'
            disabled={e?.start_time > (e?.examTimes?.current ?? 0)}
            onClick={() => {
              if (e?.examControlStudents?.length) {
                if (e?.type === 3) {
                  Modal.confirm({
                    title: 'Testni boshlamoqchimisiz?',
                    content: <div>
                      <p className='font-medium'>
                        <span className='text-black text-opacity-50 me-2'>Savollar:</span>
                        <b>{e?.question_count ?? 0} ta</b>
                      </p>
                      <p className='font-medium'>
                        <span className='text-black text-opacity-50 me-2'>Davomiyligi:</span>
                        <b>{e?.duration ?? 0} minut</b>
                      </p>
                    </div>,
                    cancelText: "Bekor qilish",
                    okText: "Boshlash",
                    onOk: () => { navigate(`/exam-control/${e?.examControlStudents?.length && e?.examControlStudents[0]?.id}?type=${e?.type}&subject_id=${id}`) },
                  });
                } else {
                  if(e?.type === 1) localStorage.removeItem(`exam_control_text_${e?.examControlStudents[0]?.id}`);
                  navigate(`/exam-control/${e?.examControlStudents[0]?.id}?type=${e?.type}&subject_id=${id}`);
                }
              }
            }
            }
          >
            Boshlash
          </Button>
          : e?.type === 3 && e?.finish_time > (e?.examTimes?.current ?? 0) ? null : <span
            onClick={() => {
              if(e?.examControlStudents?.length) {
                if(e?.type === 1) localStorage.removeItem(`exam_control_text_${e?.examControlStudents[0]?.id}`);
                navigate(`/exam-control/view/${e?.examControlStudents[0]?.id}?type=${e?.type}&subject_id=${id}`)
              }
            }}
            className='rounded-md bg-blue-200 py-1 px-3 text-blue-600 cursor-pointer'
          >
            Ko'rish
          </span> : null : null,
        align: "center"
      },
    ],
    [data?.items]
  );

  return (
    <div className="px-6 max-md:p-2">
      <HeaderPage
        title={t('Student Exam Control')}
        className=''
        create_permission=''
        createOnClick={() => { }}
        buttons={
          isSubject ? <div>
            <span className="text-black text-opacity-40 text-sm font-normal leading-snug">Semestr:</span>&nbsp;&nbsp;
            <Segmented
              value={urlValue.filter?.semestr_id}
              options={(semestrs?.items ?? [])?.map(e => ({ label: e?.semestr?.id, value: e?.id }))}
              onChange={(e) => { writeToUrl({ name: "semestr_id", value: e }) }}
            />
          </div> : <></>
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

export default ExamControl;