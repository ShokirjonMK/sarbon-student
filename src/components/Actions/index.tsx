import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { Eye16Filled, Edit16Filled, Delete16Filled } from '@fluentui/react-icons'
import checkPermission from "utils/checkPermission";
import DeleteData from "components/deleteData";

type TypeActions = {
  id: number,
  url: string,
  onClickView: () => void,
  onClickEdit: () => void,
  viewPermission: string,
  editPermission: string,
  deletePermission: string,
  refetch?: any
}

const Actions: React.FC<TypeActions> = ({ id, url, onClickView, onClickEdit, viewPermission, editPermission, deletePermission, refetch }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="actions" >
        {checkPermission(viewPermission) ? <Tooltip placement="topLeft" title={t("View")}><Eye16Filled className="view" onClick={onClickView} /></Tooltip> : null}
        {checkPermission(editPermission) ? <Tooltip placement="topLeft" title={t("Edit")}><Edit16Filled className="edit" onClick={onClickEdit} /></Tooltip> : null}
        {checkPermission(deletePermission) ?
          <Tooltip placement="left" title={t("Delete")}>
            <DeleteData permission={deletePermission} refetch={refetch} url={url} id={id}><Delete16Filled className="text-[#595959]" /></DeleteData>
          </Tooltip> : null}
      </div>
    </>
  )
}

export default Actions;