import { Col, Select } from "antd";
import useGetAllData from "hooks/useGetAllData";
import useUrlQueryParams from "hooks/useUrlQueryParams";
import { FC, useEffect } from "react";
import { cf_filterOption, generateAntdColSpan } from "utils/others_functions";
import checkPermission from "utils/checkPermission";
import { t } from "i18next";

export type TypeFilterSelect = {
  url: string,
  query_key?: string
  label: string,
  name: string,
  permission: string,
  value_name?: string,
  parent_name?: string,
  child_names?: string[],
  span?: { xs?: number, sm?: number, md?: number, lg?: number, xl?: number, xxl?: number } | number,
}

const FilterSelect: FC<TypeFilterSelect> = ({ url, query_key, label, name, permission, parent_name, child_names, span, value_name }): JSX.Element => {
  const { urlValue: value, writeToUrl } = useUrlQueryParams({});

  const { data, isFetching, refetch } = useGetAllData({
    queryKey: [ query_key ?? url, value.filter[parent_name ? parent_name : ""]],
    url: `${url.includes("?") ? url : url + "?sort=-id"}${value_name ? "&expand=" + value_name : ""}${parent_name ? `&filter=${JSON.stringify({ [`${parent_name}`]: value.filter[parent_name] })}` : ""}`,
    urlParams: { "per-page": 0 },
    options: {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: false
    }
  })

  useEffect(() => {
    if(value.filter[name]){
      refetch();
    }
  }, []);

  const handleChange = (value: number) => {
    writeToUrl({ name, value, items: data?.items });
    child_names?.forEach(e => {
      writeToUrl({ name: e, value: '', items: [] });
    })
  }

  const handleClear = () => {
    writeToUrl({ name, value: '', items: [] });
    child_names?.forEach(e => {
      writeToUrl({ name: e, value: '', items: [] });
    })
  }

  return (
    checkPermission(permission) ?
      <Col {...generateAntdColSpan(span)}>
        <Select
          className="w-[100%]"
          placeholder={`${t(`Filter by ${label.toLowerCase()}`)}`}
          allowClear
          disabled={parent_name ? !value.filter[parent_name] : false}
          value={value.filter[name]}
          onChange={handleChange}
          onClear={handleClear}
          onFocus={() => !data?.items?.length && refetch()}
          showSearch
          filterOption={cf_filterOption}
          loading={isFetching}
        >
          {
            data?.items?.length ? data.items.map((element: any) => !value_name ?
              <Select.Option key={element.id} value={element.id}>{element?.name}</Select.Option>
              : <Select.Option key={element.id} value={element[`${value_name.toLowerCase()}_id`]}>{element[value_name]?.name}</Select.Option>
            ) : value.item[name] ? [value.item[name]]?.map((element) => <Select.Option key={element.id} value={element.id}>{element.name}</Select.Option>) : null
          }
        </Select>
      </Col>
      : <></>
  )
}

export default FilterSelect;