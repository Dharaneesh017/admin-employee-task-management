import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const EmployeeDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/tasks/${id}`, { status }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchTasks();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple Header */}
      <nav className="bg-blue-600 p-8 text-white flex justify-between items-center shadow-lg">
        <h1 className="text-3xl font-extrabold tracking-tight">Employee Dashboard | Task Management System</h1>
        <div className="flex items-center gap-12">
          <button onClick={logout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-extrabold text-lg transition-colors">
            <LogOut size={22} /> Sign out
          </button>
        </div>
      </nav>

      <main className="p-12 w-full max-w-[96%] mx-auto">
        <h2 className="text-4xl font-extrabold mb-10 text-gray-800">My Assigned Tasks</h2>

        {loading ? (
          <div className="text-center py-10">Loading assignments...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map(task => (
              <div key={task._id} className="bg-white p-6 rounded shadow border">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-blue-700">{task.title}</h3>
                  <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold text-white ${task.status === 'completed' ? 'bg-green-500' : task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'}`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded min-h-[60px]">{task.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t text-xs">
                  <p className="text-gray-500 font-bold uppercase">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  {task.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(task._id, 'in-progress')}
                      className="bg-blue-600 text-white text-xs px-4 py-2 rounded shadow hover:bg-blue-700 w-full font-bold"
                    >
                      Start Task
                    </button>
                  )}
                  {task.status === 'in-progress' && (
                    <button
                      onClick={() => updateStatus(task._id, 'completed')}
                      className="bg-green-600 text-white text-xs px-4 py-2 rounded shadow hover:bg-green-700 w-full font-bold"
                    >
                      Complete Task
                    </button>
                  )}
                  {task.status === 'completed' && (
                    <p className="text-green-600 font-bold text-center w-full uppercase">Task Completed!</p>
                  )}
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500 border-2 border-dashed rounded">
                You have no active tasks currently.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeeDashboard;
