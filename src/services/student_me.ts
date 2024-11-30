import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "config/_axios";
import { IStudent } from "models/student";

const GetStudentMe = createAsyncThunk(
  'student/me',
  async (data: { type: string, data?: any } , { rejectWithValue }) => {
    try {
          const url = "students/me?is_main=0&expand=profile,user,country,region,area,permanentCountry,permanentRegion,permanentArea,faculty,direction,group,eduType,eduForm,course,tutor";
          const response = await instance({url, method: "GET"});
          const _data = response.data;
          if (_data?.status === 1) {
              return _data as IStudent;
          } else {
              return rejectWithValue(new Error("Error !"))
          }
      } catch (error: any) {
          return rejectWithValue(error.response);
      }
  }
)

export default GetStudentMe;