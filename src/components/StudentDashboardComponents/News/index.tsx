import React from "react";
import { ChevronRightFilled } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const StudentDashboardNews = () : JSX.Element => {
  const {t} = useTranslation()
  return(
    <div className="w-full bg-white rounded-lg border border-solid border-black border-opacity-5 lg:p-5 max-lg:p-4 md:p-4 max-md:p-[10px]">
      <div className="flex justify-between items-center">
        <h4 className="text-black text-opacity-90 lg:text-xl max-lg:text-lg max-md:text-base font-bold">{t('News')}</h4>
        <Link to='#' className="no-underline flex items-center"><span className="text-blue-600 text-sm font-normal ml-2">{t('All')}</span> <ChevronRightFilled fontSize={16} color="blue"/></Link>
      </div>
      <ul className="list-none p-0 m-0 flex flex-col lg:mt-[29px] max-lg:mt-[20px] max-md:mt-[15px]">
        <li className="lg:mb-[16px] max-lg:mb-[14px] max-md:mb-[10px]">
          <p className="overflow-hidden line-clamp-2 text-black text-opacity-90 text-base font-normal">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio ratione iure, nemo animi aliquid temporibus sed totam recusandae incidunt provident!
          </p>
          <time className="text-black text-opacity-40 text-sm font-normal">12.12.2023</time>
          <hr className="bg-black bg-opacity-5 lg:mt-[16px] max-lg:mt-[14px] max-md:mt-[10px]"/>
        </li>
        <li className="lg:mb-[16px] max-lg:mb-[14px] max-md:mb-[10px]">
          <p className="overflow-hidden line-clamp-2 text-black text-opacity-90 text-base font-normal">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio ratione iure, nemo animi aliquid temporibus sed totam recusandae incidunt provident!
          </p>
          <time className="text-black text-opacity-40 text-sm font-normal">12.12.2023</time>
          <hr className="bg-black bg-opacity-5 lg:mt-[16px] max-lg:mt-[14px] max-md:mt-[10px]"/>
        </li>
        <li className="lg:mb-[16px] max-lg:mb-[14px] max-md:mb-[10px]">
          <p className="overflow-hidden line-clamp-2 text-black text-opacity-90 text-base font-normal">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio ratione iure, nemo animi aliquid temporibus sed totam recusandae incidunt provident!
          </p>
          <time className="text-black text-opacity-40 text-sm font-normal">12.12.2023</time>
          <hr className="bg-black bg-opacity-5 lg:mt-[16px] max-lg:mt-[14px] max-md:mt-[10px]"/>
        </li>
      </ul>
    </div>
  )
}

export default StudentDashboardNews