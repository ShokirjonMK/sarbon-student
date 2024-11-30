import { ChevronLeft20Filled, ChevronRight20Filled } from "@fluentui/react-icons";
import { Button, Timeline } from "antd";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";

const StudentDashboardTimeTable = () : JSX.Element => {
  const { urlValue, writeToUrl } = useUrlQueryParams({});

  const { data } = useGetAllData({
    queryKey: ["time-table", urlValue.filter?.semestr_id],
    url: "time-tables?expand=subject,teacher,subjectCategory,building,room,language,week,para,archived,now",
    urlParams: {
      "per-page": 0,
      filter: `{"edu_semestr_id":${urlValue.filter?.semestr_id}}`
    },
    options: {
      enabled: !!urlValue.filter?.semestr_id,
    }
  });

  const today = new Date();
  const weekDay = today.getDay(); 

  const findWeek = data?.items?.filter((item:any) => (item?.week_id === weekDay))

  return(
    <div className="w-full  bg-white rounded-lg border border-solid border-black border-opacity-5 md:mb-6 max-md:mb-2 lg:p-5 max-lg:p-4 md:p-4 max-md:p-[10px]">
      
      <div className="flex justify-between items-center mb-[20px] w-[100%] flex-wrap">
        <div className="text-black text-opacity-90 text-xl font-bold leading-7 mb-2">Dars jadvali </div>
      </div>

    <Timeline
      className="inline-block"
      mode="left"
      items={findWeek?.map((item:any, index:number) => ({
        dot: (
          <div className="w-6 h-6 relative rounded-3xl">
            <div className="w-6 h-6 left-0 top-0 absolute bg-blue-600 rounded-3xl border border-blue-600" />
            <div className="left-[9px] top-[4px] absolute text-center text-white text-xs font-normal leading-tight">
              {index+1}
            </div>
          </div>
        ),
        label: (
          <div className="text-blue-600 text-xl font-medium leading-7 max-sm:text-sm">
            {item?.para?.start_time} : {item?.para?.end_time}
          </div>
        ),
        children: (
          <>
            <div className="w-96 max-lg:w-full text-black text-opacity-90 text-base max-sm:text-sm font-medium leading-normal">
              {item?.subject?.name} ({item?.subjectCategory?.name})
            </div>
            <div className="w-96 max-lg:w-full text-black text-opacity-40 text-sm font-normal leading-snug">
              {item?.teacher?.first_name} {item?.teacher?.last_name} ({item?.room?.name}) <br />
            </div>
          </>
        ),
      }))}
    />


    </div>
  )
}

export default StudentDashboardTimeTable;