import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadService } from '../services/api';
import type { Lead, LeadStatus } from '../types';

const LeadList: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchLeads(); }, [statusFilter]);

  const fetchLeads = async () => {
    try {
      setIsLoading(true); setError('');
      let response;
      if (statusFilter === 'ALL') response = await leadService.getAll();
      else response = await leadService.filterByStatus(statusFilter);
      if (response.data.success) setLeads(response.data.data);
    } catch (err: any) { setError('Failed to load leads'); console.error(err); }
    finally { setIsLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try { await leadService.delete(id); setLeads(leads.filter((l) => l.id !== id)); }
    catch (err: any) { setError('Failed to delete lead'); console.error(err); }
  };

  const handleStatusChange = async (lead: Lead, newStatus: LeadStatus) => {
    try { const updated = { ...lead, status: newStatus }; await leadService.update(lead.id, updated); fetchLeads(); }
    catch (err: any) { setError('Failed to update lead status'); console.error(err); }
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.lastName && lead.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      lead.contactNumber.includes(searchTerm) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) return <div className="loading">Loading leads...</div>;

  return (
    <div id="page-lead-list" className="page">
      <div className="page-hdr">
        <h2>Lead List</h2>
        <div className="breadcrumb">HOME &gt; <span>LEAD LIST</span></div>
      </div>

      <div className="ll-filter">
        <div>
          <label>Contact Number</label>
          <input type="text" placeholder="Enter Contact Number" />
        </div>
        <div>
          <label>Name</label>
          <input type="text" placeholder="Enter Name" />
        </div>
        <div>
          <label>Model</label>
          <select><option>Select Model</option><option>Splendor 100</option><option>Splendor 125</option></select>
        </div>
        <div>
          <label>Lead Type</label>
          <select id="lead-type-sel" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
            <option value="ALL">Select Lead Type</option>
            <option value="LOST">Lost Leads</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
        <div>
          <label>Date (From)</label>
          <input type="text" placeholder="DD/MM/YYYY" />
        </div>
        <div>
          <label>Date (To)</label>
          <input type="text" placeholder="DD/MM/YYYY" />
        </div>
        <div className="filter-btns">
          <button className="btn-clear">✕ Clear</button>
          <button className="btn-search" onClick={fetchLeads}>Search</button>
        </div>
      </div>

      <div className="ll-toolbar">
        <div className="search-wrap">
          <span className="s-ico">🔍</span>
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search keyword" />
        </div>
        <div className="spacer" />
        <button className="btn-action btn-excel">EXCEL ↓</button>
        <button className="btn-action btn-delete">DELETE</button>
        <button className="btn-action btn-modify">MODIFY</button>
        <button className="btn-action btn-create" onClick={() => navigate('/upload')}>CREATE</button>
        <button className="btn-action btn-save">SAVE</button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th><input type="checkbox" className="cb"/></th>
              <th>Contact Number</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Gender</th>
              <th>Government ID</th>
              <th>Email ID</th>
              <th>Data Privacy</th>
              <th>City</th>
              <th>Model Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((l, i) => (
              <tr key={l.id} style={{cursor:'pointer'}} onClick={() => navigate(`/leads/${l.id}`)}>
                <td><input type="checkbox" className="cb" /></td>
                <td>{l.contactNumber}</td>
                <td>{l.firstName}</td>
                <td>{l.lastName}</td>
                <td>{l.gender}</td>
                <td>{l.governmentId}</td>
                <td>{l.email}</td>
                <td>{l.dataPrivacy ?? 'Yes'}</td>
                <td>{l.city}</td>
                <td>{l.modelName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span id="pagination-info">1-20 of {filteredLeads.length}</span>
        <div className="rows-sel">
          Rows per page: <select><option>20</option><option>50</option><option>100</option></select>
          <div className="page-nav">
            <button>«</button>
            <button>‹</button>
            <button>1</button>
            <button className="active">2</button>
            <button>3</button>
            <button>›</button>
            <button>»</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadList;
