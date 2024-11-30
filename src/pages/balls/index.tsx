import { ColumnsType } from 'antd/es/table';
import {Collapse, Table} from "antd";
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import React from 'react'
import { useTranslation } from 'react-i18next';
import useGetData from 'hooks/useGetData';

const Balls : React.FC = () : JSX.Element => {

  const {t} = useTranslation();

  const columns: ColumnsType<any> = React.useMemo(
    () => [
      {
        title: "№",
        dataIndex: "order",
        render: (_, __, i) => i + 1,
        width: 45,
      },
      {
        title: t("Subject"),
        dataIndex: "eduSemestrSubject",
        render: (e) => e?.subject?.name
      },
      {
        title: t("To'plangan ball / Umumiy ball"),
        align: "center",
        render: (e) => `${e?.all_ball} / ${e?.eduSemestrSubject?.max_ball}`
      },
      {
        title: t("Baho"),
        align: "center",
        dataIndex: "rating",
      },
    ],
    []
  );

  const { data: studentGroups, isFetching } = useGetData({
    queryKey: ["student-groups"],
    url: `student-groups?expand=studentSemestrSubjects.eduSemestrSubject.subject,eduSemestr.semestr,course,group,direction,faculty,eduPlan`,
    urlParams: { "per-page": 0 },
  });

  return(
    <div>
    <HeaderExtraLayout title='Balls' breadCrumbData={[
        {
          name: "Home",
          path: "/"
        },
        {
          name: "Balls",
          path: "/Balls"
        },
      ]}
      />
      <div className="px-6 pt-3 max-md:px-2">
        {
          studentGroups?.items?.sort((a, b) => a?.semestr_id - b?.semestr_id)?.map((item, index) => (
            <Collapse 
              key={index}
              className='mb-4'
              defaultActiveKey={[item?.eduSemestr?.status === 1 ? item?.eduSemestr?.status : undefined]}
              items={
                [
                  {
                    key: item?.eduSemestr?.status,
                    label: item?.eduSemestr?.semestr?.name,
                    children: <>
                                <div className='flex gap-5'>
                                  <div>
                                    <strong className='block'>{t("Faculty")}:</strong>
                                    <strong className='block'>{t("Direction")}:</strong>
                                    <strong className='block'>{t("Course")}:</strong>
                                    <strong className='block'>{t("Edu plan")}:</strong>
                                    <strong className='block'>{t("Group")}:</strong>
                                  </div>
                                  <div>
                                    <p>{item?.faculty?.name}</p>
                                    <p>{item?.direction?.name}</p>
                                    <p>{item?.course?.name}</p>
                                    <p>{item?.eduPlan?.name}</p>
                                    <p>{item?.group?.unical_name}</p>
                                  </div>
                                </div>
                                <Table
                                  columns={columns}
                                  dataSource={item?.studentSemestrSubjects}
                                  pagination={false}
                                  loading={isFetching}
                                  size="middle"
                                  className="mt-3"
                                  rowClassName="py-[12px]"
                                  scroll={{ x: 576 }}
                                />
                              </>
                  }
                ]
              } 
              expandIconPosition="end"
            />
          ))
        }
      </div>
    </div>
  )
}

export default Balls