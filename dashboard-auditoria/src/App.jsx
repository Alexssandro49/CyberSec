import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute'; // Importe o novo componente
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Empresas from './components/Empresas';
import Avaliacao from './components/Avaliacao';
import Relatorio from './components/Relatorio';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Rotas Protegidas */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="empresas" element={<Empresas />} />
          <Route path="avaliacao/:id_empresa/modulo/:id_modulo" element={<Avaliacao />} />
          <Route path="relatorio/:id_empresa/modulo/:id_modulo" element={<Relatorio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}