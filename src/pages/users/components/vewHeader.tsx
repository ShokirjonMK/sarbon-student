import { ArrowLeft20Filled } from "@fluentui/react-icons";
import { Tabs, TabsProps } from "antd";
import CustomBreadcrumb from "components/Breadcrumb";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

type THeaderProps = {
  title: string,
  btn?: React.ReactNode,
  breadCrumbData?: Array<{
    name: string,
    path: string
  }>,
  isBack?: boolean,
  menuType?: "menu" | 'tab',
  tabs?: TabsProps['items']
}

const HeaderUserView: FC<THeaderProps> = ({ title, btn, breadCrumbData, isBack = false, menuType = "menu", tabs }): JSX.Element => {

  const navigate = useNavigate()
  const { urlValue, writeToUrl } = useUrlQueryParams({});

  const initialBreadCrumbData = [
    {
      name: "Home",
      path: "/"
    },
    {
      name: title,
      path: "/"
    },
  ]

  return (
    <div className={`${menuType == "menu" ? "pb-[22px]" : "pb-[8px]"} `} >
        <div className="pt-[16px] px-[24px] max-md:px-3" style={{ background: "var(--v-bg)" }}>
            <CustomBreadcrumb arr={breadCrumbData ?? initialBreadCrumbData} />
            <div className="flex justify-between items-center mt-[14px] max-md:flex-wrap gap-2">
                <div className="flex items-center">
                {
                    isBack ? <ArrowLeft20Filled fontSize={20} onClick={() => navigate(-1)} className="mr-[18px] cursor-pointer" /> : ""
                }
                <p className="text-[24px] font-bold capitalize">{title}</p>
                </div>
                {btn}
            </div>
        </div>
      <Tabs defaultActiveKey="main-info" activeKey={urlValue.filter_like['tab']} onChange={(e) => writeToUrl({name: "tab", value: e})} tabBarStyle={{ background: "var(--v-bg)", paddingLeft: "24px", paddingTop: "10px" }} items={tabs} />
    </div>
  )
}

export default HeaderUserView