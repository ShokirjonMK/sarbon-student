import { ThemeConfig } from "antd";

export const antdCustomTheme = (theme: "blue" | "dark" | "light") => {

    const lightTheme :ThemeConfig = {
        token: {
            colorPrimary: "#015965",
            colorPrimaryBg: "#015965",
            colorText: "rgba(0, 0, 0, 0.85)",
            colorTextBase: "rgba(0, 0, 0, 1)",
            colorBgBase: "#fff",
            // colorBgContainer: "transparent",
            fontFamily: "roboto",
            borderRadius: 8,
            borderRadiusSM: 4
        }
    }

    const blueTheme :ThemeConfig = {
        token: {
            colorPrimary: "#015965",
            colorPrimaryBg: "#015965",
            colorText: "#fff",
            colorTextBase: "#fff",
            colorBgBase: "#000",
            colorBgContainer: "transparent",
            fontFamily: "roboto",
            borderRadius: 8,
            borderRadiusSM: 4
        }
    }
    return theme === "blue" ? blueTheme : lightTheme
}