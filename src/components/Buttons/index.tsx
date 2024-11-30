import { AddFilled } from "@fluentui/react-icons";
import { Button } from "antd";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { FaRegFileExcel } from "react-icons/fa";
import checkPermission from "utils/checkPermission";

export const CreateBtn: FC <{onClick: React.MouseEventHandler<HTMLAnchorElement> & React.MouseEventHandler<HTMLButtonElement>, permission: string, className?: string}> = ({onClick, permission, className}): JSX.Element => {
  const {t} = useTranslation();

  return (
    checkPermission(permission) ? (
      <Button
        type="primary"
        onClick={onClick}
        className={`${className} rounded-[8px] flex-center`}
      >
        <AddFilled fontSize={13} className="me-2 " />
        {t("Create")}
      </Button>
    ) : <></>
  )
}

export const ExcelBtn: FC <{onClick: React.MouseEventHandler<HTMLButtonElement>}> = ({onClick}): JSX.Element => {
  const {t} = useTranslation();

  return (
      <button
        onClick={onClick}
        className="e-btn bg-[#3569B2] hover:bg-[#295ba1] text-white hover:text-gray-50"
      >
        <FaRegFileExcel size={16} className="me-2" />
        {t("Excel export")}
      </button>
  )
}