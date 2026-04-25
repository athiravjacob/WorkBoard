import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppRoutes } from  './routes/AppRoutes';
import { useNotificationSocket } from './features/notifications/hooks/useNotificationSocket';
import { useNotificationInitialLoad } from './features/notifications/hooks/useNotificationInitialLoad';

const AppContent = () => {
  // Initialize notification socket listener and initial data load
  useNotificationInitialLoad();
  useNotificationSocket();

  return (
    <>
      <Toaster position="top-right" richColors closeButton /> 
      <AppRoutes />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;