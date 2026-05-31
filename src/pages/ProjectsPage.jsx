console.log('NEW PROJECTS PAGE');

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] =
    useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
    }
  };

  const createProject = async () => {
  if (!newProjectName) return;

  try {
    await api.post('/projects', {
      name: newProjectName,
      description: newProjectDescription,
    });

    fetchProjects();

    setNewProjectName('');
    setNewProjectDescription('');
  } catch (error) {
    console.error(
      'Ошибка создания проекта:',
      error.response?.data || error
    );
  }
};

  const deleteProject = (id) => {
    setProjects(
      projects.filter((project) => project.id !== id)
    );
  };

  return (
    <div
      style={{
        padding: '40px',
        background: '#f4f5f7',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ marginBottom: '20px' }}>
        Kanban Projects
      </h1>

      <div
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          maxWidth: '400px',
        }}
      >
        <h2>Создать проект</h2>

        <input
          type="text"
          placeholder="Название проекта"
          value={newProjectName}
          onChange={(e) =>
            setNewProjectName(e.target.value)
          }
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '10px',
            marginBottom: '10px',
          }}
        />

        <textarea
          placeholder="Описание проекта"
          value={newProjectDescription}
          onChange={(e) =>
            setNewProjectDescription(e.target.value)
          }
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
          }}
        />

        <button
          onClick={createProject}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
          }}
        >
          Создать
        </button>
      </div>

      {projects.length === 0 ? (
        <p>Проектов пока нет</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: '15px',
          }}
        >
          {projects.map((project) => (
            <div
  key={project.id}
  style={{
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
    maxWidth: '400px',
  }}
>
  <h2>{project.name}</h2>

  <p style={{ marginTop: '10px' }}>
    {project.description}
  </p>

  <div
    style={{
      marginTop: '15px',
      display: 'flex',
      gap: '10px',
    }}
  >
    <Link to={`/project/${project.id}`}>
      <button
        style={{
          padding: '8px 12px',
          cursor: 'pointer',
        }}
      >
        Открыть доску
      </button>
    </Link>

    <button
      onClick={() => deleteProject(project.id)}
      style={{
        padding: '8px 12px',
        cursor: 'pointer',
      }}
    >
      Удалить
    </button>
  </div>
</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;