import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Auth from './pages/Auth';
import Tasks from './pages/Tasks';

const TasksPlaceholder = () => (
  <div className="p-10 text-center">
    <h1 className="text-2xl font-bold">¡Bienvenido al Gestor de Tareas!</h1>
    <p>Aquí cargaremos la lista de tu base de datos de Phalcon.</p>
  </div>
);

function App() {

  const { token } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!token ? <Auth /> : <Navigate to="/tasks" />} />

        <Route path="/tasks" element={token ? <Tasks /> : <Navigate to="/" />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;