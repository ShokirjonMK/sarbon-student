import { BookDefaultFilled } from "@fluentui/react-icons";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { useTranslation } from "react-i18next";
import { Divider, Drawer, Segmented, Table, Tag } from "antd";
import { TitleModal } from "components/Titles";
import { IoClose } from "react-icons/io5";
import React, { useState } from "react";
import { globalConstants } from "config/constants";
import { ColumnsType } from "antd/es/table";
import { IAttend } from "models/student";

const StudentDashboardGrades = (): JSX.Element => {

  const { t } = useTranslation();
  const [acttiveSubject, setActtiveSubject] = useState<any>()

  const attend_columns: ColumnsType<IAttend> = React.useMemo(
    () => [
      {
        title: t("Date"),
        render: (_, e, i) => <span>{i + 1}.&nbsp;{e?.date}&nbsp;&nbsp;<span className='text-black text-opacity-40' >({e?.subjectCategory?.name}) {e?.para?.name} / {e?.timeTableDate?.week?.name}</span></span>,
      },
      {
        title: t("Status"),
        render: (e) => e?.reason ? <Tag color='success' >Sababli</Tag> : <Tag color='error' >Sababsiz</Tag>,
        align: "right"
      },
    ],
    []
  );

  const { urlValue, writeToUrl } = useUrlQueryParams({
    currentPage: 1,
    perPage: 0,
  });

  const { data } = useGetAllData({
    queryKey: ["student-semestr-marks", urlValue.perPage, urlValue.currentPage, urlValue.filter?.semestr_id],
    url: `student-semestr-subjects`,
    urlParams: {
      "per-page": urlValue.perPage,
      filter: JSON.stringify({ semestr_id: urlValue.filter?.semestr_id }),
      page: urlValue.currentPage,
      expand: "studentAttends,studentAttends.para,studentAttends.timeTableDate.week,studentAttends.subjectCategory,studentAttendReasonCount,studentAttendsCount,studentVedomst,studentVedomst.studentMark,studentVedomst.studentMark.examType,eduSemestrSubject,eduSemestrSubject.subject,eduSemestrSubject.eduSemestrExamsTypes"
    },
    options: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  });

  const { data: semestrs } = useGetAllData({
    queryKey: ["edu-semestrs"],
    url: `edu-semestrs?expand=semestr`,
    urlParams: { "per-page": 0 },
    options: {
      onSuccess: (res) => {
        writeToUrl({ name: "semestr_id", value: res?.items?.find(e => e?.status)?.semestr?.id ?? res.items[0]?.semestr?.id })
      }
    }
  });

  const move = (array: any[], from: number, to: number, on = 1) => {
    return array = array.slice(), array.splice(to, 0, ...array.splice(from, on)), array
  }

  const calcAttendPercent = ({ item }: { item: any }) => {

    let per = (item?.studentAttendsCount - item?.studentAttendReasonCount) / ((item?.eduSemestrSubject?.auditory_time ?? 2) / 2);

    if (per >= 0.25) {
      return {
        bgColor: "bg-red-200",
        percent: per
      }
    } else if (per > 0.15 && per < 0.25) {
      return {
        bgColor: "bg-amber-200",
        percent: per
      }
    }

    return {
      bgColor: "bg-green-200",
      percent: per
    }
  }

  return (
    <div className="bg-white rounded-lg border border-solid border-black border-opacity-5  lg:p-5 max-lg:p-4 md:p-4 max-md:p-[10px]">
      <div className="flex justify-between items-center">
        <h4 className="text-black text-opacity-90 lg:text-xl max-lg:text-lg max-md:text-base font-bold">{t('Grades')}</h4>
        <div>
          <span className="text-black text-opacity-40 text-sm font-normal leading-snug max-sm:hidden">Semestr:</span>&nbsp;&nbsp;
          <Segmented
            value={urlValue.filter?.semestr_id}
            options={(semestrs?.items ?? [])?.map(e => ({ label: e?.semestr?.id, value: e?.semestr?.id }))}
            onChange={(e) => { writeToUrl({ name: "semestr_id", value: e }) }}
          />
        </div>
      </div>
      <ul className="list-none p-0 m-0 flex flex-col lg:mt-[20px] max-lg:mt-[15px] max-md:mt-[10px]">
        {
          data?.items?.map((item: any, i: number) => (
            <li key={i} className="w-full flex lg:p-4 max-lg:p-3 max-md:p-2 rounded-lg border border-solid border-black border-opacity-5 mb-4 bg-[#F5F5F5]">
              <BookDefaultFilled fontSize={24} color="#2F54EB" />
              <div className="ml-3 w-full">
                <div className="md:flex justify-between max-md:my-2">
                  <h5 className="text-black text-opacity-90 text-base font-medium">{item?.eduSemestrSubject?.subject?.name}</h5>
                  <div className={`${calcAttendPercent({ item })?.bgColor} py-2 px-3 rounded-md flex items-center justify-between`}>
                    <span className="inline-block mr-5" >Davomat (soatda)</span>
                    <div>
                      <p>Sababli: {item?.studentAttendReasonCount * 2}</p>
                      <p className="my-2">Sababsiz: {item?.studentAttendsCount * 2 - item?.studentAttendReasonCount * 2}</p>
                      <p className="mb-2">Umumiy: {item?.studentAttendsCount * 2}</p>
                      <span className="inline-block mr-5 text-blue-500 underline cursor-pointer" onClick={() => setActtiveSubject(item)} >Batafsil</span>
                    </div>
                  </div>
                </div>

                <hr className="my-2 bg-black bg-opacity-5" />
                {
                  item?.studentVedomst?.map((vodeomst: any) => (
                    <div key={vodeomst?.id} className="bg-[#fdfdfd] p-2 rounded-md mb-2">
                      <Divider className="my-0" orientation="left">{vodeomst?.vedomst === 1 ? "1 - shakl" : vodeomst?.vedomst === 2 ? "1 - A shakl" : vodeomst?.vedomst === 3 ? "1 - B shakl" : ""}</Divider>
                      <div className="xl:flex items-center justify-between max-sm:flex-col max-sm:items-start">
                        {
                          move(vodeomst?.studentMark.sort((a: any, b: any) => a?.exam_type_id - b?.exam_type_id), 2, item?.eduSemestrSubject?.eduSemestrExamsTypes?.length - 1)
                            ?.map((mark: any) => (
                              <div key={mark?.id} className="flex justify-between w-full max-xl:my-1">
                                <p className="text-[#939393] text-sm">
                                  {
                                    mark?.exam_type_id !== 3 ?
                                      <span>{mark?.examType?.name}: {mark?.ball} ball</span>
                                      : <Tag color={mark?.passed === 2 ? "red" : vodeomst?.passed === 1 ? "green" : "blue"}>
                                        {mark?.status == 2 ? `${mark?.examType?.name} : ${mark?.ball} ball ${vodeomst?.passed == 2 ? "/o'ta olmadi" : vodeomst?.passed == 1 ? "/o'tdi" : "Tasdiqlanmagan"}` : `${mark?.examType?.name} : Baholanmagan`}
                                      </Tag>
                                  }
                                </p>
                              </div>
                            ))
                        }
                      </div>
                    </div>
                  ))
                }
              </div>
            </li>
          ))
        }
      </ul>
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
        <div className="w-[432px] text-black text-opacity-90 text-xl font-medium leading-7">{acttiveSubject?.eduSemestrSubject?.subject?.name}</div>
        <Table
          columns={attend_columns}
          dataSource={acttiveSubject?.studentAttends}
          pagination={false}
          size="small"
          className="mt-3"
          showHeader={false}
        />
      </Drawer>
    </div>
  )
}

export default StudentDashboardGrades