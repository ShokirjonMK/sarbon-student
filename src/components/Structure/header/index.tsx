import React, { FC } from "react";
import { TextAlignRight24Filled, TextAlignLeft24Filled, PersonSettings20Regular, ArrowExit20Filled } from '@fluentui/react-icons'
import { changeSidebar } from "store/ui";
import { useAppDispatch, useAppSelector } from "store";
import LanguageDropdown from "components/Structure/header/components/Languages";
import { Button, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import { logout } from "store/auth";
import userIcon from 'assets/images/user.svg'
import "./style.scss";
import { t } from "i18next";
import { FILE_URL } from "config/utils/index - Copy";
import NotificationDropDown from "./components/notificationDropDown";
import AllowFullScreenButton from "./components/fullscreenButton";

const Header: FC = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { ui, auth } = useAppSelector(state => state);  

  const selectTheme = React.useMemo(() => {
    if (ui.sidebar === "large") return "none";
    // if (ui.sidebar === "small") return "large";
    if (ui.sidebar === "none") return "large";
    return "large"
  }, [ui.sidebar]);

  const items = [
    { label: <span>{t("Profile")}</span>, key: 1, icon: <PersonSettings20Regular />, onClick: () => { navigate("/my-information") } },
    { label: `${t("Logout")}`, key: 2, icon: <ArrowExit20Filled />, onClick: () => { dispatch(logout()) } }
  ]

  const isSmallScreen = window.innerWidth <= 428;

  return (
    <div className="header-wrapper">
      <div className="left">
        <span className="burger" onClick={() => dispatch(changeSidebar(selectTheme))}>
          {
            ui.sidebar === "small" ? <div className="header-btn px-2"><TextAlignLeft24Filled className="burger" /></div>
              : <div className="header-btn px-2"><TextAlignRight24Filled className="burger" /></div>
          }
        </span>
      </div>
      <div className="right">
        {/* <DarkMode ui={ui} dispatch={dispatch}/> */}
        <AllowFullScreenButton />
        <NotificationDropDown />
        <LanguageDropdown />
        <div className="profile flex-between">
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button type="text" className="flex items-center px-[2px] pl-[2px] pr-[12px] rounded-full" style={{height: "min-content"}}>
              {
                auth.user?.profile?.image?.length ?
                <img src={`${FILE_URL}${auth.user?.profile?.image}`} alt="student image"  className="w-[32px] h-[32px] mr-[6px] rounded-[50%]"/>
                : <img src={userIcon} className="inline-block mr-[6px] rounded-full cursor-pointer" alt="" />
              }
              <div className="text-left">
                <p className="font-medium text-[14px] mb-0 leading-[15px]">{auth.user?.first_name} {isSmallScreen ? auth.user?.last_name?.charAt(0) : auth.user?.last_name}.</p>
                <p className="opacity-50 text-[12px] leading-[12px]">{auth.user?.role}</p>
              </div>
            </Button>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Header);