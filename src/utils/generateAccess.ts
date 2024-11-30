/** @format */

export type _type = {
  id: number;
  is_lecture: number;
  language_id: number;
  subject_id: number;
  user_id: number;
};

export type __type = {
  id: number;
  is_leader: number;
  table_id: number;
  user_access_type_id: number;
  user_id: number;
};

// {1:{4:[1,3,4]}}

/**
 * array_teacher_access generate object_teacher_access
 * @param data teacherAccess type (array)
 * @returns /{subject_id: {lang_id: [subject_category_id, ...], ...}, ...}  (object)
 */
export const generateTeacherAccess = (data: _type[]) => {
  const obj: {[key: number]: { [key: number]: number[] }} = {};

  data?.forEach(e => {
    obj[e?.subject_id] = {
      ...( obj ? obj[e?.subject_id] ?? {} : {}),
      [e?.language_id]: [
        ...(obj && obj[e?.subject_id] ? obj[e?.subject_id][e?.language_id] ?? [] : []),
        e?.is_lecture
      ]
    }
  })

  return obj
};


/**
 * array_user_access generate object_user_access
 * @param data userAccess type (array)
 * @returns /{user_access_type_id: "table_id - is_leader", ...}  (object)
 */
export const generateUserAccess = (data: __type[]) => {
  const obj: {[key: number]: string[]} = {};

  data?.forEach(e => {
      obj[e?.user_access_type_id] = [
        ...( obj ? obj[e?.user_access_type_id] ?? [] : []),
        `${e?.table_id}-${e?.is_leader}`
      ];
  })

  return obj;
};
