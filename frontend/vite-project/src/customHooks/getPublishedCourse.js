import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setPublishedCourses } from '../redux/courseSlice.js';

const useGetPublishedCourse = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchPublishedCourses = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/course/getpublished', {
                    withCredentials: true,
                });
                console.log('Published Courses Response:', response.data);
                if (response.data) {
                    dispatch(setPublishedCourses(response.data));
                }
            } catch (error) {
                console.log('Error fetching published courses:', error.response?.data || error.message);
            }
        };
        
        fetchPublishedCourses();
    }, [dispatch]);
};

export default useGetPublishedCourse;
