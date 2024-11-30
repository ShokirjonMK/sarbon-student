import React from 'react'
import { Input } from "antd"
import useDebounce from "hooks/useDebounce"
import useUrlQueryParams from 'hooks/useUrlQueryParams';
import { useTranslation } from 'react-i18next';

const SearchInputWithoutIcon = ({ setSearchVal, duration = 1000, filterKey, placeholder = "Search" }: { setSearchVal: React.Dispatch<string>, duration?: number, filterKey: string, placeholder?: string }) => {

    const {t} = useTranslation()

    const { urlValue, writeToUrl } = useUrlQueryParams({ currentPage: 1, perPage: 9 });

    const debounse = useDebounce(urlValue.filter_like[filterKey], duration)
    
    React.useEffect(() => {
        setSearchVal(debounse)
    }, [debounse])

    return <Input value={urlValue.filter_like[filterKey]} className="w-[180px] h-[32px]" placeholder={`${t(placeholder)}...`} onChange={(e) => writeToUrl({ name: filterKey, value: e.target.value })}  allowClear/>

}

export default SearchInputWithoutIcon;