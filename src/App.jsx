import { Routes, Route } from 'react-router-dom';
import { HomePage } from "@/pages/HomePage/HomePage.jsx";
import LoginPage from './pages/LoginPage/LoginPage'; // Vamos assumir que está em 'src/pages/LoginPage.jsx'

function App() {
  /*
   * Agora o App.jsx usa o <Routes> para controlar a navegação.
   * - O 'path="/"' (a raiz do site) vai mostrar sua HomePage.
   * - O 'path="/login"' vai mostrar a LoginPage que criamos.
   */
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* Você pode adicionar mais rotas aqui, ex: <Route path="/register" element={<RegisterPage />} /> */}
    </Routes>
  );
}

export default App;