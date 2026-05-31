import { useEffect, useState } from 'react';
import api from '../api/api';

import {
  DragDropContext,
  Droppable,
  Draggable,
} from '@hello-pangea/dnd';

function BoardPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedAssignee, setSelectedAssignee] =
    useState('');

  const [newTaskTitle, setNewTaskTitle] =
    useState('');
  const [newTaskDescription, setNewTaskDescription] =
    useState('');
  const [newTaskAssignee, setNewTaskAssignee] =
    useState('');
  const [newTaskDueDate, setNewTaskDueDate] =
    useState('');
  const [newTaskStatus, setNewTaskStatus] =
    useState('backlog');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
    }
  };

  const columns = {
    backlog: 'Бэклог',
    in_progress: 'В работе',
    review: 'На проверке',
    done: 'Готово',
  };

  const isOverdue = (date) => {
    return new Date(date) < new Date();
  };

  const assignees = [
    ...new Set(tasks.map((task) => task.assignee)),
  ];

  const handleDragEnd = async (result) => {
  if (!result.destination) return;

  const taskId = parseInt(
    result.draggableId
  );

  const newStatus =
    result.destination.droppableId;

  try {
    await api.patch(
      `/tasks/${taskId}/status`,
      {
        status: newStatus,
      }
    );

    await fetchTasks();
  } catch (error) {
    console.error(
      'Ошибка обновления статуса:',
      error
    );
  }
};

  const createTask = async () => {
  if (!newTaskTitle) return;

  try {
    await api.post('/tasks', {
      title: newTaskTitle,
      description: newTaskDescription,
      assignee: newTaskAssignee,
      due_date: newTaskDueDate,
      status: newTaskStatus,
      project_id: 1,
    });

    await fetchTasks();

    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskAssignee('');
    setNewTaskDueDate('');
    setNewTaskStatus('backlog');
  } catch (error) {
    console.error(
      'Ошибка создания задачи:',
      error
    );
  }
};
  return (
    <div
      style={{
        padding: '20px',
        background: '#f4f5f7',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ marginBottom: '20px' }}>
        Kanban Board
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <select
          value={selectedAssignee}
          onChange={(e) =>
            setSelectedAssignee(e.target.value)
          }
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        >
          <option value="">
            Все исполнители
          </option>

          {assignees.map((assignee) => (
            <option
              key={assignee}
              value={assignee}
            >
              {assignee}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          maxWidth: '500px',
        }}
      >
        <h2>Создать задачу</h2>

        <input
          type="text"
          placeholder="Название задачи"
          value={newTaskTitle}
          onChange={(e) =>
            setNewTaskTitle(e.target.value)
          }
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '10px',
            marginBottom: '10px',
          }}
        />

        <textarea
          placeholder="Описание"
          value={newTaskDescription}
          onChange={(e) =>
            setNewTaskDescription(e.target.value)
          }
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
          }}
        />

        <input
          type="text"
          placeholder="Исполнитель"
          value={newTaskAssignee}
          onChange={(e) =>
            setNewTaskAssignee(e.target.value)
          }
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
          }}
        />

        <input
          type="date"
          value={newTaskDueDate}
          onChange={(e) =>
            setNewTaskDueDate(e.target.value)
          }
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
          }}
        />

        <select
          value={newTaskStatus}
          onChange={(e) =>
            setNewTaskStatus(e.target.value)
          }
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          <option value="backlog">
            Бэклог
          </option>

          <option value="in_progress">
            В работе
          </option>

          <option value="review">
            На проверке
          </option>

          <option value="done">
            Готово
          </option>
        </select>

        <button
          onClick={createTask}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
          }}
        >
          Создать задачу
        </button>
      </div>

      <DragDropContext
        onDragEnd={handleDragEnd}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(4, 1fr)',
            gap: '20px',
          }}
        >
          {Object.entries(columns).map(
            ([status, title]) => (
              <Droppable
                droppableId={status}
                key={status}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      background: '#e9ecef',
                      padding: '15px',
                      borderRadius: '10px',
                      minHeight: '500px',
                    }}
                  >
                    <h2
                      style={{
                        marginBottom: '15px',
                      }}
                    >
                      {title}
                    </h2>

                    {tasks
                      .filter(
                        (task) =>
                          task.status === status
                      )
                      .filter((task) =>
                        selectedAssignee
                          ? task.assignee ===
                            selectedAssignee
                          : true
                      )
                      .map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={
                                provided.innerRef
                              }
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                background:
                                  isOverdue(
                                    task.due_date
                                  )
                                    ? '#ffdddd'
                                    : 'white',
                                padding: '15px',
                                borderRadius:
                                  '8px',
                                marginBottom:
                                  '10px',
                                boxShadow:
                                  '0 2px 5px rgba(0,0,0,0.1)',
                                border:
                                  isOverdue(
                                    task.due_date
                                  )
                                    ? '2px solid red'
                                    : 'none',
                                ...provided
                                  .draggableProps
                                  .style,
                              }}
                            >
                              <h3>
                                {task.title}
                              </h3>

                              <p
                                style={{
                                  marginTop:
                                    '10px',
                                }}
                              >
                                {
                                  task.description
                                }
                              </p>

                              <p
                                style={{
                                  marginTop:
                                    '10px',
                                }}
                              >
                                Исполнитель:{' '}
                                {
                                  task.assignee
                                }
                              </p>

                              <p
                                style={{
                                  marginTop:
                                    '10px',
                                }}
                              >
                                Срок:{' '}
                                {
                                  task.due_date
                                }
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )
          )}
        </div>
      </DragDropContext>
    </div>
  );
}

export default BoardPage;