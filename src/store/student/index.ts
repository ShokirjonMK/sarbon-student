import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IStudent } from 'models/student';
import GetStudentMe from 'services/student_me';


export type TypeInitialStateAuth = {
    data ?: IStudent | null,
    error?: string,
    message?: string,
    isLoading?: boolean,
}

const initialState: TypeInitialStateAuth = {
    data: null,
    error: '',
    message: '',
    isLoading: false,
}


const StudentMe = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(GetStudentMe.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true
            })
            .addCase(GetStudentMe.fulfilled, (state, action: PayloadAction<any>) => {
                if (action.payload && action?.payload?.status === 1) {
                    state.data = action.payload.data
                    state.message = action.payload.message
                    state.isLoading = false
                } else {
                    state.isLoading = false
                }
            })
            .addCase(GetStudentMe.rejected, (state, action: PayloadAction<any>) => {
                if (action?.payload?.data?.status === 0) {
                    state.error = action.payload.data?.message
                    state.isLoading = false
                } else {
                    state.error = 'disconnect'
                    state.isLoading = false
                }
            })
    }
})

export default StudentMe.reducer;


