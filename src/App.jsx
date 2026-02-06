import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Auth from './pages/Auth';
import Tasks from './pages/Tasks';

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