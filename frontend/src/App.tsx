import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppRoutes } from  './routes/AppRoutes';
import { useNotificationSocket } from './features/notifications/hooks/useNotificationSocket';

const AppContent = () => {
  // Initialize notification socket listener
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