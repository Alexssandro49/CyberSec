import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const usuario = localStorage.getItem('usuario');
  
  // Se não houver usuário logado, manda pro login
  return usuario ? children : <Navigate to="/" />;
}