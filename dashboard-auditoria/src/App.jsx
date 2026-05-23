import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Empresas from './components/Empresas';
import Avaliacao from './components/Avaliacao'; // <-- Importe o novo componente
import Relatorio from './components/Relatorio';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/empresas" element={<Empresas />} />
          
          {/* Rota dinâmica para o questionário */}
          <Route path="/avaliacao/:id_empresa/modulo/:id_modulo" element={<Avaliacao />} /> 
          {/* Caminho atualizado para exigir o ID da Empresa e o ID do Módulo */}
          <Route path="/relatorio/:id_empresa/modulo/:id_modulo" element={<Relatorio />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}