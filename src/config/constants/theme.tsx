import { ThemeConfig } from "antd";

export const antdCustomTheme = (theme: "blue" | "dark" | "light") => {

    const lightTheme :ThemeConfig = {
        token: {
            colorPrimary: "#2F54EB",
            colorPrimaryBg: "#D6E4FF",
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
            colorPrimary: "#2F54EB",
            colorPrimaryBg: "#D6E4FF",
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