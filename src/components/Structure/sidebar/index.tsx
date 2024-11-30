import React, { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { prived_routes, public_routes } from "routes";
import { useAppDispatch, useAppSelector } from "store";
import checkPermission from "utils/checkPermission";
import { Drawer, Menu, MenuProps } from "antd";
import IconComponent from "components/Icon";
import { TypeRoutes } from "routes/types";
import logo from "assets/images/sarbon_wh_logo.svg";
import { useTranslation } from "react-i18next";
import './style.scss';
import { changeSidebar } from "store/ui";
import useWindowSize from "hooks/useWindowSize";

type MenuItem = Required<MenuProps>['items'][number];

const SidebarByAntMenu: FC = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const location = useLocation()
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { auth, ui } = useAppSelector(state => state);
  const { width } = useWindowSize()

  const createMenuItems = (data: TypeRoutes[]) => {
    const items: MenuProps['items'] = [];
    data.forEach(item => {
      const childItems: MenuItem[] = []
      if ((checkPermission(item.config.permission) || item.config.permission === "*") && item.config.isMenu) {
        if (item?.submenu?.length) {
          item.submenu.forEach(childItem => {
            if ((checkPermission(childItem.config.permission) || childItem.config.permission === "*") && childItem.config.isMenu)
              childItems.push({
                key: childItem.path.split("/")[1],
                label: <span className="sidebar-name">{t(childItem?.name)}</span>,
                onClick: () => navigate(childItem.path)
              })
          })
        }
        items.push({
          key: item.path,
          label: <span className="sidebar-name">{t(item?.name)}</span>,
          icon: IconComponent(item?.config?.icon),
          children: childItems.length ? childItems : undefined,
          onClick: () => { !item?.submenu?.length && navigate(item.path); width <= 760 && dispatch(changeSidebar("none")) },
        })
      }
    })
    return items
  }

  const menuItems = React.useMemo(() => {
    if (auth.isAuthenticated) {
      return createMenuItems(prived_routes)
    } else {
      return createMenuItems(public_routes)
    }
  }, [i18n.language, ui.sidebar])

  return (
     width > 760 ? <div className="container-sidebar-ant sidebar-wrapper">
        <div className={`sidebar-logo ${ui.sidebar}`}>
          <img src={logo} alt="" />
        </div>
        <div className="container-menu">
          <Menu
            selectedKeys={[location.pathname, location.pathname.split("/")[1]]}
            defaultOpenKeys={[location.pathname]}
            items={menuItems}
            // theme={ui.theme === "light" ? "light" : "dark"}
            mode="inline"
          />
        </div>
      </div>
      : <Drawer
        title={null}
        open={ui.sidebar === "large"}
        onClose={() => dispatch(changeSidebar("none"))}
        closable={false}
        footer={null}
        placement="left"
        style={{background: "#015965"}}
        drawerStyle={{ padding: 0 }}
        width={256}
        bodyStyle={{ padding: "0 0.5rem" }}
      >
        <div className="sidebar-wrapper">
          <div className={`sidebar-logo`}>
            <img src={logo} alt="" />
          </div>

          <div className="container-menu">
            <Menu
              selectedKeys={[location.pathname, location.pathname.split("/")[1]]}
              defaultOpenKeys={[location.pathname]}
              items={menuItems}
              mode="inline"
            />
          </div>
        </div>
      </Drawer>
  )
}

export default React.memo(SidebarByAntMenu)