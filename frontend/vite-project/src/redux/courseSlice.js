import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
    name: "course",
    initialState: {
        creatorCourses: null,
        allCourses: null,
        publishedCourses: null
    },
    reducers: {
        setCreatorCourses: (state, action) => {
            state.creatorCourses = action.payload      
        },
        setAllCourses: (state, action) => {
            state.allCourses = action.payload
        },
        setPublishedCourses: (state, action) => {
            state.publishedCourses = action.payload
        },
        logout: (state) => {
            state.creatorCourses = null
            state.allCourses = null
            state.publishedCourses = null
        }
    }
})

export const { setCreatorCourses, setAllCourses, setPublishedCourses, logout } = courseSlice.actions
export default courseSlice.reducer