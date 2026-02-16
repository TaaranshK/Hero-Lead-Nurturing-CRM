import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { leadService } from '../services/leadService';

const LeadCreate = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    contactNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    modelName: '',
    leadSource: '',
    status: 'NEW',
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await leadService.createLead(form);
      const createdId = response?.data?.data?.id;
      navigate(createdId ? `/leads/${createdId}` : '/leads');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create lead');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Lead Nurturing Application" breadcrumb="CREATE LEAD">
      <div className="p-8">
        <div className="card max-w-4xl">
          <h2 className="text-xl font-semibold mb-6">Create Lead</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="input"
              placeholder="Contact Number"
              value={form.contactNumber}
              onChange={(e) => handleChange('contactNumber', e.target.value)}
              required
            />
            <input
              className="input"
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
            />
            <input
              className="input"
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
            <input
              type="email"
              className="input"
              placeholder="Email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            <input
              className="input"
              placeholder="City"
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
            <input
              className="input"
              placeholder="Model Name"
              value={form.modelName}
              onChange={(e) => handleChange('modelName', e.target.value)}
            />
            <input
              className="input"
              placeholder="Lead Source"
              value={form.leadSource}
              onChange={(e) => handleChange('leadSource', e.target.value)}
            />
            <select
              className="input"
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <option value="NEW">New</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="UNQUALIFIED">Unqualified</option>
              <option value="LOST">Lost</option>
            </select>

            <div className="md:col-span-2 flex gap-3 mt-2">
              <button type="button" onClick={() => navigate('/leads')} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-50">
                {saving ? 'Saving...' : 'Create Lead'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default LeadCreate;
