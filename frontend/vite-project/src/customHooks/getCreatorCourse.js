import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCreatorCourses } from '../redux/courseSlice.js';

const useGetCreatorCourse = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const courses = useSelector((state) => state.course.creatorCourses) || [];
    
    const fetchCreatorCourses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/api/course/getcreatorcourses', {
                withCredentials: true,
            });
            console.log('Creator Courses Response:', response.data);
            dispatch(setCreatorCourses(response.data || []));
        } catch (error) {
            console.log('Error fetching creator courses:', error.response?.data || error.message);
            dispatch(setCreatorCourses([]));
        } finally {
            setLoading(false);
        }
    }, [dispatch]);
    
    useEffect(() => {
        fetchCreatorCourses();
    }, [fetchCreatorCourses]);

    return { courses, loading, refetch: fetchCreatorCourses };
};

export default useGetCreatorCourse;
