import axios from 'axios';
import config from '@/config/API';

export default axios.create({ ...config, withCredentials: true });
