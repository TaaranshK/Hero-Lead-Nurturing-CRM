import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Search, Download, Trash2, Edit, Plus, Save, Upload } from 'lucide-react';
import { leadService } from '../services/leadService';
import { formatDate } from '../utils/dateUtils';
import { getStatusColor } from '../utils/statusUtils';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [filters, setFilters] = useState({
    contactNumber: '',
    name: '',
    model: '',
    leadType: '',
    fromDate: '',
    toDate: ''
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, leads]);

  const fetchLeads = async () => {
    try {
      const response = await leadService.getAllLeads();
      setLeads(response.data.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    if (filters.contactNumber) {
      filtered = filtered.filter(lead => 
        lead.contactNumber?.includes(filters.contactNumber)
      );
    }

    if (filters.name) {
      filtered = filtered.filter(lead =>
        lead.firstName?.toLowerCase().includes(filters.name.toLowerCase()) ||
        lead.lastName?.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.leadType) {
      filtered = filtered.filter(lead => lead.status === filters.leadType);
    }

    setFilteredLeads(filtered);
  };

  const handleSelectLead = (leadId) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  const handleDelete = async () => {
    if (selectedLeads.length === 0) return;
    
    if (window.confirm(`Delete ${selectedLeads.length} lead(s)?`)) {
      try {
        await Promise.all(selectedLeads.map(id => leadService.deleteLead(id)));
        fetchLeads();
        setSelectedLeads([]);
      } catch (error) {
        console.error('Error deleting leads:', error);
      }
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;

    try {
      await leadService.uploadLeads(uploadFile);
      setShowUploadModal(false);
      setUploadFile(null);
      fetchLeads();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleClear = () => {
    setFilters({
      contactNumber: '',
      name: '',
      model: '',
      leadType: '',
      fromDate: '',
      toDate: ''
    });
  };

  return (
    <Layout title="Lead Nurturing Application" breadcrumb="LEAD LIST">
      <div className="p-8">
        <div className="card mb-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <input
              type="text"
              placeholder="Enter Contact Number"
              value={filters.contactNumber}
              onChange={(e) => setFilters({ ...filters, contactNumber: e.target.value })}
              className="input"
            />
            <input
              type="text"
              placeholder="Enter Name"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className="input"
            />
            <select
              value={filters.model}
              onChange={(e) => setFilters({ ...filters, model: e.target.value })}
              className="input"
            >
              <option value="">Select Model</option>
              <option value="Splendor 125">Splendor 125</option>
              <option value="Splendor 100">Splendor 100</option>
            </select>
            <select
              value={filters.leadType}
              onChange={(e) => setFilters({ ...filters, leadType: e.target.value })}
              className="input"
            >
              <option value="">Select Lead Type</option>
              <option value="NEW">New Leads</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="UNQUALIFIED">Unqualified</option>
              <option value="LOST">Lost Leads</option>
            </select>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
              className="input"
              placeholder="DD/MM/YYYY"
            />
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
              className="input"
              placeholder="DD/MM/YYYY"
            />
          </div>

          {/* Search Bar and Actions */}
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search keyword"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="flex gap-2">
              <button onClick={handleClear} className="btn btn-secondary">✕ Clear</button>
              <button className="btn btn-primary">🔍 Search</button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mb-4">
          <button className="btn btn-secondary flex items-center gap-2">
            <Download size={18} />
            EXCEL
          </button>
          <button 
            onClick={handleDelete}
            disabled={selectedLeads.length === 0}
            className="btn btn-danger flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 size={18} />
            DELETE
          </button>
          <button className="btn btn-secondary flex items-center gap-2">
            <Edit size={18} />
            MODIFY
          </button>
          <button 
            onClick={() => navigate('/leads/new')}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            CREATE
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Upload size={18} />
            UPLOAD
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <Save size={18} />
            SAVE
          </button>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">First Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Government ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Privacy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model Name</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/leads/${lead.id}`)}
                  >
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => handleSelectLead(lead.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{lead.contactNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{lead.firstName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{lead.lastName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">Male</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{lead.governmentId || 'PAN Card'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{lead.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">Yes</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{lead.city}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{lead.modelName}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              1-{Math.min(20, filteredLeads.length)} of {filteredLeads.length}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Rows per page: 20</span>
              <div className="flex gap-1">
                <button className="p-2 hover:bg-gray-200 rounded">«</button>
                <button className="p-2 hover:bg-gray-200 rounded">‹</button>
                <button className="p-2 bg-primary-600 text-white rounded">1</button>
                <button className="p-2 hover:bg-gray-200 rounded">2</button>
                <button className="p-2 hover:bg-gray-200 rounded">3</button>
                <button className="p-2 hover:bg-gray-200 rounded">›</button>
                <button className="p-2 hover:bg-gray-200 rounded">»</button>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4"
            >
              <h3 className="text-xl font-semibold mb-6">Upload Lead List</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Upload File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="mx-auto mb-2 text-gray-400" size={48} />
                    <p className="text-sm text-gray-600">Choose Document or drag here</p>
                    {uploadFile && (
                      <p className="mt-2 text-sm text-green-600">{uploadFile.name}</p>
                    )}
                  </label>
                </div>
                <button className="mt-2 text-sm text-primary-600 hover:text-primary-700">
                  📥 DOWNLOAD TEMPLET
                </button>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="btn btn-secondary"
                >
                  ✕ CANCEL
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!uploadFile}
                  className="btn btn-primary disabled:opacity-50"
                >
                  💾 SAVE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LeadList;
