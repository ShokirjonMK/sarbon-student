import { useEffect, useState } from "react";
import { Call24Regular, GlobeLocation24Regular, PersonCircleFilled } from "@fluentui/react-icons";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import useWindowSize from "hooks/useWindowSize";
import { useAppDispatch, useAppSelector } from "store";
import GetStudentMe from "services/student_me";
import { FILE_URL } from "config/utils/index - Copy";
import UpdatePassword from "./password";
import checkPermission from "utils/checkPermission";

const MyInformation = () :JSX.Element =>{
  const {t} = useTranslation()
  const [isOpenForm, setisOpenForm] = useState<boolean>(false);
  const [id, setId] = useState<number | undefined>();
  const size = useWindowSize();

  const dispatch = useAppDispatch();
  const student = useAppSelector(s => s.student);
  
  useEffect(() => {
    if (!student.data) {
      dispatch(GetStudentMe({type: ""}));
    }
  }, []);


  return(
    <>
      <div className="bg-[#F2F2F4] lg:py-4 lg:px-6 max-lg:px-4 max-lg:py-4 min-h-full">
        <div className="grid grid-cols-8 lg:gap-8 max-lg:gap-6 max-md:gap-4 max-sm:gap-2">
          <div className="col-span-3 rounded-lg max-md:col-span-8 border border-[#E1E1E1] border-solid text-center h-max">
            <div className="bg-[#F8F8F8] text-center justify-center p-4 rounded-t-lg">
              {
                student?.data?.profile?.image ? <img src={`${FILE_URL}${student?.data?.user?.avatar}`} alt="student image"  className="w-[150px] h-[150px] rounded-[50%] ml-auto mr-auto"/> : <PersonCircleFilled fontSize={150} color="#D9D9D9"/>
              }
              <h3 className="font-bold text-[20px] max-sm:text-[16px] text-[#505050] my-3 max-sm:my-2">{student?.data?.profile?.first_name}  {student?.data?.profile?.last_name}</h3>
              <h4 className="font-bold text-base max-sm:text-[14px] text-[#505050]">Login : {student?.data?.user?.username}</h4>
            </div>
            {
              student?.data?.profile?.phone ? 
                <div className="bg-white border-y border-x-0 border-solid border-[#E1E1E1] py-3 text-start px-4 flex items-center">
                  <Call24Regular/> <span className="ml-2">{student?.data?.profile?.phone}</span>
                </div> : ""
            }
            <div className="bg-white py-3 text-start px-4 flex items-center rounded-b-lg">
              <GlobeLocation24Regular/> <span className="ml-2">{student?.data?.region?.name}</span>
            </div>
          </div>
          <div className="col-span-5 max-md:col-span-8 ">
            <div className="border border-[#E1E1E1] border-solid mb-6 max-sm:mb-3 rounded-lg">
              <div className="bg-[#F8F8F8] px-8 max-sm:px-5 py-4 border-b rounded-t-lg flex justify-between items-center">
                <h3 className="text-blue-500 max-sm:text-base">Shaxsiy ma'lumotlari</h3>
                {/* {
                  checkPermission('password_update') ? (
                    <Button onClick={() => setisOpenForm(true)}>{t('Change password')}</Button>
                  ) : null
                } */}
              </div>
              <div className="border-y border-solid border-[#E1E1E1] py-4 bg-white px-8 max-sm:px-5 border-x-0">
                <span className="max-sm:text-[14px]"><span className="font-bold text-lg max-md:text-base max-sm:text-[14px]">F.I.SH</span> : {student?.data?.profile?.first_name}  {student?.data?.profile?.last_name} {student?.data?.profile?.middle_name}</span>
              </div>
              <div className="border-t-0 border-b border-solid border-[#E1E1E1] py-4 bg-white px-8 max-sm:px-5 border-x-0">
                <span className="max-sm:text-[14px]"><span className="font-bold text-lg max-md:text-base max-sm:text-[14px]">Tug'ilgan sanasi</span> : {student?.data?.profile?.birthday}</span>
              </div>
              <div className="border-t-0 border-b border-solid border-[#E1E1E1] py-4 bg-white px-8 max-sm:px-5 border-x-0">
                <span className="max-sm:text-[14px]"><span className="font-bold text-lg max-md:text-base max-sm:text-[14px]">Hujjat seriya va raqami</span> : {student?.data?.profile?.passport_serial} {student?.data?.profile?.passport_number}</span>
              </div>
              <div className="border-t-0 border-b border-solid border-[#E1E1E1] py-4 bg-white px-8 max-sm:px-5 border-x-0">
                <span className="max-sm:text-[14px]"><span className="font-bold text-lg max-md:text-base max-sm:text-[14px]">JSHSHR</span> : {student?.data?.profile?.passport_pin}</span>
              </div>
              <div className="border-t-0 border-b border-solid border-[#E1E1E1] py-4 bg-white px-8 max-sm:px-5 border-x-0">
                <span className="max-sm:text-[14px]"><span className="font-bold text-lg max-md:text-base max-sm:text-[14px]">Jinsi</span> : {student?.data?.profile?.gender === 0 ? "Ayol" : "Erkak"}</span>
              </div>
              <div className="py-4 bg-white px-8 max-sm:px-5 border-x-0 rounded-b-lg">
                <span className="max-sm:text-[14px]"><span className="font-bold text-lg max-md:text-base max-sm:text-[14px]">Email</span> : {student?.data?.user?.email}</span>
              </div>
            </div>
            <div className="border border-[#E1E1E1] border-solid rounded-lg">
              <div className="bg-[#F8F8F8] px-8 max-sm:px-5 py-4 border-b rounded-t-lg"><h3 className="text-blue-500 max-sm:text-base">Ta'lim ma'lumotlari</h3></div>
              <div className="border-y border-solid border-[#E1E1E1] py-4 bg-white px-8 max-sm:px-5 border-x-0">
                <span className="max-sm:text-[14px]"><span className="font-bold text-lg max-md:text-base max-sm:text-[14px]">Fakultet</span>: {student?.data?.faculty?.name}</span>
              </div>
              <div className="border-t-0 border-b border-solid border-[#E1E1E1] py-4 bg-white px-8 max-sm:px-5 border-x-0">
                <span className="max-sm:text-[14px]"><span className="font-bold text-lg max-md:text-base max-sm:text-[14px]">Yo'nalish</span>: {student?.data?.direction?.name}</span>
              </div>
              <div className="border-t-0 border-b border-solid border-[#E1E1E1] py-4 bg-white px-8 max-sm:px-5 border-x-0">
                <span className="max-sm:text-[14px]"><span className="font-bold text-lg max-md:text-base max-sm:text-[14px]">Ta'lim shakli</span>: {student?.data?.eduForm?.name}</span>
              </div>
              <div className="border-t-0 border-b border-solid border-[#E1E1E1] py-4 bg-white px-8 max-sm:px-5 border-x-0">
                <span className="max-sm:text-[14px]"><span className="font-bold text-lg max-md:text-base max-sm:text-[14px]">Ta'lim turi</span>: {student?.data?.eduType?.name}</span>
              </div>
              <div className="border-t-0 border-b border-solid border-[#E1E1E1] py-4 bg-white px-8 max-sm:px-5 border-x-0">
                <span className="max-sm:text-[14px]"><span className="font-bold text-lg max-md:text-base max-sm:text-[14px]">Kursi</span>: {student?.data?.course?.name}</span>
              </div>
              <div className="border-t-0 border-b border-solid border-[#E1E1E1] py-4 bg-white px-8 max-sm:px-5 border-x-0">
                <span className="max-sm:text-[14px]"><span className="font-bold text-lg max-md:text-base max-sm:text-[14px]">Guruhi</span> : {student?.data?.group?.unical_name}</span>
              </div>
              <div className="py-4 bg-white px-8 max-sm:px-5 border-x-0 rounded-b-lg">
                <span className="max-sm:text-[14px]"><span className="font-bold text-lg max-md:text-base max-sm:text-[14px]">Shartnoma turi</span> : {student?.data?.is_contract === 1 ? "Kontrakt" : "Grand"}</span>
                {
                  checkPermission('password_update') ? (<Button size={ size.width < 768 ? "small" : "middle"} type='primary' className="block ml-auto max-sm:mt-4" onClick={() => setisOpenForm(true)}>{t('Change password')}</Button>) : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpdatePassword id={student?.data?.user_id} setisOpenForm={setisOpenForm} isOpenForm={isOpenForm} setId={setId} />
    </>
  )
}

export default MyInformation