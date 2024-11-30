import { CheckmarkCircleFilled, ChevronRightFilled, ClipboardTextEditFilled} from "@fluentui/react-icons";
import { Calendar } from "antd";
import dayjs from "dayjs";
import useGetAllData from "hooks/useGetAllData";
import useGetData from "hooks/useGetData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { IEduSemestr } from "models/education";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

const StudentDashboardAssigments = (): JSX.Element => {
  const { t } = useTranslation();
  const [allData, setallData] = useState<any[]>();
  const { urlValue, writeToUrl } = useUrlQueryParams({});

  const { data: semestrs } = useGetData<IEduSemestr>({
    queryKey: ["edu-semestrs"],
    url: `edu-semestrs?expand=semestr,eduSemestrSubjects.subject`,
    urlParams: { "per-page": 0 },
    options: {
      onSuccess: (res) => {
        writeToUrl({name: "semestr_id", value: res?.items?.find((e) => e?.status)?.id ?? res.items[0]?.id,});
      },
    },
  });



  const { data } = useGetAllData({
    queryKey: ["exam-controls", urlValue.filter?.semestr_id],
    url: `exam-controls?expand=examControlStudents`,
    urlParams: {"per-page": 0, filter: { edu_semestr_id: urlValue.filter?.semestr_id },},
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (res) => {
        setallData(res?.items);
      },
    },
  });

  const sortedItems = data?.items?.sort((a,b) => {
    const timeA = dayjs.unix(a.start_time).valueOf()
    const timeB = dayjs.unix(b.start_time).valueOf()
    return timeA - timeB;
  })

  return (
    <div className="w-full bg-white rounded-lg border border-solid border-black border-opacity-5 md:mb-6 max-md:mb-2 lg:p-5 max-lg:p-4 md:p-4 max-md:p-[10px]">
      <h4 className="text-black text-opacity-90 lg:text-xl max-lg:text-lg max-md:text-base font-bold">
        {t("Assigments")}
      </h4>
      <div className="grid md:grid-cols-8 max-md:grid-cols-1 gap-5 justify-between">
        <div className="xl:col-span-3 lg:col-span-8 max-lg:col-span-8 ">
          <Calendar fullscreen={false} />
        </div>
        <div className="xl:col-span-5 lg:col-span-8 max-lg:col-span-8 ">
          <ul className="list-none p-0 m-0 flex flex-col">
            {sortedItems?.slice(0,4).map((item: any, index) => (
              <Link key={index} to={`/exam-control/view/${item?.examControlStudents[0]?.id}?type=${item?.type}&subject_id=${item?.subject_id}`} className="no-underline p-3 rounded-lg border border-solid border-black border-opacity-5 mb-[8px]">
                <li className="w-full  flex">
                  { item?.status === 1 ? <CheckmarkCircleFilled fontSize={24} color="#52C41A" /> : <ClipboardTextEditFilled fontSize={24} color="blue"/> }
                  <div className="ml-[12px] w-full">
                    <h5 className="text-black text-opacity-90 text-base font-medium">{item?.name}</h5>
                    <div className="flex items-center justify-between no-underline text-black text-opacity-40 text-sm font-normal">
                      <span>{t('Start time')}: {dayjs.unix(item?.start_time).format("MM-DD-YYYY HH:mm")}</span>
                      <ChevronRightFilled fontSize={16} color="#999999" className="ml-auto"/>
                    </div>
                    <p className="text-black text-opacity-40 text-sm font-normal">Max ball: {item?.max_ball}</p>
                  </div>
                </li>
              </Link>
            ))}
            <Link to={`/exams?semestr_id=${semestrs?.items?.find((e) => e?.status)?.id ?? semestrs?.items[0]?.id})}&tab=exam_control`} className="ml-auto no-underline text-[14px] text-[#2563EB]">{t('More')}...</Link>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardAssigments;
