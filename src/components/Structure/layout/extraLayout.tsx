import { Menu, MenuProps, Tabs, TabsProps } from "antd";
import HeaderExtraLayout from "components/HeaderPage/headerExtraLayout";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeRoutesSubmenu } from "routes/types";
import "./style.scss";

const ExtraLayout: FC<{ children: React.ReactNode, menus:TypeRoutesSubmenu[] | undefined, title: string, type: "menu" | "tab" | undefined }> = ({ children, menus, title, type = "menu" }): JSX.Element => {

    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const items: MenuProps['items'] = menus?.map(item => {
        return {
            key: item.path,
            label: <Link to={item?.path} className="sidebar-name">{t(item?.name)}</Link>,
        }
    })

    const itemsTab: TabsProps['items'] = menus?.map(item => {
        return {
            key: item.path,
            label: <p onClick={() => navigate(item?.path)} className="sidebar-name">{t(item?.name)}</p>,
        }
    })

    return (
        <div className="extra-layout" >
            <HeaderExtraLayout
                breadCrumbData={[
                    {name: "Home", path: "/"},
                    {name: title, path: "/"},
                ]}
                title={t(title)}
                menuType={type}
            />

            {
                type == "menu" ?
                <div className="flex ">
                    <div className="p-[24px] pr-[16px] min-h-[85vh]" style={{borderRight: "1px solid #F0F0F0", width:"max-content"}}>
                        <p className="font-medium text-[16px] mt-0 mb-[16px]">{t("Categories")}</p>
                        <Menu
                            style={{ width: 246 }}
                            selectedKeys={[location.pathname]}
                            defaultOpenKeys={[location.pathname]}
                            mode="inline"
                            items={items}
                        />
                    </div>
                    <div className="px-[24px] pt-[20px] w-[100%]" >
                        {children}
                    </div>
                </div> :
                <>
                    <Tabs tabBarStyle={{paddingLeft:"24px", background: 'var(--v-bg)'}} activeKey={location.pathname} defaultActiveKey={location.pathname} size="middle" items={itemsTab} />
                    <div className="px-[24px] pt-[0px] w-[100%]" >
                        {children}
                    </div>
                </>
            }

        </div>
    )
}
export default ExtraLayout;