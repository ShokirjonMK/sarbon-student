import { Col, Row } from 'antd';
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import React, { useEffect } from 'react'
import GetStudentMe from 'services/student_me';
import { useAppDispatch, useAppSelector } from 'store';

const InteractiveServices: React.FC = (): JSX.Element => {

  return (
    <div>
      <HeaderExtraLayout title='Interactive Services' breadCrumbData={[
        {
          name: "Home",
          path: "/"
        },
        {
          name: "Interactive Services",
          path: "/interactive-service"
        },
      ]}
      />
      <Row gutter={[12, 12]} className='p-6 w-full  max-md:px-2' >
        <Col xs={24} sm={12} lg={8} xxl={6}>
          <div className="p-5 rounded-lg border border-solid border-black border-opacity-5 gap-5 flex items-start cursor-pointer hover:shadow-xl">
            <div className="p-3 bg-blue-700 rounded-full shadow-xl justify-center items-center flex">
              <div className="w-6 h-6 relative" />
            </div>
            <div className="py-1 flex-col items-start gap-2 flex">
              <div className="self-stretch text-black text-opacity-90 text-base font-semibold leading-tight">Shikoyat va takliflar</div>
              <div className="self-stretch text-black text-opacity-40 text-sm font-normal leading-snug">O’qish sharoitlari, korrupsion holatlar, o’qituvchilar va boshqalar haqida anonim tarzda shikoyat qilish, takliflar yuborish</div>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={8} xxl={6}>
          <div className="p-5 rounded-lg border border-solid border-black border-opacity-5 gap-5 flex items-start cursor-pointer hover:shadow-xl">
            <div className="p-3 bg-blue-700 rounded-full shadow-xl justify-center items-center flex">
              <div className="w-6 h-6 relative" />
            </div>
            <div className="py-1 flex-col items-start gap-2 flex">
              <div className="self-stretch text-black text-opacity-90 text-base font-semibold leading-tight">O’qish haqida ma’lumotnoma olish</div>
              <div className="self-stretch text-black text-opacity-40 text-sm font-normal leading-snug">O’qish joyidan ma’lumotnoma elektron tarzda olish</div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default InteractiveServices