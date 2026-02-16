import React, { useRef, useState } from 'react';
import { uploadService } from '../services/api';
import type { UploadResponse } from '../types';

const FileUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) { setError('Please select an Excel file (.xlsx or .xls)'); return; }
      setSelectedFile(file); setError(''); setUploadResponse(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) { setError('Please select a file first'); return; }
    try { setIsLoading(true); setError(''); const response = await uploadService.uploadFile(selectedFile); if (response.data.success) { setUploadResponse(response.data.data); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; } }
    catch (err: any) { setError(err.response?.data?.message || 'Failed to upload file'); console.error(err); }
    finally { setIsLoading(false); }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); const files = e.dataTransfer.files; if (files.length > 0) { const file = files[0]; if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) { setError('Please select an Excel file (.xlsx or .xls)'); return; } setSelectedFile(file); setError(''); setUploadResponse(null); } };

  return (
    <div id="page-upload" className="page">
      <div className="page-hdr">
        <h2>Upload Lead List</h2>
        <div className="breadcrumb">HOME &gt; <span>UPLOAD</span></div>
      </div>

      <div className="modal" style={{maxWidth:900}}>
        <div className="modal-hdr">Upload Lead List</div>
        <div className="modal-body">
          <div className="modal-upload-row">
            <span className="modal-section-hdr">Upload File</span>
          </div>

          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
            <label style={{fontSize:'.8rem',fontWeight:700,whiteSpace:'nowrap'}}>Select Document</label>
            <div className="file-input-wrap">Choose Document</div>
            <button className="browse-btn" onClick={() => fileInputRef.current?.click()}>BROWSE</button>
            <button className="download-tpl-btn">DOWNLOAD TEMPLATE ↓</button>
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileSelect} style={{display:'none'}} />
          </div>

          <div style={{display:'flex',alignItems:'center',gap:6,fontSize:'.8rem',fontWeight:700,color:'var(--text)',padding:'8px 0',borderLeft:'3px solid var(--hero-red)',paddingLeft:10,marginBottom:10,cursor:'pointer'}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="9 18 15 12 9 6"/></svg>
            View Uploaded Leads
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th><input type="checkbox" className="cb"/></th>
                  <th>Contact Number</th><th>First Name</th><th>Last Name</th><th>Gender</th><th>Government ID</th><th>Email ID</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><input type="checkbox" className="cb" checked/></td><td>9823178888</td><td>Bhushan</td><td>Dashpute</td><td>Male</td><td>PAN Card</td><td>sampleemail000@gmail.com</td></tr>
                <tr><td><input type="checkbox" className="cb"/></td><td>9823178888</td><td>Shankar</td><td>Girija</td><td>Male</td><td>PAN Card</td><td>sampleemail000@gmail.com</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel">CANCEL</button>
          <button className="btn-modal-save" onClick={handleUpload}>{isLoading ? 'Uploading...' : 'SAVE'}</button>
        </div>
      </div>

      {error && <div style={{marginTop:16}} className="info-box">{error}</div>}
      {uploadResponse && (
        <div style={{marginTop:16}} className="info-box">{uploadResponse.message}</div>
      )}
    </div>
  );
};

export default FileUpload;
