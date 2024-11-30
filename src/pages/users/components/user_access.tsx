import React, { useEffect, useState } from "react";
import { Button, Col, Form, message, Row, Select, Switch, Table } from "antd";
import { cf_filterOption } from "utils/others_functions";
import useGetAllData from "hooks/useGetAllData";
import { AddFilled, DeleteFilled } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { ColumnsType } from "antd/es/table";
import { IDepartment, IFaculty, IKafedra } from "models/edu_structure";

type TypeUserAccessData = {
  user_access_type_id: number | string
  department_id: number | string
  is_leader: number | string
}

type TypeUserAccess = {
  userAccess: Record<string, string[]>,
  setUserAccess: React.Dispatch<React.SetStateAction<Record<string, string[]>>>,
  edit?: boolean
}

const UserAccess: React.FC<TypeUserAccess> = ({ userAccess, setUserAccess, edit }): JSX.Element => {
  const [_form] = Form.useForm();
  const { t } = useTranslation();
  const [user_access_type_id, setUserAccessTypeId] = useState<string>()

  const { data: access_types, refetch: access_types_fetch } = useGetAllData({ queryKey: ['/user-access-types'], url: '/user-access-types', urlParams: { "per-page": 0 } });
  const { data: faculties, refetch: faculties_fetch } = useGetAllData<IFaculty>({ queryKey: ['faculties'], url: "faculties", urlParams: { "per-page": 0 } });
  const { data: kafedra, refetch: kafedra_fetch } = useGetAllData<IKafedra>({ queryKey: ['kafedras'], url: "kafedras", urlParams: { "per-page": 0 } });
  const { data: department, refetch: department_fetch } = useGetAllData<IDepartment>({ queryKey: ['departments'], url: "departments", urlParams: { "per-page": 0 } });

  const selectItem = (id: string) => {
    switch (id) {
      case '1': return faculties?.items ?? []
      case '2': return kafedra?.items ?? []
      case '3': return department?.items ?? []
    }
  }

  const getName = (id: number, type?: number): string => {
    if (!type) return access_types?.items?.find(item => item?.id === id)?.name ?? ""
    if (type === 1) return faculties?.items?.find(item => item?.id === id)?.name ?? "";
    if (type === 2) return kafedra?.items?.find(item => item?.id === id)?.name ?? ""
    if (type === 3) return department?.items?.find(item => item?.id === id)?.name ?? ""
    return "";
  };

  // {1:["34:1", "12-0"]}

  const addUserAccess = () => {
    const user_access_type = _form.getFieldValue("user_access_type");
    const department = _form.getFieldValue("department");
    const is_leader = _form.getFieldValue("is_leader");

    if (!user_access_type) return message.warning("tarkibiy bo'lim turini tanlang!");
    if (!department) return message.warning("Bo'limni tanlang!");

    setUserAccess(p => {
      let obj = { ...(p ?? {}) };
      const access_type = [...(obj[user_access_type] ?? [])];

      if (access_type?.toString()?.split("-", 1).includes(department.toString())) {
        message.warning("Avval kiritilgan")
      } else {
        access_type.push(`${department}-${is_leader ? 1 : 0}`);
        obj[user_access_type] = access_type
      }
      return obj;
    });
    _form.resetFields();
  };

  const removeUserAccess = (access_type: number | string, department: number | string, is_leader: number | string) => {
    setUserAccess(p => p ? { ...p, [access_type]: p[access_type]?.filter(e => e !== `${department}-${is_leader}`) } : {});
  };

  const data = () => {
    const arr: any = [];

    Object.entries(userAccess ?? {})?.forEach(([key, value]) => {
      value?.forEach(e => {
        arr.push({
          user_access_type_id: key,
          department_id: e.split("-")[0],
          is_leader: e.split("-")[1]
        })
      })
    })

    return arr
  }

  const columns: ColumnsType<TypeUserAccessData> = [
    {
      title: "№",
      key: "order",
      render: (_, __, i) => i + 1,
      width: 40,
    },
    {
      title: t("Structural structure"),
      key: "type",
      render: (i, e) => getName(Number(e.user_access_type_id)),
    },
    {
      title: t("Division"),
      key: "dep",
      render: (i, e) => getName(Number(e.department_id), Number(e.user_access_type_id)),
    },
    {
      title: t("Position"),
      dataIndex: "is_leader",
      key: "lead",
      render: e => Number(e) ? "Boshliq" : "Xodim",
    },
    ...(edit ? [
      {
        title: t("Action"),
        key: "action",
        render: (i, e) => <div className="d-flex justify-content-center aligin-items-center">
          <DeleteFilled
            onClick={() => removeUserAccess(e.user_access_type_id, e.department_id, e.is_leader)}
            style={{ cursor: "pointer" }}
            className="text-danger"
            fontSize={18}
          />
        </div>,
        width: 60,
        align: "center"
      }
    ] as ColumnsType<TypeUserAccessData> : [])
  ]

  return (
    <div>
      {
        edit ? <Form
          form={_form}
          layout="vertical"
        >
          <Row gutter={[12, 12]} >
            <Col xs={24} sm={24} md={24} lg={7} xl={7} >
              <Form.Item
                name={`user_access_type`}
                label={t`Structural structure`}
              >
                <Select
                  showSearch
                  allowClear
                  className="w-full"
                  placeholder={t("Select userAccess")}
                  filterOption={cf_filterOption}
                  onChange={(e) => setUserAccessTypeId(e)}
                  onFocus={() => !access_types?.items?.length && access_types_fetch}
                  onClear={() => {_form.resetFields(["department"])}}
                >
                  {access_types?.items?.length ?
                    access_types?.items?.map((item, i) => (
                      <Select.Option key={i} value={item.id}>{item.name}</Select.Option>
                    )) : null}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={24} xs={24} md={24} lg={7}>
              <Form.Item
                name={`department`}
                label={t`Division`}
              >
                <Select
                  allowClear
                  className="w-full"
                  placeholder={t("Select department")}
                  filterOption={cf_filterOption}
                  disabled={!user_access_type_id}
                // onFocus={() => !languages?.items?.length && langFetch()}
                >
                  {selectItem(String(user_access_type_id))?.length ? selectItem(String(user_access_type_id))?.map((item, i) => (
                    <Select.Option key={i} value={item.id}>{item.name}</Select.Option>
                  )) : null}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={20} xs={20} md={20} lg={7}>
              <Form.Item
                name={`is_leader`}
                label={t`Employee or leader`}
                valuePropName="checked"
              >
                <Switch checkedChildren="Boshliq" unCheckedChildren="Xodim" />
                {/* <Select
                  allowClear
                  className="w-full"
                  placeholder={t("Employee or leader")}
                >
                  <Select.Option value="0" >Xodim</Select.Option>
                  <Select.Option value="1" >Boshliq</Select.Option>
                </Select> */}
              </Form.Item>
            </Col>
            <Col sm={4} xs={4} md={4} lg={3} className="pt-[30px] flex justify-end">
              <Button className="ms-5 flex-center px-4" type="primary"
                onClick={() => addUserAccess()}
              ><AddFilled /></Button>
            </Col>
          </Row>
        </Form> : ""
      }
      <Col span={24}>
        <Table
          dataSource={data()}
          columns={columns}
          size="small"
          pagination={false}
        />
      </Col>
    </div>
  )

}



export default UserAccess;