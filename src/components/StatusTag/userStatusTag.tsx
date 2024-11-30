import { Tag } from "antd"
import { useTranslation } from "react-i18next";


const UserStatusTag = ({status}:{status: number | undefined | string}) => {

    const { t } = useTranslation();

    return status == 10 ? 
            <Tag color="#52C41A" className="rounded-lg">{t("Active")}</Tag> 
            : status == 5 ?
             <Tag color="#F5222D" className="rounded-lg">{t("Banned")}</Tag>
             : status == 0 ?
              <Tag color="#ffc069" className="rounded-lg">{t("Pending")}</Tag>
              : status == 1 ?
               <Tag color="#F5222D" className="rounded-lg">{t("Deleted")}</Tag> 
               : <span></span>
}
export  default UserStatusTag;