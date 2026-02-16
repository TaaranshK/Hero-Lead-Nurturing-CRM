import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leadService, chatService } from '../services/api';
import type { Lead, ChatMessage, LeadModification } from '../types';

const LeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [modifications, setModifications] = useState<LeadModification[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({});

  const leadId = parseInt(id || '0');

  useEffect(() => { if (leadId === 0) { setIsEditing(true); return; } fetchLeadData(); }, [leadId]);

  const fetchLeadData = async () => {
    try {
      setIsLoading(true); setError('');
      const leadResp = await leadService.getById(leadId);
      if (leadResp.data.success) { setLead(leadResp.data.data); setFormData(leadResp.data.data); }
      const chatResp = await chatService.getChatHistory(leadId);
      if (chatResp.data.success) setChatMessages(chatResp.data.data);
      const modResp = await leadService.getModificationHistory(leadId);
      if (modResp.data.success) setModifications(modResp.data.data);
    } catch (err: any) { setError('Failed to load lead details'); console.error(err); }
    finally { setIsLoading(false); }
  };

  const handleSaveMessage = async () => { if (!newMessage.trim()) return; try { await chatService.sendMessage(leadId, newMessage); setNewMessage(''); await fetchLeadData(); } catch (err: any) { setError('Failed to send message'); console.error(err); } };

  const handleSaveLead = async () => { try { if (leadId === 0) await leadService.create(formData as Lead); else await leadService.update(leadId, formData as Lead); setIsEditing(false); await fetchLeadData(); } catch (err: any) { setError('Failed to save lead'); console.error(err); } };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'followUpDate' || name === 'createdAt' || name === 'updatedAt' ? new Date(value).toISOString() : value }));
  };

  if (isLoading && leadId !== 0) return <div className="loading">Loading lead details...</div>;

  return (
    <div id="page-lead-detail" className="page">
      <div className="page-hdr">
        <h2>Lead Details</h2>
        <div className="breadcrumb">HOME &gt; <span>LEAD DETAILS</span></div>
      </div>

      <div className="ld-id-bar">
        <span className="ld-badge id-badge">Lead ID : {lead?.id ?? 'ORD20240717198340055'}</span>
        <span className="ld-badge enq-badge">Enquiry No : {lead?.enquiryNo ?? 'ENQ0012345'}</span>
        <span className="ld-badge status-badge">Status : {lead?.status ?? 'Open'}</span>
        <div className="spacer" />
        <button className="btn-modify2" onClick={() => setIsEditing(true)}>MODIFY</button>
        <button className="btn-save2" onClick={handleSaveLead}>SAVE</button>
      </div>

      <div className="section-hdr" style={{padding:'10px 16px',background:'#f9fafb',borderBottom:'1px solid var(--border)'}} onClick={() => { /* collapse handled via CSS/JS if required */ }}>
        <svg className="arr" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="9 18 15 12 9 6"/></svg>
        <strong style={{fontSize:'.82rem'}}>Basic Information</strong>
      </div>

      <div className="info-grid">
        <div className="ig-cell"><div className="ig-label">First Name</div><div className="ig-val">{lead?.firstName}</div></div>
        <div className="ig-cell"><div className="ig-label">Last Name</div><div className="ig-val">{lead?.lastName}</div></div>
        <div className="ig-cell"><div className="ig-label">Contact Number</div><div className="ig-val">{lead?.contactNumber}</div></div>
        <div className="ig-cell"><div className="ig-label">Government ID</div><div className="ig-val">{lead?.governmentId}</div></div>
        <div className="ig-cell"><div className="ig-label">Email ID</div><div className="ig-val">{lead?.email}</div></div>
        <div className="ig-cell"><div className="ig-label">City</div><div className="ig-val">{lead?.city}</div></div>
        <div className="ig-cell ig-full"><div className="ig-label">Address</div><div className="ig-val">{lead?.address}</div></div>
      </div>

      <div className="tabs" style={{marginBottom:16}}>
        <button className={`tab-btn active`} id="tab-details">Lead Details</button>
        <button className={`tab-btn`} id="tab-history">Modification History</button>
      </div>

      <div className="detail-section">
        <div className="ds-header">Lead Details</div>
        <table>
          <thead>
            <tr>
              <th>Model Name</th>
              <th>Lead Source</th>
              <th>Lead Sub-Source</th>
              <th>Status</th>
              <th>Dealer Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{lead?.modelName ?? 'Splendor 100'}</td>
              <td>{lead?.leadSource ?? 'Website'}</td>
              <td>{lead?.leadSubSource ?? 'Website'}</td>
              <td>{lead?.status ?? 'Open'}</td>
              <td>{lead?.dealerName ?? 'Shaan Motors'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {leadId !== 0 && (
        <div className="detail-section">
          <div className="ds-header">Modification History</div>
          <table>
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Approved By</th>
                <th>Modified Field</th>
                <th>Previous Value</th>
                <th>After Value</th>
                <th>Modification Date &amp; Time</th>
                <th>Modified By</th>
              </tr>
            </thead>
            <tbody>
              {modifications.length === 0 ? (
                <tr><td colSpan={7}>No modifications found</td></tr>
              ) : (
                modifications.map((m, idx) => (
                  <tr key={m.id}>
                    <td>{idx + 1}</td>
                    <td>{m.approvedBy}</td>
                    <td>{m.modifiedField}</td>
                    <td>{m.oldValue}</td>
                    <td>{m.newValue}</td>
                    <td>{new Date(m.modifiedAt).toLocaleString()}</td>
                    <td>{m.modifiedBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeadDetail;
