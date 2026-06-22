import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { HomePage } from '@/pages/HomePage/home-page';
import LoginPage from '@/pages/LoginPage/login-page';
import RegisterPage from '@/pages/RegisterPage/register-page';
import DashboardPage from '@/pages/DashboardPage/dashboard-page';
import ProtectedRoute from '@/routes/protected-route';
import MainLayout from '@/layouts/main-layout';
import FarmMapPage from '@/pages/FarmMapPage/farm-map-page';
import TaskPage from '@/pages/TaskPage/task-page';
import ProfilePage from '@/pages/ProfilePage/profile-page';
import NotFoundPage from '@/pages/NotFoundPage/not-found-page';

const CropsPage = () => <div className="text-2xl font-bold">Página Crops</div>;
const ReportsPage = () => <div className="text-2xl font-bold">Página Reports</div>;

function App() {
    return (
        <>
            <Toaster position="top-right" richColors />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/farm-map" element={<FarmMapPage />} />
                        <Route path="/crops" element={<CropsPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/tasks" element={<TaskPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;