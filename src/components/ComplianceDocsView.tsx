import React, { useState, useMemo } from 'react';
import { 
  FolderLock, Upload, Search, Download, Eye, Flag, AlertTriangle, CheckCircle, 
  X, Calendar, FileText, ChevronRight, Filter, ShieldCheck, FileSpreadsheet, Trash2, Clock 
} from 'lucide-react';
import { Vendor, ComplianceDoc } from '../dataStore';

interface ComplianceDocsViewProps {
  vendors: Vendor[];
  documents: ComplianceDoc[];
  isDark: boolean;
  onAddDocument: (doc: ComplianceDoc) => void;
  onFlagDocument: (id: string) => void;
}

export function ComplianceDocsView({
  vendors,
  documents: initialDocuments,
  isDark,
  onAddDocument,
  onFlagDocument
}: ComplianceDocsViewProps) {
  const [documents, setDocuments] = useState<ComplianceDoc[]>(initialDocuments);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<ComplianceDoc | null>(null);
  
  // Upload Form States
  const [formVendorId, setFormVendorId] = useState('');
  const [formCategory, setFormCategory] = useState<ComplianceDoc['category']>('Business Licenses');
  const [formName, setFormName] = useState('');
  const [formRefNum, setFormRefNum] = useState('');
  const [formIssueDate, setFormIssueDate] = useState('');
  const [formExpiryDate, setFormExpiryDate] = useState('');
  const [formAuthority, setFormAuthority] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Filter & Search
  const categories: string[] = [
    'All Documents',
    'Business Licenses',
    'Insurance Certs',
    'Financial Statements',
    'NDAs',
    'Regulatory Certs',
    'Quality Certs',
    'Tax Documents',
    'ESG Reports',
    'Contracts'
  ];

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchesCategory = selectedCategory === 'All Documents' || doc.category === selectedCategory;
      const matchesSearch = 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [documents, selectedCategory, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = documents.length;
    let active = 0;
    let expiring = 0;
    let expired = 0;

    documents.forEach(d => {
      if (d.status === 'Active') active++;
      else if (d.status === 'Expiring') expiring++;
      else if (d.status === 'Expired') expired++;
    });

    return { total, active, expiring, expired };
  }, [documents]);

  // Handle Mock Upload Simulation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setIsUploading(true);
      setUploadProgress(0);
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 20;
        });
      }, 200);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formVendorId || !formName || !formExpiryDate) {
      alert('Please fill out all required fields.');
      return;
    }

    const selectedVendor = vendors.find(v => v.id === formVendorId);
    if (!selectedVendor) return;

    // Calculate expiry status
    const expDate = new Date(formExpiryDate);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let status: 'Active' | 'Expiring' | 'Expired' = 'Active';
    if (diffDays < 0) status = 'Expired';
    else if (diffDays <= 90) status = 'Expiring';

    const newDoc: ComplianceDoc = {
      id: `DOC-${String(documents.length + 1).padStart(4, '0')}`,
      name: formName,
      vendorId: selectedVendor.id,
      vendorName: selectedVendor.name,
      category: formCategory,
      uploadDate: today.toISOString().split('T')[0],
      expiryDate: formExpiryDate,
      status,
      verifiedBy: 'Alex Mercer', // Current user log
      fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : '1.8 MB',
      referenceNumber: formRefNum || `REF-${Date.now().toString().slice(-6)}`,
      issueDate: formIssueDate,
      issuingAuthority: formAuthority,
      notes: formNotes
    };

    onAddDocument(newDoc);
    setDocuments(prev => [newDoc, ...prev]);

    // Reset Form
    setUploadModalOpen(false);
    setFormVendorId('');
    setFormCategory('Business Licenses');
    setFormName('');
    setFormRefNum('');
    setFormIssueDate('');
    setFormExpiryDate('');
    setFormAuthority('');
    setFormNotes('');
    setSelectedFile(null);
    setUploadProgress(0);
  };

  // Status Color Helper
  const getExpiryBadgeStyle = (expiryDateStr: string, status: ComplianceDoc['status']) => {
    const expDate = new Date(expiryDateStr);
    const today = new Date();
    const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0 || status === 'Expired') {
      return 'text-[#a33a3a] font-extrabold bg-[#e0e5ec] shadow-neo-badge px-3 py-1 text-xs rounded-[20px]';
    } else if (diffDays <= 90 || status === 'Expiring') {
      return 'text-[#9a6a2a] font-extrabold bg-[#e0e5ec] shadow-neo-badge px-3 py-1 text-xs rounded-[20px]';
    } else {
      return 'text-[#3a7a5a] font-extrabold bg-[#e0e5ec] shadow-neo-badge px-3 py-1 text-xs rounded-[20px]';
    }
  };

  const [toasts, setToasts] = useState<{ id: string; msg: string; type: 'success' | 'info' | 'warning' }[]>([]);
  const showToast = (msg: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <div className="flex-1 p-10 overflow-y-auto space-y-10 animate-fade-in relative">
      
      {/* Toast Notification Container */}
      <div className="fixed top-6 right-6 z-50 space-y-3">
        {toasts.map(t => (
          <div key={t.id} className="bg-neo-base shadow-neo-modal p-4 rounded-[12px] flex items-center gap-3 border-l-4 border-neo-accent animate-slide-up">
            <CheckCircle className="text-neo-success" size={18} />
            <span className="text-sm font-bold text-neo-primary">{t.msg}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="text-xs font-black text-neo-muted uppercase tracking-widest font-roboto">RISK & REGULATORY MONITORING</span>
          <h1 className="text-3xl font-black tracking-tight text-neo-primary uppercase font-roboto mt-1">Compliance Registry</h1>
          <p className="text-sm text-neo-secondary mt-1">Audit, register, and trace crucial vendor certifications, NDAs, and business licenses.</p>
        </div>
        <button 
          onClick={() => setUploadModalOpen(true)}
          className="bg-neo-base shadow-neo-btn hover:shadow-neo-btn-hover active:shadow-neo-btn-active text-neo-accent font-black px-6 py-3 rounded-[12px] text-sm flex items-center gap-2 self-start md:self-auto"
        >
          <Upload size={16} /> Register Document
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Document Registry', val: stats.total, color: 'text-neo-primary', icon: FolderLock },
          { label: 'Compliant & Active', val: stats.active, color: 'text-neo-success', icon: ShieldCheck },
          { label: 'Expiring Soon (<90 Days)', val: stats.expiring, color: 'text-neo-warning', icon: Clock },
          { label: 'Expired & Invalid', val: stats.expired, color: 'text-neo-danger', icon: AlertTriangle }
        ].map((st, idx) => (
          <div key={idx} className="bg-neo-base shadow-neo-card p-6 rounded-[16px] flex items-center justify-between border-0 transition-transform duration-200 hover:scale-[1.02]">
            <div className="space-y-2">
              <span className="text-xs font-bold text-neo-secondary uppercase tracking-wider block">{st.label}</span>
              <span className={`text-3xl font-extrabold font-roboto block ${st.color}`}>{st.val}</span>
            </div>
            <div className="p-3 bg-neo-base shadow-neo-badge rounded-full">
              <st.icon className={st.color} size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Workspace: Left Sub-Nav + Right Table */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
        
        {/* Left Sub-Nav: Categories */}
        <div className="bg-neo-base shadow-neo-card p-6 rounded-[16px] space-y-4 xl:col-span-1">
          <h3 className="text-xs font-black uppercase tracking-widest text-neo-primary border-b border-gray-300 dark:border-gray-800 pb-2">Document Types</h3>
          <div className="flex flex-row xl:flex-col overflow-x-auto xl:overflow-x-visible gap-3 py-2 xl:py-0 whitespace-nowrap xl:whitespace-normal">
            {categories.map((cat, idx) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-xs font-bold px-4 py-3 rounded-[12px] flex items-center justify-between transition-all duration-150 shrink-0 xl:shrink ${
                    active 
                      ? 'shadow-neo-tab-active bg-neo-base text-neo-accent font-extrabold' 
                      : 'shadow-neo-tab-inactive bg-neo-base text-neo-secondary hover:shadow-neo-tab-active'
                  }`}
                  style={{ gap: '12px' }}
                >
                  <span className="truncate">{cat}</span>
                  <span className="text-[10px] bg-neo-base shadow-neo-badge px-2 py-0.5 rounded-full font-black text-neo-muted">
                    {cat === 'All Documents' 
                      ? documents.length 
                      : documents.filter(d => d.category === cat).length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right workspace: Table and search */}
        <div className="bg-neo-base shadow-neo-card p-6 rounded-[16px] space-y-6 xl:col-span-4 overflow-hidden">
          
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-6 justify-between items-stretch md:items-center">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neo-muted">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search by ID, name, vendor, ref..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[42px] text-sm text-neo-primary placeholder-neo-muted focus:shadow-neo-input-focus outline-none"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-neo-secondary">Showing {filteredDocs.length} Documents</span>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-[12px]">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-800">
                  <th className="p-4 text-xs font-extrabold uppercase text-neo-muted tracking-wider">Document ID</th>
                  <th className="p-4 text-xs font-extrabold uppercase text-neo-muted tracking-wider">Document Name</th>
                  <th className="p-4 text-xs font-extrabold uppercase text-neo-muted tracking-wider">Vendor</th>
                  <th className="p-4 text-xs font-extrabold uppercase text-neo-muted tracking-wider">Category</th>
                  <th className="p-4 text-xs font-extrabold uppercase text-neo-muted tracking-wider">Upload Date</th>
                  <th className="p-4 text-xs font-extrabold uppercase text-neo-muted tracking-wider">Expiry Date</th>
                  <th className="p-4 text-xs font-extrabold uppercase text-neo-muted tracking-wider text-center">Status</th>
                  <th className="p-4 text-xs font-extrabold uppercase text-neo-muted tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-850">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-xs font-semibold text-neo-muted">
                      No compliance documents match the query criteria.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map(doc => (
                    <tr key={doc.id} className="hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 text-xs font-extrabold text-neo-accent">{doc.id}</td>
                      <td className="p-4 text-sm font-bold text-neo-primary truncate max-w-xs">{doc.name}</td>
                      <td className="p-4 text-xs font-bold text-neo-primary">{doc.vendorName}</td>
                      <td className="p-4 text-xs font-semibold text-neo-secondary">
                        <span className="bg-neo-base shadow-neo-badge px-2.5 py-1 rounded-[6px]">
                          {doc.category}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-semibold text-neo-muted">{doc.uploadDate}</td>
                      <td className="p-4 text-xs font-extrabold text-neo-primary">{doc.expiryDate}</td>
                      <td className="p-4 text-center">
                        <span className={getExpiryBadgeStyle(doc.expiryDate, doc.status)}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="bg-neo-base shadow-neo-icon-btn hover:shadow-neo-icon-btn-hover active:shadow-neo-icon-btn-active text-neo-accent p-2 rounded-[8px] transition-all"
                            title="Preview Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => showToast(`Initiated secure download for ${doc.id}...`, 'info')}
                            className="bg-neo-base shadow-neo-icon-btn hover:shadow-neo-icon-btn-hover active:shadow-neo-icon-btn-active text-neo-success p-2 rounded-[8px] transition-all"
                            title="Download File"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => {
                              onFlagDocument(doc.id);
                              showToast(`Document ${doc.id} flagged for legal department review.`, 'warning');
                            }}
                            className="bg-neo-base shadow-neo-icon-btn hover:shadow-neo-icon-btn-hover active:shadow-neo-icon-btn-active text-neo-danger p-2 rounded-[8px] transition-all"
                            title="Flag for Discrepancy"
                          >
                            <Flag size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL: DOCUMENT REGISTER/UPLOAD */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 dark:bg-black/60 p-4 animate-fade-in">
          <div className="bg-neo-base shadow-neo-modal rounded-[20px] w-full max-w-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-300 dark:border-gray-800 flex justify-between items-center bg-neo-base">
              <div className="flex items-center gap-3">
                <FolderLock className="text-neo-accent" size={20} />
                <h3 className="text-lg font-black font-roboto uppercase text-neo-primary">Register New Compliance Document</h3>
              </div>
              <button 
                onClick={() => setUploadModalOpen(false)}
                className="text-neo-muted hover:text-neo-primary p-1 rounded-full shadow-neo-icon-btn hover:shadow-neo-icon-btn-hover"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-neo-secondary uppercase mb-1">Select Vendor *</label>
                  <select 
                    required
                    value={formVendorId} 
                    onChange={e => setFormVendorId(e.target.value)}
                    className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[40px] px-3 text-xs text-neo-primary focus:shadow-neo-input-focus outline-none"
                  >
                    <option value="">-- Choose Vendor --</option>
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.id})</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-neo-secondary uppercase mb-1">Document Category *</label>
                  <select 
                    required
                    value={formCategory} 
                    onChange={e => setFormCategory(e.target.value as any)}
                    className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[40px] px-3 text-xs text-neo-primary focus:shadow-neo-input-focus outline-none"
                  >
                    {categories.slice(1).map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-neo-secondary uppercase mb-1">Document Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. ISO 27001 Certificate, Certificate of Insurance"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[40px] px-3 text-xs text-neo-primary placeholder-neo-muted focus:shadow-neo-input-focus outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neo-secondary uppercase mb-1">Reference/Certificate Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. CERT-99382-A"
                    value={formRefNum}
                    onChange={e => setFormRefNum(e.target.value)}
                    className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[40px] px-3 text-xs text-neo-primary placeholder-neo-muted focus:shadow-neo-input-focus outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neo-secondary uppercase mb-1">Issuing Authority</label>
                  <input 
                    type="text" 
                    placeholder="e.g. BSI Group, State Registry"
                    value={formAuthority}
                    onChange={e => setFormAuthority(e.target.value)}
                    className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[40px] px-3 text-xs text-neo-primary placeholder-neo-muted focus:shadow-neo-input-focus outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neo-secondary uppercase mb-1">Issue Date</label>
                  <input 
                    type="date" 
                    value={formIssueDate}
                    onChange={e => setFormIssueDate(e.target.value)}
                    className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[40px] px-3 text-xs text-neo-primary focus:shadow-neo-input-focus outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neo-secondary uppercase mb-1">Expiry Date *</label>
                  <input 
                    type="date" 
                    required
                    value={formExpiryDate}
                    onChange={e => setFormExpiryDate(e.target.value)}
                    className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[40px] px-3 text-xs text-neo-primary focus:shadow-neo-input-focus outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-neo-secondary uppercase mb-1">Notes / Disclaimers</label>
                  <textarea 
                    rows={3} 
                    placeholder="Provide context or terms regarding verification scope..."
                    value={formNotes}
                    onChange={e => setFormNotes(e.target.value)}
                    className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] p-3 text-xs text-neo-primary placeholder-neo-muted focus:shadow-neo-input-focus outline-none"
                  />
                </div>

                {/* File Dropzone */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-neo-secondary uppercase mb-1">Upload File Attachment *</label>
                  <div className="bg-neo-base shadow-neo-input border-2 border-dashed border-gray-400 dark:border-gray-700 rounded-[16px] p-8 text-center cursor-pointer relative hover:border-neo-accent transition-colors">
                    <input 
                      type="file" 
                      accept=".pdf,.docx,.jpg,.png"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-3 bg-neo-base shadow-neo-badge rounded-full">
                        <Upload className="text-neo-accent" size={24} />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-neo-primary block">
                          {selectedFile ? selectedFile.name : 'Drag & drop file or click to browse'}
                        </span>
                        <span className="text-xs text-neo-muted">PDF, DOCX, JPG, or PNG (Max 20MB)</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar Simulation */}
                  {isUploading && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-neo-secondary">
                        <span>Uploading document attachments...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-3 bg-neo-base shadow-neo-input rounded-full overflow-hidden p-0.5">
                        <div 
                          className="h-full rounded-full bg-neo-accent transition-all duration-200" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {!isUploading && selectedFile && (
                    <div className="mt-4 flex items-center justify-between bg-neo-base shadow-neo-badge p-3 rounded-[12px]">
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-neo-accent" />
                        <span className="text-xs font-bold text-neo-primary truncate max-w-xs">{selectedFile.name}</span>
                        <span className="text-[10px] text-neo-muted">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setSelectedFile(null)}
                        className="text-neo-danger p-1 rounded-full shadow-neo-icon-btn hover:shadow-neo-icon-btn-hover"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 border-t border-gray-300 dark:border-gray-800 pt-6 bg-neo-base">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="bg-neo-base shadow-neo-btn hover:shadow-neo-btn-hover active:shadow-neo-btn-active text-neo-secondary font-bold px-5 py-2.5 rounded-[12px] text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`bg-neo-base shadow-neo-btn hover:shadow-neo-btn-hover active:shadow-neo-btn-active text-neo-accent font-black px-6 py-2.5 rounded-[12px] text-xs flex items-center gap-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Register Document
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* DRAWER: DOCUMENT PREVIEW */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/45 dark:bg-black/60 animate-fade-in" onClick={() => setPreviewDoc(null)}>
          <div 
            className="bg-neo-base shadow-neo-modal w-full max-w-xl h-full p-8 overflow-y-auto space-y-8 animate-slide-up flex flex-col"
            onClick={e => e.stopPropagation()}
            style={{ borderRadius: '20px 0 0 20px' }}
          >
            
            {/* Drawer Header */}
            <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-800 pb-4 bg-neo-base">
              <div className="flex items-center gap-3">
                <FolderLock className="text-neo-accent" size={24} />
                <div>
                  <h3 className="text-md font-black font-roboto uppercase text-neo-primary">{previewDoc.id}</h3>
                  <span className="text-xs text-neo-muted">Verified Document Registry Entry</span>
                </div>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="text-neo-muted hover:text-neo-primary p-2 rounded-full shadow-neo-icon-btn hover:shadow-neo-icon-btn-hover"
              >
                <X size={16} />
              </button>
            </div>

            {/* Document Quick Metadata Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neo-base shadow-neo-badge p-4 rounded-[12px]">
                <span className="text-[10px] font-bold text-neo-muted uppercase block">Document Status</span>
                <span className="text-sm font-extrabold text-neo-primary mt-1 block uppercase">{previewDoc.status}</span>
              </div>
              <div className="bg-neo-base shadow-neo-badge p-4 rounded-[12px]">
                <span className="text-[10px] font-bold text-neo-muted uppercase block">File Capacity</span>
                <span className="text-sm font-extrabold text-neo-primary mt-1 block">{previewDoc.fileSize}</span>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="space-y-4 text-xs font-semibold text-neo-secondary">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neo-muted uppercase block">Document Name</span>
                <p className="text-sm font-extrabold text-neo-primary">{previewDoc.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-[10px] font-bold text-neo-muted uppercase block">Vendor Link</span>
                  <p className="text-xs font-bold text-neo-primary">{previewDoc.vendorName}</p>
                  <p className="text-[10px] text-neo-muted">{previewDoc.vendorId}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neo-muted uppercase block">Category Type</span>
                  <p className="text-xs font-bold text-neo-primary">{previewDoc.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-[10px] font-bold text-neo-muted uppercase block">Reference/Cert ID</span>
                  <p className="text-xs font-bold text-neo-accent">{previewDoc.referenceNumber}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neo-muted uppercase block">Verified Authority</span>
                  <p className="text-xs font-bold text-neo-primary">{previewDoc.issuingAuthority || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-300 dark:border-gray-800 pt-4">
                <div>
                  <span className="text-[10px] font-bold text-neo-muted uppercase block">Date Registered</span>
                  <p className="text-xs font-bold text-neo-primary">{previewDoc.uploadDate}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neo-muted uppercase block">Date Issued</span>
                  <p className="text-xs font-bold text-neo-primary">{previewDoc.issueDate || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neo-muted uppercase block">Expiry Date</span>
                  <p className="text-xs font-bold text-neo-primary">{previewDoc.expiryDate}</p>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-bold text-neo-muted uppercase block">Verifying Compliance Auditor</span>
                <p className="text-xs font-bold text-neo-primary">{previewDoc.verifiedBy}</p>
              </div>

              <div className="pt-2 space-y-1">
                <span className="text-[10px] font-bold text-neo-muted uppercase block">Internal Audit Remarks</span>
                <p className="text-xs bg-neo-base shadow-neo-input rounded-[12px] p-4 text-neo-primary italic font-normal leading-relaxed">
                  "{previewDoc.notes || 'No remarks recorded for this certificate registry.'}"
                </p>
              </div>
            </div>

            {/* Mock PDF Viewer Box */}
            <div className="flex-1 min-h-[180px] bg-neo-base shadow-neo-input rounded-[16px] p-6 flex flex-col justify-between items-center border border-gray-300 dark:border-gray-800">
              <div className="flex flex-col items-center text-center space-y-3 mt-4">
                <FileText className="text-neo-accent" size={36} />
                <div>
                  <span className="text-xs font-bold text-neo-primary block">{previewDoc.id}_secure_vault.pdf</span>
                  <span className="text-[10px] text-neo-muted">Digitally Encrypted Compliance Document</span>
                </div>
              </div>
              <button 
                onClick={() => showToast(`Initiating secure download for ${previewDoc.id}...`, 'info')}
                className="bg-neo-base shadow-neo-btn hover:shadow-neo-btn-hover active:shadow-neo-btn-active text-xs font-bold text-neo-accent px-4 py-2 rounded-[10px] flex items-center gap-2"
              >
                <Download size={12} /> Download PDF Attachment
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
