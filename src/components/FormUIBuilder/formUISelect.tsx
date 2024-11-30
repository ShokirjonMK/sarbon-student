import { FormInstance, Select } from "antd";
import useGetAllData from "hooks/useGetAllData";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cf_filterOption } from "utils/others_functions";

export type TypeFormUISelect = {
  url?: string,
  query_key?: string,
  label?: string,
  name: string,
  value_name?: string,
  parent_name?: string,
  child_names?: string[],
  form: FormInstance<any>,
  disabled?: boolean,
  load?: boolean,
  data?: {id: number, name: string}[],
}

const FormUISelect: FC<TypeFormUISelect> = ({ url = "", query_key, label, name, parent_name, child_names, value_name, form, disabled = false, data: resData, load }): JSX.Element => {
  const { t } = useTranslation();
  
  const { data, isFetching, refetch } = useGetAllData<any>({
    queryKey: [query_key ?? url, ],
    url: `${url?.includes("?") ? url : url + "?sort=-id"}${value_name ? "$expand=" + value_name : ""}${parent_name ? `&filter=${JSON.stringify({ [`${parent_name}`]: form?.getFieldValue(parent_name) })}` : ""}`,
    urlParams: { "per-page": 0 },
    options: {
      enabled: (!resData?.length && (!!parent_name && !!form?.getFieldValue(parent_name)))
    }
  });

  useEffect(() => {
    if(form.getFieldValue(name) || load){
      if(!resData?.length){
        refetch();
      }
    }
  }, []);

  const handleChange = (value: number) => {
    form?.setFieldsValue({ [name]: value })

    if(child_names?.length)
      form?.resetFields(child_names)
  }

  const handleClear = () => {
    form.resetFields([name])

    if(child_names?.length)
      form.resetFields(child_names)
  }

  return (
    <Select
      value={form.getFieldValue(name)}
      disabled={parent_name ? !form?.getFieldValue(parent_name) : disabled ? true : false}
      onChange={handleChange}
      onClear={handleClear}
      onFocus={() => !resData && ( !data?.items?.length && refetch())}
      loading={isFetching}
      placeholder={t(`Select ${label?.toLowerCase()}`) + " ..."}
      allowClear
      showSearch
      filterOption={cf_filterOption}
      className="w-[100%]"
    >
      {
        resData?.length ? resData?.map((item, i) => (
          <Select.Option key={i} value={item?.id} >{item?.name}</Select.Option>
        )) : data?.items?.length ? ( isFetching ? [] : data?.items)?.map((item, i) => (
          <Select.Option key={i} value={item?.id} >{item?.name ?? (item?.last_name + " " + item?.first_name + " " + item?.middle_name)}</Select.Option>
        )) : null
      }
    </Select>
  )
}

export default FormUISelect;