import { Routes, Route } from 'react-router-dom';
import { HomePage } from "@/pages/HomePage/HomePage.jsx";
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import FarmMapPage from './pages/FarmMapPage/FarmMapPage'
import TaskPage from './pages/TaskPage/TaskPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';

const CropsPage = () => <div className="text-2xl font-bold">Página Crops</div>;
const ReportsPage = () => <div className="text-2xl font-bold">Página Reports</div>;

function App() {

  return (
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

        </Route>
      </Route>

    </Routes>
  );
}

export default App;