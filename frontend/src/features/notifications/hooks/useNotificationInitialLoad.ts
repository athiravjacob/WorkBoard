import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNotificationStore } from '../store/useNotificationStore';

/**
 * Headless hook responsible ONLY for the initial data fetch of notifications.
 * Decouples fetching logic from real-time socket management (SRP).
 */
export const useNotificationInitialLoad = () => {
  const fetchInitialData = useNotificationStore((state) => state.fetchInitialData);
  const { pathname } = useLocation();

  const isAuthPage = ['/login', '/register'].includes(pathname);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isAuthPage) return;

    fetchInitialData();
  }, [fetchInitialData, isAuthPage]);
};
