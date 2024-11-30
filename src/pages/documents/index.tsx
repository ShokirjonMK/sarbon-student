import { ColumnsType } from 'antd/es/table';
import {Table} from "antd";
import HeaderExtraLayout from 'components/HeaderPage/headerExtraLayout';
import React from 'react'
import { useTranslation } from 'react-i18next';

const Documents : React.FC = () : JSX.Element => {
  const {t} = useTranslation();

  const subject_columns: ColumnsType<any> = React.useMemo(
    () => [
      {
        title: "№",
        dataIndex: "order",
        render: (_, __, i) => i + 1,
        width: 45,
      },
      {
        title: t("Document name"),
        dataIndex: "",
        align: "center",
      },
      {
        title: t("Type"),
        dataIndex: "",
        align: "center",
      },
      {
        title: t("Date"),
        dataIndex: "",
        align: "center",
      },
    ],
    []
  );

  return(
    <div>
    <HeaderExtraLayout title='Documents' breadCrumbData={[
        {
          name: "Home",
          path: "/"
        },
        {
          name: "Documents",
          path: "/documents"
        },
      ]}
      />
      <div className="px-6 pt-3 max-md:px-2">
        <Table
          columns={subject_columns}
          dataSource={[]}
          pagination={false}
          loading={false}
          size="middle"
          className="mt-3"
          rowClassName="py-[12px]"
          scroll={{ x: 576 }}
        />
      </div>
    </div>
  )
}

export default Documents