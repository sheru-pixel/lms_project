import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const useGetCurrentUser = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/current', {
                    withCredentials: true,
                });
                console.log('Current User Response:', response);
                if (response.data && response.data.user) {
                    console.log('Current User:', response.data.user);
                    dispatch(setUserData(response.data.user));
                }
            } catch {
                console.log('User not logged in or session expired');
                // User is not logged in - silently fail
            }
        };
        
        fetchCurrentUser();
    }, [dispatch]);
};

export default useGetCurrentUser;