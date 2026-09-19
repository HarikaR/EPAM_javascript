import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RootLayout } from './components/Layout/AppShell';
import { AppProvider } from './context/AppContext';
import { CustomerFeedbackPage } from './pages/CustomerFeedback';
import { DashboardPage } from './pages/Dashboard';
import { ProductInsightsPage } from './pages/ProductInsights';
import { ResponsesPage } from './pages/Responses';
import { SettingsPage } from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="responses" element={<ResponsesPage />} />
            <Route path="insights" element={<ProductInsightsPage />} />
            <Route path="feedback" element={<CustomerFeedbackPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
