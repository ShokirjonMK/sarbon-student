/** @format */

import { IconType } from "react-icons/lib";

export type TypeRoutesSubmenu = {
  name: string;
  path: string;
  component: React.FC | "";
  config: {
    permission: string | "*";
    icon?: IconType;
    structure: "layout" | "nonlayout";
    exact?: boolean; 
    isMenu: boolean;
    extraMenuType?: "menu" | "tab"
  };
};

type a<T> = T & {submenu?: T[]}


type b<T> = T & {submenu?: a<T>[]}

export type TypeRoutes = b<TypeRoutesSubmenu>