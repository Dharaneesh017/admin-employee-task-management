import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', deadline: '' });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
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

  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get('/api/auth/users', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateApproval = async (id, isApproved) => {
    try {
      await axios.put(`/api/auth/approve/${id}`, { isApproved }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchEmployees();
    } catch (err) {
      alert('Failed to update approval');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', newTask, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setShowModal(false);
      setNewTask({ title: '', description: '', assignedTo: '', deadline: '' });
      fetchTasks();
    } catch (err) {
      alert('Failed to create task: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchTasks();
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-blue-600 p-8 text-white flex justify-between items-center shadow-lg">
        <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard | Task Management System</h1>
        <div className="flex items-center gap-12">
          <ul className="flex gap-8 text-xl font-bold">
            <li className={`cursor-pointer pb-2 ${activeTab === 'tasks' ? 'border-b-4 border-white' : 'opacity-80 hover:opacity-100'}`} onClick={() => setActiveTab('tasks')}>Track Tasks</li>
            <li className={`cursor-pointer pb-2 ${activeTab === 'users' ? 'border-b-4 border-white' : 'opacity-80 hover:opacity-100'}`} onClick={() => setActiveTab('users')}>Users Control</li>
          </ul>
          <button onClick={logout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-extrabold text-lg transition-colors">
            <LogOut size={22} /> Sign out
          </button>
        </div>
      </nav>

      <main className="p-10 w-full max-w-[96%] mx-auto">
        {activeTab === 'tasks' ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Assign Tasks to Employees</h2>
              <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded shadow-lg hover:bg-blue-700 font-bold text-lg">
                Assign New Task
              </button>
            </div>

            <div className="bg-white border rounded shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-100 border-b">
                  <tr className="text-sm font-semibold text-gray-600 uppercase">
                    <th className="p-4">Title</th>
                    <th className="p-4">Assigned To</th>
                    <th className="p-4">Deadline</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-gray-700">
                  {tasks.map(task => (
                    <tr key={task._id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-bold">{task.title}</div>
                        <div className="text-xs text-gray-500">{task.description}</div>
                      </td>
                      <td className="p-4">{task.assignedTo?.name || 'N/A'}</td>
                      <td className="p-4">{new Date(task.deadline).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${task.status === 'completed' ? 'bg-green-100 text-green-700' : task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDeleteTask(task._id)} className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Employee Approvals</h2>
            <div className="bg-white border rounded shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-100 border-b uppercase text-sm">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Approval Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-gray-700">
                  {employees.filter(u => u.role !== 'admin').map(emp => (
                    <tr key={emp._id} className="hover:bg-gray-50">
                      <td className="p-4 font-bold">{emp.name}</td>
                      <td className="p-4">{emp.email}</td>
                      <td className="p-4">
                        <span className={emp.isApproved ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                          {emp.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleUpdateApproval(emp._id, !emp.isApproved)}
                          className={`px-4 py-1 rounded text-white text-sm font-bold ${emp.isApproved ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                          {emp.isApproved ? 'Revoke Access' : 'Approve Now'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Basic Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Assign New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Task Title</label>
                <input
                  type="text" required
                  className="w-full"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Description</label>
                <textarea
                  required
                  className="w-full"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Assign To</label>
                  <select
                    className="w-full"
                    required
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  >
                    <option value="">Select Employee</option>
                    {employees.filter(e => e.role === 'employee' && e.isApproved).map(e => (
                      <option key={e._id} value={e._id}>{e.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Due Date</label>
                  <input
                    type="date" required
                    className="w-full"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold">Assign Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
