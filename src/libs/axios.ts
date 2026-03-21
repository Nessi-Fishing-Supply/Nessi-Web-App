import axios from 'axios';
import useContextStore from '@/features/context/stores/context-store';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const { activeContext } = useContextStore.getState();
  config.headers['X-Nessi-Context'] =
    activeContext.type === 'member' ? 'member' : `shop:${activeContext.shopId}`;
  return config;
});

export default axiosInstance;
