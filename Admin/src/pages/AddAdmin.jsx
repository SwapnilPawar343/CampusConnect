import { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../context/AdmineContext';

const AddAdmin = () => {
  const { getToken } = useContext(AdminContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all admins
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${backendUrl}/api/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setAdmins(data.admins || []);
      }
    } catch (err) {
      console.error('Error fetching admins:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${backendUrl}/api/admin/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to create admin');
        return;
      }

      setSuccess('Admin created successfully!');
      setFormData({ name: '', email: '', password: '' });
      setShowForm(false);
      fetchAdmins();
    } catch (err) {
      console.error('Error creating admin:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/admin/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (response.ok) {
        setSuccess('Admin deleted successfully!');
        fetchAdmins();
      }
    } catch (err) {
      console.error('Error deleting admin:', err);
      setError('Failed to delete admin');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950 to-indigo-950 text-white">
      {/* Header */}
      <div className="border-b border-pink-500/20 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-pink-300/70">Admin Management</p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">Manage Admins</h1>
            <p className="mt-2 max-w-2xl text-sm text-purple-200">
              Create new admin accounts and manage existing administrators.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 md:px-8 md:py-8">
        {/* Success Message */}
        {success && (
          <div className="rounded-xl bg-green-500/15 border border-green-500/30 p-4">
            <p className="text-sm text-green-200">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="rounded-xl bg-red-500/15 border border-red-500/30 p-4">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Form Section */}
          <div className="rounded-4xl border border-pink-500/20 bg-linear-to-br from-slate-900/80 to-slate-950/80 p-6 shadow-xl backdrop-blur-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {showForm ? 'Create New Admin' : 'Admin Registration'}
              </h2>
              <p className="text-sm text-purple-300">
                {showForm ? 'Fill in the details to create a new admin account' : 'Click below to add a new administrator'}
              </p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full rounded-2xl bg-linear-to-r from-pink-600 to-purple-600 px-4 py-3 text-sm font-bold text-white transition hover:from-pink-700 hover:to-purple-700 mb-4"
            >
              {showForm ? 'Cancel' : 'Add New Admin'}
            </button>

            {showForm && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter admin name"
                    className="w-full rounded-xl border border-pink-500/20 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-purple-400 focus:border-pink-400"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    className="w-full rounded-xl border border-pink-500/20 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-purple-400 focus:border-pink-400"
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-pink-500/20 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-purple-400 focus:border-pink-400"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-pink-100 disabled:opacity-50"
                >
                  {loading ? 'Creating Admin...' : 'Create Admin'}
                </button>
              </form>
            )}
          </div>

          {/* Admin Stats */}
          <div className="rounded-4xl border border-pink-500/20 bg-linear-to-br from-slate-900/80 to-slate-950/80 p-6 shadow-xl backdrop-blur-xl">
            <h3 className="text-2xl font-bold text-white mb-4">Admin Statistics</h3>
            <div className="space-y-4">
              <div className="rounded-2xl border border-pink-500/15 bg-slate-900/60 px-4 py-4">
                <p className="text-sm text-purple-300 mb-1">Total Admins</p>
                <p className="text-3xl font-black text-pink-300">{admins.length}</p>
              </div>
              <div className="rounded-2xl border border-pink-500/15 bg-slate-900/60 px-4 py-4">
                <p className="text-sm text-purple-300 mb-1">Active</p>
                <p className="text-3xl font-black text-green-300">{admins.length}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Admins List */}
        <section className="rounded-4xl border border-pink-500/20 bg-linear-to-br from-slate-900/80 to-slate-950/80 p-6 shadow-xl backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white mb-6">All Admins</h2>
          <div className="space-y-3">
            {admins.length > 0 ? (
              admins.map((admin) => (
                <div key={admin._id} className="rounded-2xl border border-pink-500/15 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{admin.name}</p>
                      <p className="text-sm text-purple-300">{admin.email}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteAdmin(admin._id)}
                      className="px-4 py-2 rounded-lg bg-red-500/15 text-red-200 hover:bg-red-500/25 transition text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-purple-300 py-8">No admins found</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AddAdmin;
