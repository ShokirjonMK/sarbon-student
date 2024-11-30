import { PersonCircleFilled } from "@fluentui/react-icons";
import { FILE_URL } from "config/utils/index - Copy";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAppSelector } from "store";

const StudentDashboardProfile = () : JSX.Element => {
  const {t} = useTranslation()
  const auth = useAppSelector(state => state.auth)
  
  return(
    <div className="w-full bg-white rounded-lg border border-solid border-black border-opacity-5 md:mb-6 max-md:mb-2 lg:p-5 max-lg:p-4 md:p-4 max-md:p-[10px]">
      <h4 className="text-black text-opacity-90 lg:text-xl max-lg:text-lg max-md:text-base font-bold">{t('Profil')}</h4>
      <div className="w-full justify-center text-center">
        {
          auth?.user?.profile?.image ? <img src={`${FILE_URL}${auth?.user?.profile?.image}`} alt="user image" className="w-[100px] h-[100px] rounded-[50%] ml-auto mr-auto"/> : <PersonCircleFilled fontSize={100} color="#D9D9D9"/>
        }
        <h5 className="text-black text-opacity-90 text-base font-bold mt-4">{auth?.user?.profile?.first_name} {auth?.user?.profile?.last_name}</h5>
        <p className="text-black text-opacity-40 text-sm font-normal">{t('Login')}: <span className="text-black text-opacity-90 text-sm font-medium">{auth?.user?.username}</span></p>
        {/* <p className="text-black text-opacity-40 text-sm font-normal">{t('Group')}: <span className="text-black text-opacity-90 text-sm font-medium">AX_123</span></p> */}
        <Link to="/my-information" className="text-center text-blue-600 text-sm font-normal hover:cursor-pointer no-underline">{t('My information')}</Link>
      </div>
    </div>
  )
}

export default StudentDashboardProfile