import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { leadService } from '../services/leadService';
import { formatDateTime } from '../utils/dateUtils';
import { getStatusColor } from '../utils/statusUtils';
import { Edit, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [modifications, setModifications] = useState([]);
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeadDetails();
    fetchModifications();
  }, [id]);

  const fetchLeadDetails = async () => {
    try {
      const response = await leadService.getLeadById(id);
      setLead(response.data.data);
    } catch (error) {
      console.error('Error fetching lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchModifications = async () => {
    try {
      const response = await leadService.getModificationHistory(id);
      setModifications(response.data.data);
    } catch (error) {
      console.error('Error fetching modifications:', error);
    }
  };

  const handleSave = async () => {
    try {
      await leadService.updateLead(id, lead);
      setIsEditing(false);
      fetchLeadDetails();
      fetchModifications();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  if (loading) {
    return (
      <Layout title="Lead Nurturing Application" breadcrumb="LEAD DETAILS">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Lead Details" breadcrumb="LEAD DETAILS">
      <div className="p-8">
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-sm text-gray-500">Lead ID:</span>
                <span className="ml-2 font-semibold text-blue-600">ORD{lead?.id}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Enquiry No:</span>
                <span className="ml-2 font-semibold text-blue-600">EN00012345</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead?.status)}`}>
                  {lead?.status}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="btn btn-secondary flex items-center gap-2">
                  <Edit size={18} />
                  MODIFY
                </button>
              ) : (
                <button onClick={handleSave} className="btn btn-primary flex items-center gap-2">
                  <Save size={18} />
                  SAVE
                </button>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              ▸ Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={lead?.firstName || ''}
                  onChange={(e) => setLead({ ...lead, firstName: e.target.value })}
                  disabled={!isEditing}
                  className="input disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lead?.lastName || ''}
                  onChange={(e) => setLead({ ...lead, lastName: e.target.value })}
                  disabled={!isEditing}
                  className="input disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="text"
                  value={lead?.contactNumber || ''}
                  onChange={(e) => setLead({ ...lead, contactNumber: e.target.value })}
                  disabled={!isEditing}
                  className="input disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Government ID</label>
                <input
                  type="text"
                  value={lead?.governmentId || ''}
                  onChange={(e) => setLead({ ...lead, governmentId: e.target.value })}
                  disabled={!isEditing}
                  className="input disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                <input
                  type="email"
                  value={lead?.email || ''}
                  onChange={(e) => setLead({ ...lead, email: e.target.value })}
                  disabled={!isEditing}
                  className="input disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={lead?.city || ''}
                  onChange={(e) => setLead({ ...lead, city: e.target.value })}
                  disabled={!isEditing}
                  className="input disabled:bg-gray-50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={lead?.address || ''}
                  onChange={(e) => setLead({ ...lead, address: e.target.value })}
                  disabled={!isEditing}
                  className="input disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'details'
                    ? 'text-white bg-primary-600 rounded-t-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Lead Details
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'text-white bg-primary-600 rounded-t-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Modification History
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'details' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
                <input
                  type="text"
                  value={lead?.modelName || ''}
                  onChange={(e) => setLead({ ...lead, modelName: e.target.value })}
                  disabled={!isEditing}
                  className="input disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
                <input
                  type="text"
                  value={lead?.leadSource || ''}
                  onChange={(e) => setLead({ ...lead, leadSource: e.target.value })}
                  disabled={!isEditing}
                  className="input disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lead Sub-Source</label>
                <input
                  type="text"
                  value="Website"
                  disabled={!isEditing}
                  className="input disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={lead?.status || ''}
                  onChange={(e) => setLead({ ...lead, status: e.target.value })}
                  disabled={!isEditing}
                  className="input disabled:bg-gray-50"
                >
                  <option value="NEW">New</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="UNQUALIFIED">Unqualified</option>
                  <option value="LOST">Lost</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dealer Name</label>
                <input
                  type="text"
                  value="Shaan Motors"
                  disabled={!isEditing}
                  className="input disabled:bg-gray-50"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-x-auto"
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sr. No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modified Field</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Previous Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">After Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modification Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modified By</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {modifications.map((mod, index) => (
                    <tr key={mod.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{mod.modifiedBy}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{mod.modifiedField}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{mod.oldValue}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{mod.newValue}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatDateTime(mod.modifiedAt)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{mod.modifiedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LeadDetails;
