import {Col, Row, Select } from "antd";
import React from 'react'
import { useTranslation } from 'react-i18next';
import useGetAllData from 'hooks/useGetAllData';
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { IEduSemestr } from 'models/education';
import useGetData from 'hooks/useGetData';
import HeaderUserView from 'pages/users/components/vewHeader';
import { cf_filterOption, generateAntdColSpan } from 'utils/others_functions';
import { Link } from "react-router-dom";
import { BookFilled, IosArrowRtl24Regular } from "@fluentui/react-icons";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";

const Exams: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { urlValue, writeToUrl } = useUrlQueryParams({});

  const { data: semestrs, isFetching: isSemestrFetching } = useGetData<IEduSemestr>({
    queryKey: ["edu-semestrs"],
    url: `edu-semestrs?expand=semestr,eduSemestrSubjects.subject`,
    urlParams: { "per-page": 0 },
    options: {
      onSuccess: (res) => {
        writeToUrl({ name: "edu_semestr_id", value: res?.items?.find(e => e?.status)?.id ?? res.items[0]?.id })
      },
    }
  });

  const { data: eduSemestrSubjects, isFetching: isSubjectFetching } = useGetAllData<IEduSemestr>({
    queryKey: ["edu-semestr-subjects", urlValue.filter?.edu_semestr_id],
    url: `edu-semestr-subjects?expand=subject`,
    urlParams: { "per-page": 0, filter: JSON.stringify({edu_semestr_id: urlValue.filter?.edu_semestr_id}) },
    options: {
      onSuccess: (res) => {
        writeToUrl({ name: "semestr_id", value: res?.items?.find(e => e?.status)?.id ?? res.items[0]?.id })
      },
      enabled: !!urlValue.filter?.edu_semestr_id
    }
  });

  return (
    <div className="">
      <HeaderExtraLayout title='Exams' breadCrumbData={[
          {
            name: "Home",
            path: "/"
          },
          {
            name: "Exams",
            path: "/exams"
          },
        ]}
        btn={
          <Row gutter={[12, 12]} >
            <Col {...generateAntdColSpan({ xs: 24, sm: 24, md: 24, lg: 24, xl: 12 })}>
              <Select
                className="w-[100%] min-w-[220px]"
                placeholder={`${t(`Filter by semestr`)}`}
                allowClear
                // disabled={!urlValue.filter?.semestr_id}
                value={ urlValue?.filter?.edu_semestr_id }
                onChange={(e) => {writeToUrl({name: "semestr_id", value: e})}}
                // onClear={handleClear}
                // onFocus={() => !data?.items?.length && refetch()}
                showSearch
                filterOption={cf_filterOption}
                loading={isSemestrFetching}
              >
                {
                  semestrs?.items?.length ? semestrs.items.map((element: any) =>
                    <Select.Option key={element.id} value={element.id}>{element?.semestr?.name}</Select.Option>
                  ) : null
                }
              </Select>
            </Col>
          </Row>
        }
      />

      <div className="px-6 py-6 max-md:p-2">
        {
          eduSemestrSubjects?.items?.map((sub: any, index: number) => (
            <Link className="no-underline" to={`/exams/subject/vew/${sub?.id}`} key={index}>
              <div className="h-max px-5 max-md:px-2 py-4 max-md:py-2 bg-neutral-100 rounded-lg items-center gap-5 max-md:gap-3 flex mb-3 cursor-pointer">
                  <div className="grow shrink basis-0 justify-start items-start gap-4 max-md:gap-2 flex">
                    <BookFilled className='' fontSize={32} color='#2F54EB' />
                    <div className="flex gap-1 flex-col">
                      <div className="text-black text-opacity-90 text-base font-medium">{sub?.subject?.name}</div>
                      <div className="d-f gap-2 flex-wrap">
                        <div className="text-black text-opacity-40 text-[13px] font-normal leading-[17.03px]">Credit: {sub?.credit}</div>
                        <div className="h-5 w-[0px] border border-solid border-black border-opacity-5 max-[400px]:hidden"></div>
                        <div className="text-black text-opacity-40 text-[13px] font-normal leading-[17.03px]">Auditoriya soati: {sub?.auditory_time}</div>
                        {/* <div className="h-5 w-[0px] border border-solid border-black border-opacity-5 max-[400px]:hidden"></div> */}
                        {/* <div className="text-black text-opacity-40 text-[13px] font-normal leading-[17.03px]">Davomat: {subkectAttends(sub?.subject_id)}</div> */}
                      </div>
                    </div>
                  </div>
                  <IosArrowRtl24Regular className='text-[12px]' fontSize={12} />
                </div>
            </Link>
          ))
        }
      </div>
    </div>
  );
}

export default Exams