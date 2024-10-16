import axios from 'axios';

const fetchUserData = async (uid) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5001/filmshelf-de256/us-central1/getUserData?uid=${uid}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };
export { fetchUserData };
