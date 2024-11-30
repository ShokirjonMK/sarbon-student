import { Button } from "antd"
import { Dispatch, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toHHmmss } from "utils/others_functions"

const ExamCard : React.FC<{testStart: any, item: any, index: number, setselectedTestStart: Dispatch<any>, url: string}> = ({ testStart, item, index, setselectedTestStart, url }): JSX.Element => {

    const navigate = useNavigate();
    const [time, setTime] = useState<number>(0);    

    useEffect(() => {
        const finish = (testStart?.start_time ?? 0) - (testStart?.currect_time ?? 0);

        if (finish <= 1) {
          setTime(0);
        } else {
        setTime(finish);
        }
    }, [testStart])

    useEffect(() => {
        if (testStart && time > 0) {
        const interval = setInterval(() => {
            setTime(p => {
            if (p <= 0) {
                clearInterval(interval);
                return 0;
            }
            return p - 1
            });
        }, 980);

        return () => clearInterval(interval);
        }
    }, [testStart, time]);

    return (
        <div>
            <div className='bg-slate-100 rounded-xl px-4 py-3 h-full'>
              <div className="flex justify-between mb-2">
                <p>Urunish</p>
                <span className='font-bold' >{testStart?.attends_count}</span>
              </div>
              <div className="flex justify-between mb-2">
                <p>Bino / Xona</p>
                <span className='font-bold' >{item?.building ? `${item?.building?.name} / ${item?.room?.name}` : "Ixtiyoriy joyda"}</span>
              </div>
              <div className="flex justify-between mb-2">
                <p>Boshlanish vaqti</p>
                <span className='font-bold' >{testStart?.start_date}</span>
              </div>
              <div className="flex justify-between mb-2">
                <p>Tugash vaqti</p>
                <span className='font-bold' >{testStart?.finish_date}</span>
              </div>
              <div className="flex justify-between mb-2">
                <p>Ball</p>
                <span className='font-bold' >{testStart?.status === 1 ? "Testni boshlamagansiz" : testStart?.ball}</span>
              </div>
              <div className="flex justify-between mb-2">
                <p>Test boshlanishiga qolgan vaqt</p>
                <span className='font-bold text-right' >
                  {
                    testStart?.finish_time <  testStart?.currect_time ? "Test yakunlangan" :
                      item?.status > 3 ? 
                        "Test yakunlangan" 
                        : testStart?.status === 1 ? 
                          toHHmmss(time)
                            : testStart?.status === 2 ? 
                              "Imtihon davom etmoqda"
                                : ""
                  }
                </span>
                {/* <span className='font-bold text-right' >{testStart?.status >= 3 ? "Imtihon yakunlangan" : time === 0 ? "Imtihon davom etmoqda" : toHHmmss(time)}</span> */}
              </div>
              {
               testStart?.finish_time <  testStart?.currect_time ? "" :
                item?.status > 3 ? 
                  "" 
                  : testStart?.status === 1 ? 
                    <Button disabled={time >= 1} onClick={() => setselectedTestStart(testStart)} className='w-full' type='primary'>Boshlash</Button> 
                      : testStart?.status === 2 ? 
                        <Button onClick={() => navigate(`/${url}/${testStart?.id}`)} className='w-full' type='primary'>Testga kirish</Button> 
                          : ""
              }
              {/* {
               testStart?.finish_time <  testStart?.currect_time ? "Test yakunlangan" :
                item?.status > 3 ? 
                  "Test yakunlangan" 
                  : testStart?.status === 1 ? 
                    <Button disabled={time >= 1} onClick={() => setselectedTestStart(testStart)} className='w-full' type='primary'>Boshlash</Button> 
                      : testStart?.status === 2 ? 
                        <Button onClick={() => navigate(`/exam-contol-student/${testStart?.id}?tab=exam_control`)} className='w-full' type='primary'>Testga kirish</Button> 
                          : ""
              } */}
            </div>
        </div>
    )
}
export default ExamCard