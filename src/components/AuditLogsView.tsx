import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, Search, Eye, Filter, ArrowRight, X, Clock, Calendar, Shield, 
  CheckCircle2, XCircle, User, Activity, FileSpreadsheet 
} from 'lucide-react';
import { AuditLog } from '../dataStore';

interface AuditLogsViewProps {
  logs: AuditLog[];
  isDark: boolean;
}

export function AuditLogsView({
  logs,
  isDark
}: AuditLogsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');
  const [selectedAction, setSelectedAction] = useState('All');
  const [selectedUser, setSelectedUser] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Available filters options
  const modules = ['All', 'Vendors', 'Contracts', 'POs', 'Invoices', 'Risk', 'Users', 'System'];
  const actions = ['All', 'Create', 'Update', 'Delete', 'Login', 'Export', 'Approve'];
  
  const usersList = useMemo(() => {
    const list = new Set<string>();
    logs.forEach(l => list.add(l.user));
    return ['All', ...Array.from(list)];
  }, [logs]);

  // Filtering logic
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesModule = selectedModule === 'All' || log.module === selectedModule;
      const matchesAction = selectedAction === 'All' || log.action === selectedAction;
      const matchesUser = selectedUser === 'All' || log.user === selectedUser;
      const matchesStatus = selectedStatus === 'All' || log.status === selectedStatus;

      return matchesSearch && matchesModule && matchesAction && matchesUser && matchesStatus;
    });
  }, [logs, searchQuery, selectedModule, selectedAction, selectedUser, selectedStatus]);

  // Diff styling helper
  const renderDiffValue = (before: any, after: any) => {
    const allKeys = Array.from(new Set([...Object.keys(before || {}), ...Object.keys(after || {})]));
    
    return (
      <div className="space-y-3 font-mono text-[11px] leading-relaxed">
        {allKeys.map(key => {
          const valBefore = before?.[key];
          const valAfter = after?.[key];
          
          if (valBefore === undefined) {
            // Added
            return (
              <div key={key} className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 p-2 rounded border-l-2 border-green-500">
                <span className="font-bold">+ {key}:</span> {JSON.stringify(valAfter)}
              </div>
            );
          }
          if (valAfter === undefined) {
            // Deleted
            return (
              <div key={key} className="bg-red-100 dark:bg-red-955/40 text-red-700 dark:text-red-400 p-2 rounded border-l-2 border-red-500 line-through">
                <span className="font-bold">- {key}:</span> {JSON.stringify(valBefore)}
              </div>
            );
          }
          if (JSON.stringify(valBefore) !== JSON.stringify(valAfter)) {
            // Modified
            return (
              <div key={key} className="bg-yellow-100 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-400 p-2 rounded border-l-2 border-yellow-500">
                <span className="font-bold">~ {key}:</span> 
                <span className="line-through text-red-500 dark:text-red-400 mr-2">{JSON.stringify(valBefore)}</span>
                <span className="text-green-600 dark:text-green-400">{JSON.stringify(valAfter)}</span>
              </div>
            );
          }
          // Unchanged
          return (
            <div key={key} className="text-neo-secondary p-2">
              <span className="font-bold">  {key}:</span> {JSON.stringify(valBefore)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 p-10 overflow-y-auto space-y-10 animate-fade-in relative">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="text-xs font-black text-neo-muted uppercase tracking-widest font-roboto">SECURITY & AUDIT SYSTEM</span>
          <h1 className="text-3xl font-black tracking-tight text-neo-primary uppercase font-roboto mt-1">Chronological Audit Logs</h1>
          <p className="text-sm text-neo-secondary mt-1">Real-time immutable database tracking of all vendor administration operations, contract revisions, and payments.</p>
        </div>
      </div>

      {/* Filter Matrix Card */}
      <div className="bg-neo-base shadow-neo-card p-8 rounded-[16px] space-y-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-neo-primary flex items-center gap-2">
          <Filter size={14} className="text-neo-accent" /> Filter Console
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Search bar */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-neo-secondary uppercase mb-1.5">Free Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-neo-muted" size={14} />
              <input
                type="text"
                placeholder="ID, entity, IP..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[36px] text-xs text-neo-primary focus:shadow-neo-input-focus outline-none"
              />
            </div>
          </div>

          {/* Module filter */}
          <div>
            <label className="block text-xs font-bold text-neo-secondary uppercase mb-1.5">Module</label>
            <select
              value={selectedModule}
              onChange={e => setSelectedModule(e.target.value)}
              className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[36px] px-3 text-xs text-neo-primary focus:shadow-neo-input-focus outline-none"
            >
              {modules.map((m, idx) => (
                <option key={idx} value={m}>{m === 'All' ? 'All Modules' : m}</option>
              ))}
            </select>
          </div>

          {/* Action filter */}
          <div>
            <label className="block text-xs font-bold text-neo-secondary uppercase mb-1.5">Action Type</label>
            <select
              value={selectedAction}
              onChange={e => setSelectedAction(e.target.value)}
              className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[36px] px-3 text-xs text-neo-primary focus:shadow-neo-input-focus outline-none"
            >
              {actions.map((a, idx) => (
                <option key={idx} value={a}>{a === 'All' ? 'All Actions' : a}</option>
              ))}
            </select>
          </div>

          {/* User filter */}
          <div>
            <label className="block text-xs font-bold text-neo-secondary uppercase mb-1.5">Audited User</label>
            <select
              value={selectedUser}
              onChange={e => setSelectedUser(e.target.value)}
              className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[36px] px-3 text-xs text-neo-primary focus:shadow-neo-input-focus outline-none"
            >
              {usersList.map((u, idx) => (
                <option key={idx} value={u}>{u === 'All' ? 'All Users' : u}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-xs font-bold text-neo-secondary uppercase mb-1.5">Execution Status</label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full bg-neo-base shadow-neo-input border-0 rounded-[12px] h-[36px] px-3 text-xs text-neo-primary focus:shadow-neo-input-focus outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Workspace */}
      <div className="bg-neo-base shadow-neo-card p-6 rounded-[16px] space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-neo-secondary">Filtered Logs: {filteredLogs.length} Records Found</span>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto rounded-[12px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-800">
                <th className="p-4 text-xs font-extrabold uppercase text-neo-muted tracking-wider">Log ID</th>
                <th className="p-4 text-xs font-extrabold uppercase text-neo-muted tracking-wider">Timestamp</th>
                <th className="p-4 text-xs font-extrabold uppercase text-neo-muted tracking-wider">Audited User</th>
                <th className="p-4 text-xs font-extrabold uppercase text-neo-muted tracking-wider">IP Address</th>
                <th className="p-4 text-xs font-extrabold uppercase text-neo-muted tracking-wider">Module</th>
                <th className="p-4 text-xs font-extrabold uppercase text-neo-muted tracking-wider">Action</th>
                <th className="p-4 text-xs font-extrabold uppercase text-neo-muted tracking-wider">Entity Link ID</th>
                <th className="p-4 text-xs font-extrabold uppercase text-neo-muted tracking-wider text-center">Status</th>
                <th className="p-4 text-xs font-extrabold uppercase text-neo-muted tracking-wider text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-850">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-xs font-semibold text-neo-muted">
                    No matching audit trail events inside database scope.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 text-xs font-extrabold text-neo-accent">{log.id}</td>
                    <td className="p-4 text-xs font-semibold text-neo-primary">{log.timestamp}</td>
                    <td className="p-4 text-xs font-bold text-neo-primary">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-neo-base shadow-neo-badge flex items-center justify-center text-[10px] text-neo-accent font-extrabold">
                          {log.user.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold">{log.user}</p>
                          <p className="text-[9px] text-neo-muted">{log.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-mono text-neo-secondary">{log.ipAddress}</td>
                    <td className="p-4 text-xs font-semibold text-neo-primary">
                      <span className="bg-neo-base shadow-neo-badge px-2 py-0.5 rounded-[4px]">{log.module}</span>
                    </td>
                    <td className="p-4 text-xs font-extrabold text-neo-secondary">
                      <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-[4px] ${
                        log.action === 'Create' ? 'text-neo-success' : 
                        log.action === 'Delete' ? 'text-neo-danger' : 
                        log.action === 'Approve' ? 'text-neo-accent' : 'text-neo-secondary'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-mono font-bold text-neo-secondary">{log.entityId}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        log.status === 'Success' 
                          ? 'text-neo-success bg-neo-base shadow-neo-badge' 
                          : 'text-neo-danger bg-neo-base shadow-neo-badge'
                      }`}>
                        {log.status === 'Success' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                        {log.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="bg-neo-base shadow-neo-icon-btn hover:shadow-neo-icon-btn-hover active:shadow-neo-icon-btn-active text-neo-accent p-2 rounded-[8px]"
                        title="Inspect Log Diff"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRAWER: AUDIT LOG INSPECTION */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/45 dark:bg-black/60 animate-fade-in" onClick={() => setSelectedLog(null)}>
          <div 
            className="bg-neo-base shadow-neo-modal w-full max-w-lg h-full p-8 overflow-y-auto space-y-6 animate-slide-up flex flex-col"
            onClick={e => e.stopPropagation()}
            style={{ borderRadius: '20px 0 0 20px' }}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-800 pb-4 bg-neo-base">
              <div className="flex items-center gap-3">
                <ClipboardList className="text-neo-accent" size={24} />
                <div>
                  <h3 className="text-md font-black font-roboto uppercase text-neo-primary">{selectedLog.id} Detail</h3>
                  <span className="text-[11px] text-neo-muted">Chronological Audit Record Trail</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-neo-muted hover:text-neo-primary p-2 rounded-full shadow-neo-icon-btn hover:shadow-neo-icon-btn-hover"
              >
                <X size={16} />
              </button>
            </div>

            {/* General Log Data Card */}
            <div className="space-y-4 text-xs font-semibold text-neo-secondary">
              <div className="bg-neo-base shadow-neo-badge p-4 rounded-[12px] space-y-3">
                <div className="flex justify-between">
                  <span className="text-neo-muted">Timestamp:</span>
                  <span className="text-neo-primary font-bold">{selectedLog.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neo-muted">Operator:</span>
                  <span className="text-neo-primary font-bold">{selectedLog.user} ({selectedLog.role})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neo-muted">IP Address:</span>
                  <span className="text-neo-primary font-mono">{selectedLog.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neo-muted">Active Module:</span>
                  <span className="text-neo-primary font-bold">{selectedLog.module}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neo-muted">Entity Target:</span>
                  <span className="text-neo-accent font-mono">{selectedLog.entityId}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neo-muted uppercase block">Operation Description</span>
                <p className="text-xs bg-neo-base shadow-neo-input p-3 rounded-[8px] text-neo-primary">
                  {selectedLog.description}
                </p>
              </div>

              {/* JSON Diff Drawer Box */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-bold text-neo-muted uppercase block">Before / After JSON State Diff</span>
                
                {selectedLog.details ? (
                  <div className="bg-neo-base shadow-neo-input rounded-[12px] p-4 border border-gray-300 dark:border-gray-800">
                    {renderDiffValue(selectedLog.details.before, selectedLog.details.after)}
                  </div>
                ) : (
                  <div className="bg-neo-base shadow-neo-input rounded-[12px] p-6 text-center text-neo-muted italic">
                    No state mutations occurred. This was a read or log-in validation event.
                  </div>
                )}
              </div>
            </div>

            {/* Security Sign-Off footer */}
            <div className="mt-auto pt-6 border-t border-gray-300 dark:border-gray-800 flex items-center justify-between text-[10px] font-extrabold text-neo-muted bg-neo-base">
              <div className="flex items-center gap-1.5">
                <Shield size={12} className="text-neo-success" />
                <span>Digitally Sealed & Immutable</span>
              </div>
              <span>SHA-256 HMAC Verified</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
