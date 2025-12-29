import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCreatorCourses } from '../redux/courseSlice.js';

const useGetCreatorCourse = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchCreatorCourses = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/course/getcreatorcourses', {
                    withCredentials: true,
                });
                console.log('Creator Courses Response:', response.data);
                if (response.data) {
                    dispatch(setCreatorCourses(response.data));
                }
            } catch (error) {
                console.log('Error fetching creator courses:', error.response?.data || error.message);
            }
        };
        
        fetchCreatorCourses();
    }, [dispatch]);
};

export default useGetCreatorCourse;
