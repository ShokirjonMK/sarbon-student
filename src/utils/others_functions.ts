/** @format */

import store from "store";

//  amtd select search
export const cf_filterOption = (input: string, option: any) => {
  return (
    String(option?.children)
      .toLowerCase()
      .indexOf(String(input).toLowerCase()) >= 0
  );
};

/**
 * check the role from the user's role list
 * @param role role_name (string)
 * @returns true or false (boolean)
 */
export const checkRole = (role: string) => {
  const roles = store.getState().auth?.user?.role;

  if (roles?.length && role) return roles.includes(role);
  return false;
};

// generate antd Col span
export const generateAntdColSpan = (span: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number; xxl?: number } | undefined) => {
  if (typeof span === "number") return { span };

  let initialSpan: any = { xs: 24, sm: 24, md: 12, lg: 8, xl: 6 };
  if (span) {
    Object.entries(span)?.forEach(([key, value]) => {
      initialSpan = { ...initialSpan, [key]: value };
    });
  }
  return initialSpan;
};

/**
 * check the role from the user's role list
 * @param seconds secund (number)
 * @returns secund => HH:mm:ss format (string)
 */
export const toHHmmss = (second: number) => {
  const date = (new Date(second * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/);

  if(date?.length) return date[0];
  else return "00:00:00"

  // const date = new Date(second * 1000);

  // // Toshkent vaqt zonasiga mos holda vaqtni formatlash
  // const formattedTime = new Intl.DateTimeFormat('en-US', {
  //   timeZone: 'Asia/Tashkent',
  //   hour: '2-digit',
  //   minute: '2-digit',
  //   second: '2-digit',
  //   hour12: false, // 24 soat formatda olish uchun
  // }).format(date);

  // return formattedTime;


}


export const toToshkentTimeInSeconds = (isoString: string) => {
  const date = new Date(isoString);

  // Toshkent vaqti zonasi uchun offset (O'zbekiston UTC +5)
  const toshkentOffset = 5 * 60; // minutlarda

  // Brauzerning mahalliy vaqt zonasi offseti (daqiqalarda)
  const localOffset = date.getTimezoneOffset();

  // UTC dan Toshkent vaqtiga o'tkazish
  const toshkentTimeInMs = date.getTime() + (localOffset - toshkentOffset) * 60 * 1000;

  // Sekundlarga o'tkazish
  const toshkentTimeInSeconds = Math.floor(toshkentTimeInMs / 1000);

  return toshkentTimeInSeconds;
};

// Misol uchun
// const isoDate = '2024-10-11T21:58:18.5013839';
// console.log(toToshkentTimeInSeconds(isoDate));