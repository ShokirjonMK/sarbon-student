import { ArrowLeft20Filled } from "@fluentui/react-icons";
import CustomBreadcrumb from "components/Breadcrumb";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type THeaderProps = {
  title: string,
  btn?: React.ReactNode,
  breadCrumbData?: Array<{
    name: string,
    path: string
  }>,
  isBack?: boolean | string,
  backUrl?: string;
  menuType?: "menu" | 'tab',
  className?: string,
}

const HeaderExtraLayout: FC<THeaderProps> = ({ title, btn, breadCrumbData, isBack = false, menuType = "menu", className, backUrl }): JSX.Element => {
  const {t} = useTranslation();
  const navigate = useNavigate()

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
    <div className={`pt-[16px] px-[24px] max-md:px-3 ${menuType == "menu" ? "pb-[22px]" : "pb-[8px]"} ${className ?? ""}`} style={{ borderBottom: menuType == "menu" ? "1px solid #F0F0F0" : "", background: "var(--v-bg)" }}>
      <CustomBreadcrumb arr={breadCrumbData ?? initialBreadCrumbData} />
      <div className="flex justify-between flex-wrap gap-2 items-center max-md:items-start mt-[14px]">
        <div className="flex items-center">
          {
            isBack ? <ArrowLeft20Filled fontSize={20} onClick={() => backUrl ? navigate(backUrl) : navigate(-1)} className="mr-[18px] cursor-pointer" /> : ""
          }
          <p className="text-[24px] font-bold">{t(title)}</p>
        </div>
        {btn}
      </div>
    </div>
  )
}

export default HeaderExtraLayout