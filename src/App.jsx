import { Routes, Route } from 'react-router-dom';
import { HomePage } from "@/pages/HomePage/HomePage.jsx";
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

const FarmMapPage = () => <div className="text-2xl font-bold">Página Farm Map</div>;
const CropsPage = () => <div className="text-2xl font-bold">Página Crops</div>;
const ReportsPage = () => <div className="text-2xl font-bold">Página Reports</div>;
const ProfilePage = () => <div className="text-2xl font-bold">Página Profile</div>;

function App() {
  /*
   * Agora o App.jsx usa o <Routes> para controlar a navegação.
   * - O 'path="/"' (a raiz do site) vai mostrar sua HomePage.
   * - O 'path="/login"' vai mostrar a LoginPage que criamos.
   */
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rotas Privadas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>

          {/* Nossas rotas filhas */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/farm-map" element={<FarmMapPage />} />
          <Route path="/crops" element={<CropsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Adicione outras rotas privadas aqui... */}
        </Route>
      </Route>

    </Routes>
  );
}

export default App;