import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Users, UserCheck, UserX, Clock, X } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../services/dashboardService';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async (fromDate = null, toDate = null) => {
    try {
      setLoading(true);
      const response = await dashboardService.getStats(fromDate, toDate);
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (dateFilter.from && dateFilter.to) {
      fetchStats(dateFilter.from, dateFilter.to);
    }
  };

  const handleClear = () => {
    setDateFilter({ from: '', to: '' });
    fetchStats();
  };

  if (loading) {
    return (
      <Layout title="Lead Nurturing Application" breadcrumb="DASHBOARD">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  const statCards = [
    { title: 'ALL LEADS', value: stats?.totalLeads || 0, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'QUALIFIED LEADS', value: stats?.qualifiedLeads || 0, icon: UserCheck, color: 'text-green-600', bgColor: 'bg-green-50' },
    { title: 'UNQUALIFIED LEADS', value: stats?.unqualifiedLeads || 0, icon: UserX, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { title: 'PENDING LEADS', value: stats?.pendingLeads || 0, icon: Clock, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { title: 'LOST LEADS', value: stats?.lostLeads || 0, icon: X, color: 'text-red-600', bgColor: 'bg-red-50' },
  ];

  const pieData = [
    { name: 'Qualified', value: stats?.qualifiedLeads || 0, color: '#10b981' },
    { name: 'Total', value: (stats?.totalLeads || 0) - (stats?.qualifiedLeads || 0), color: '#3b82f6' },
  ];

  const lostPieData = [
    { name: 'Lost', value: stats?.lostLeads || 0, color: '#ef4444' },
    { name: 'Total', value: (stats?.totalLeads || 0) - (stats?.lostLeads || 0), color: '#6366f1' },
  ];

  const sourceData = stats?.sourceDistribution
    ? Object.entries(stats.sourceDistribution).flatMap(([source, count]) => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return days.map(day => ({
          day,
          [source]: Math.floor(Math.random() * count),
        }));
      }).reduce((acc, curr) => {
        const existing = acc.find(item => item.day === curr.day);
        if (existing) {
          Object.assign(existing, curr);
        } else {
          acc.push(curr);
        }
        return acc;
      }, [])
    : [];

  return (
    <Layout title="Lead Nurturing Application" breadcrumb="DASHBOARD">
      <div className="p-8 space-y-6">
        {/* Date Filter */}
        <div className="card">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date (From)</label>
              <input
                type="date"
                value={dateFilter.from}
                onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date (To)</label>
              <input
                type="date"
                value={dateFilter.to}
                onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
                className="input"
              />
            </div>
            <div className="flex gap-2 mt-8">
              <button onClick={handleClear} className="btn btn-secondary">✕ Clear</button>
              <button onClick={handleSearch} className="btn btn-primary">🔍 Search</button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className={stat.color} size={20} />
                    <p className="text-sm font-medium text-gray-600 uppercase">{stat.title}</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={stat.color} size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Qualified vs Total */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Total vs Qualified Leads</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Qualified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">Total</span>
              </div>
            </div>
          </div>

          {/* Lost vs Total */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Total vs Lost Leads</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={lostPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {lostPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-indigo-500 rounded"></div>
                <span className="text-sm">Total</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Lost</span>
              </div>
            </div>
          </div>

          {/* Lead Sub-Source */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Lead Sub-Source</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceData.slice(0, 7)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                {stats?.sourceDistribution && Object.keys(stats.sourceDistribution).map((source, index) => {
                  const colors = ['#ec4899', '#3b82f6', '#10b981'];
                  return <Bar key={source} dataKey={source} fill={colors[index % colors.length]} />;
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
