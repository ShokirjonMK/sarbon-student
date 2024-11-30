import { FC } from "react";
import { useTranslation } from "react-i18next";
import "./style.scss";
import StudentDashboardProfile from "components/StudentDashboardComponents/Profile";
import StudentDashboardAssigments from "components/StudentDashboardComponents/Assignments";
import StudentDashboardNews from "components/StudentDashboardComponents/News";
import StudentDashboardGrades from "components/StudentDashboardComponents/Grades";
import StudentDashboardTimeTable from "components/StudentDashboardComponents/TimeTable";

const StudentProfileHomePage: FC = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="bg-[#F7F7F7] lg:py-4 lg:px-6 max-lg:px-5 max-lg:py-3 max-md:px-[10px] min-h-full">
      {/* <h2 className="text-black text-opacity-90 font-bold sm:text-[16px] md:text-[18px] lg:text-[20px]">{t("Home page")}</h2> */}

      <div className="max-w-full lg:mt-[26px] max-lg:mt-[20px] max-md:mt-[15px]  max-sm:mt-[10px] grid md:grid-cols-8 max-md:grid-cols-1 md:gap-5 max-md:gap-2 ">
        <div className="xl:col-span-6 lg:col-span-5 max-lg:col-span-4 md:col-span-4 max-md:col-span-8 ">
          {/* <StudentDashboardTimeTable/> */}
          {/* <StudentDashboardAssigments/> */}
          <StudentDashboardGrades/>
        </div>
        <div className="xl:col-span-2 lg:col-span-3 max-lg:col-span-4 md:col-span-4 max-md:col-span-8  max-md:row-start-1">
          <StudentDashboardProfile/>
          {/* <StudentDashboardNews/> */}
        </div>
      </div>
    </div>
  );
};

export default StudentProfileHomePage;
