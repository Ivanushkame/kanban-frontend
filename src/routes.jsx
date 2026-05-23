import { Routes, Route } from 'react-router-dom';

import ProjectsPage from './pages/ProjectsPage.jsx';
import BoardPage from './pages/BoardPage.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProjectsPage />} />
      <Route path="/project/:id" element={<BoardPage />} />
    </Routes>
  );
}

export default AppRoutes;