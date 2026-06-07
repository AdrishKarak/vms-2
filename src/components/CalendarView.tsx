/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Filter, Plus, Calendar as LucideCalendar, 
  Clock, MapPin, User, Link as LinkIcon, X, Tag, ArrowLeft
} from 'lucide-react';
import { CalendarEvent, Vendor, Contract, PurchaseOrder, Invoice } from '../dataStore';

interface CalendarViewProps {
  vendors: Vendor[];
  contracts: Contract[];
  pos: PurchaseOrder[];
  invoices: Invoice[];
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  dark: boolean;
}

const EVENT_TYPE_COLORS: Record<CalendarEvent['type'], { bg: string, text: string, border: string, dot: string }> = {
  'Contract Renewal': { bg: 'bg-orange-50 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800', dot: 'bg-orange-500' },
  'Payment Due': { bg: 'bg-green-50 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-800', dot: 'bg-green-500' },
  'Document Expiry': { bg: 'bg-red-50 dark:bg-red-900/40', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800', dot: 'bg-red-500' },
  'Review Meeting': { bg: 'bg-purple-50 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800', dot: 'bg-purple-500' },
  'Audit Date': { bg: 'bg-amber-50 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', dot: 'bg-amber-500' },
  'Onboarding Deadline': { bg: 'bg-cyan-50 dark:bg-cyan-900/40', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800', dot: 'bg-cyan-500' },
  'PO Delivery': { bg: 'bg-slate-50 dark:bg-slate-800/60', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700', dot: 'bg-slate-500' },
  'Risk Assessment': { bg: 'bg-rose-50 dark:bg-rose-900/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800', dot: 'bg-rose-500' },
};

export const CalendarView: React.FC<CalendarViewProps> = ({
  vendors,
  contracts,
  pos,
  invoices,
  events,
  onAddEvent,
  dark
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'agenda'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2026-06-06'));
  const [filterType, setFilterType] = useState<string>('All');
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[] | null>(null);
  const [activePopover, setActivePopover] = useState<{ event: CalendarEvent; x: number; y: number } | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleMonthChange = (mStr: string) => {
    const m = parseInt(mStr, 10);
    setCurrentDate(new Date(currentDate.getFullYear(), m, 1));
  };

  const handleYearChange = (yStr: string) => {
    const y = parseInt(yStr, 10);
    setCurrentDate(new Date(y, currentDate.getMonth(), 1));
  };

  // Add Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<CalendarEvent['type']>('Review Meeting');
  const [newVendorId, setNewVendorId] = useState('');
  const [newEntityId, setNewEntityId] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-06-06');
  const [newAllDay, setNewAllDay] = useState(true);
  const [newStartTime, setNewStartTime] = useState('10:00');
  const [newEndTime, setNewEndTime] = useState('11:00');
  const [newRemind, setNewRemind] = useState('1 day before');
  const [newNotes, setNewNotes] = useState('');

  // Date Calculations for Month Grid
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000));
    }
  };

  const monthWeeks = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // ISO: Monday start
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const weeks: (Date | null)[][] = [[]];
    for (let i = 0; i < startOffset; i++) {
      weeks[0].push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentWeek = weeks[weeks.length - 1];
      if (currentWeek.length === 7) {
        weeks.push([]);
      }
      weeks[weeks.length - 1].push(new Date(year, month, day));
    }

    const lastWeek = weeks[weeks.length - 1];
    while (lastWeek.length < 7) {
      lastWeek.push(null);
    }

    return weeks;
  }, [year, month]);

  const filteredEvents = useMemo(() => {
    if (filterType === 'All') return events;
    return events.filter(e => e.type === filterType);
  }, [events, filterType]);

  const formatMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const getEventsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredEvents.filter(e => e.date === dateStr);
  };

  const handleChipClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    // Position popover
    setActivePopover({
      event,
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY + 8
    });
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    const dayEvents = getEventsForDay(date);
    if (dayEvents.length > 0) {
      setSelectedDayEvents(dayEvents);
    } else {
      const dateStr = date.toISOString().split('T')[0];
      setNewEventDate(dateStr);
      setAddModalOpen(true);
    }
  };

  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const selectedVendor = vendors.find(v => v.id === newVendorId);
    
    onAddEvent({
      title: newTitle,
      type: newType,
      vendorId: newVendorId || 'VND-001',
      vendorName: selectedVendor?.name || 'Central Sourcing Inc',
      entityId: newEntityId || 'N/A',
      date: newEventDate,
      allDay: newAllDay,
      startTime: newAllDay ? undefined : newStartTime,
      endTime: newAllDay ? undefined : newEndTime,
      remindMe: newRemind,
      assignTo: ['Alex Mercer'],
      notes: newNotes,
    });

    // Reset Form
    setNewTitle('');
    setNewNotes('');
    setAddModalOpen(false);
  };

  // Week View Calculations
  const weekDays = useMemo(() => {
    // Standardize to Monday of reference date
    const dayOfWeek = (currentDate.getDay() + 6) % 7;
    const monday = new Date(currentDate.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday.getTime() + i * 24 * 60 * 60 * 1000);
      return d;
    });
  }, [currentDate]);

  if (addModalOpen) {
    return (
      <div className="flex-1 p-8 overflow-y-auto w-full bg-[#F4F5F7] dark:bg-[#0D1117] text-[#111827] dark:text-[#F1F5F9] transition-colors duration-200">
        {/* FORM HEADER */}
        <div className="flex items-center gap-4 mb-8 border-b pb-4 border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setAddModalOpen(false)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition text-gray-600 dark:text-gray-300"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-roboto">Global Calendar Agenda Scheduler</span>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white uppercase font-roboto flex items-center gap-2">
              <LucideCalendar className="text-orange-600" /> Create New Calendar Event
            </h1>
          </div>
        </div>

        {/* FORM BOX */}
        <div className="bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl p-8 max-w-4xl">
          <form onSubmit={handleSubmitEvent} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Event Title *</label>
              <input 
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Contract Renegotiation Sync"
                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Event Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as CalendarEvent['type'])}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-2 text-xs outline-none focus:border-orange-500"
                >
                  <option value="Contract Renewal">Contract Renewal</option>
                  <option value="Payment Due">Payment Due</option>
                  <option value="Document Expiry">Document Expiry</option>
                  <option value="Review Meeting">Review Meeting</option>
                  <option value="Audit Date">Audit Date</option>
                  <option value="Onboarding Deadline">Onboarding Deadline</option>
                  <option value="PO Delivery">PO Delivery</option>
                  <option value="Risk Assessment">Risk Assessment</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Related Vendor</label>
                <select
                  value={newVendorId}
                  onChange={(e) => setNewVendorId(e.target.value)}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-2 text-xs outline-none focus:border-orange-500"
                >
                  <option value="">Select Vendor...</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Entity Reference ID</label>
                <input 
                  type="text"
                  value={newEntityId}
                  onChange={(e) => setNewEntityId(e.target.value)}
                  placeholder="e.g. CTR-1002, PO-0042"
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Event Date</label>
                <input 
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 py-1.5">
              <input 
                type="checkbox"
                id="allDayCheck"
                checked={newAllDay}
                onChange={(e) => setNewAllDay(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-700 h-4 w-4 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="allDayCheck" className="text-xs font-semibold text-gray-500">All-Day Event</label>
            </div>

            {!newAllDay && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Start Time</label>
                  <input 
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">End Time</label>
                  <input 
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Notes / Description</label>
              <textarea 
                rows={3}
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Review agenda parameters, operational guidelines, historical performance logs..."
                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-xs outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
              <button 
                type="button" 
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 border border-gray-350 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded font-semibold text-xs transition text-gray-500"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold text-xs shadow transition"
              >
                Save Event
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto w-full bg-[#F4F5F7] dark:bg-[#0D1117] text-[#111827] dark:text-[#F1F5F9] relative transition-colors duration-200">
      
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrev}
            className="p-2 border border-gray-300 dark:border-gray-750 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date('2026-06-06'))}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-750 text-xs font-semibold rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Today
          </button>
          <button 
            onClick={handleNext}
            className="p-2 border border-gray-300 dark:border-gray-750 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <ChevronRight size={16} />
          </button>
          <div className="flex items-center gap-2 ml-2">
            <select
              value={currentDate.getMonth()}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="bg-gray-50 dark:bg-[#1C2333] border border-gray-300 dark:border-gray-700 text-sm px-2 py-1 rounded outline-none font-bold"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={i}>
                  {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={currentDate.getFullYear()}
              onChange={(e) => handleYearChange(e.target.value)}
              className="bg-gray-50 dark:bg-[#1C2333] border border-gray-300 dark:border-gray-700 text-sm px-2 py-1 rounded outline-none font-bold"
            >
              {Array.from({ length: 16 }).map((_, i) => {
                const yr = 2020 + i;
                return (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-750">
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${viewMode === 'month' ? 'bg-white dark:bg-[#1C2035] text-orange-600 dark:text-orange-400 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${viewMode === 'week' ? 'bg-white dark:bg-[#1C2035] text-orange-600 dark:text-orange-400 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('agenda')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${viewMode === 'agenda' ? 'bg-white dark:bg-[#1C2035] text-orange-600 dark:text-orange-400 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Agenda
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Filter size={12} /> Filter:
          </span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-gray-50 dark:bg-[#1C2333] border border-gray-300 dark:border-gray-700 text-xs px-2.5 py-1.5 rounded outline-none focus:border-orange-500 font-medium"
          >
            <option value="All">All Event Types</option>
            <option value="Contract Renewal">Contract Renewal</option>
            <option value="Payment Due">Payment Due</option>
            <option value="Document Expiry">Document Expiry</option>
            <option value="Review Meeting">Review Meeting</option>
            <option value="Audit Date">Audit Date</option>
            <option value="Onboarding Deadline">Onboarding Deadline</option>
            <option value="PO Delivery">PO Delivery</option>
            <option value="Risk Assessment">Risk Assessment</option>
          </select>

          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-1.5 rounded shadow flex items-center gap-2 transition"
          >
            <Plus size={14} /> Add Event
          </button>
        </div>
      </div>

      <div className="flex gap-4 p-6 shrink-0">
        
        {/* Main Calendar Body */}
        <div className="flex-1 bg-white dark:bg-[#161B27] rounded-lg border border-gray-200 dark:border-gray-800 flex flex-col p-4 shadow-sm">
          
          {/* Weekday Labels (Month / Week) */}
          {viewMode !== 'agenda' && (
            <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800 pb-3 mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <div key={idx} className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  {day}
                </div>
              ))}
            </div>
          )}

          {/* Month Grid */}
          {viewMode === 'month' && (
            <div className="grid grid-rows-5 grid-cols-7 flex-1 gap-1.5">
              {monthWeeks.map((week, wIdx) => 
                week.map((day, dIdx) => {
                  if (!day) {
                    return <div key={`empty-${wIdx}-${dIdx}`} className="bg-gray-50 dark:bg-[#0F121F]/20 opacity-30 border border-transparent rounded"></div>;
                  }
                  
                  const dayEvents = getEventsForDay(day);
                  const isToday = day.toISOString().split('T')[0] === '2026-06-06';
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                  return (
                    <div 
                      key={day.getTime()}
                      onClick={() => handleDayClick(day)}
                      className={`calendar-day-cell min-h-[100px] border border-gray-100 dark:border-gray-850 p-2 rounded flex flex-col cursor-pointer ${isWeekend ? 'bg-gray-50/50 dark:bg-[#0E121C]/20' : ''}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-xs font-bold ${isToday ? 'bg-orange-600 text-white w-5 h-5 flex items-center justify-center rounded-full' : 'text-gray-400 dark:text-gray-500'}`}>
                          {day.getDate()}
                        </span>
                        {dayEvents.length > 3 && (
                          <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold px-1 rounded">
                            +{dayEvents.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 flex-1 overflow-hidden">
                        {dayEvents.slice(0, 3).map(ev => {
                          const colors = EVENT_TYPE_COLORS[ev.type] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-500' };
                          return (
                            <div 
                              key={ev.id}
                              onClick={(e) => handleChipClick(e, ev)}
                              className={`truncate text-[10px] font-medium py-0.5 px-1.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}
                              title={ev.title}
                            >
                              {ev.title}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Week View */}
          {viewMode === 'week' && (
            <div className="flex-1 grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isToday = day.toISOString().split('T')[0] === '2026-06-06';
                
                return (
                  <div key={day.getTime()} className="border-r border-gray-100 dark:border-gray-800 last:border-0 p-2 flex flex-col min-h-[400px]">
                    <div className="text-center pb-2 mb-3 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{day.toLocaleDateString('default', { weekday: 'short' })}</p>
                      <p className={`text-lg font-bold inline-block px-2 py-0.5 rounded-full ${isToday ? 'bg-orange-600 text-white' : ''}`}>{day.getDate()}</p>
                    </div>

                    <div className="space-y-2.5 flex-1">
                      {dayEvents.map(ev => {
                        const colors = EVENT_TYPE_COLORS[ev.type];
                        return (
                          <div 
                            key={ev.id}
                            onClick={(e) => handleChipClick(e, ev)}
                            className={`p-2 rounded border cursor-pointer hover:shadow-sm ${colors.bg} ${colors.text} ${colors.border}`}
                          >
                            <p className="text-[10px] uppercase font-bold tracking-wider mb-1">{ev.type}</p>
                            <p className="text-xs font-semibold leading-snug">{ev.title}</p>
                            <span className="text-[9px] block text-gray-500 dark:text-gray-400 mt-1">{ev.vendorName}</span>
                          </div>
                        );
                      })}

                      {dayEvents.length === 0 && (
                        <div className="text-center py-12 text-gray-300 dark:text-gray-700 text-xs font-medium">
                          No Events
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Agenda View */}
          {viewMode === 'agenda' && (
            <div className="space-y-6">
              {filteredEvents.length > 0 ? (
                Object.entries(
                  filteredEvents.reduce((groups, ev) => {
                    const date = ev.date;
                    if (!groups[date]) groups[date] = [];
                    groups[date].push(ev);
                    return groups;
                  }, {} as Record<string, CalendarEvent[]>)
                ).sort(([a], [b]) => a.localeCompare(b)).map(([dateStr, dayEvs]) => {
                  const dateObj = new Date(dateStr);
                  const isToday = dateStr === '2026-06-06';
                  
                  return (
                    <div key={dateStr} className="flex gap-4 border-b border-gray-100 dark:border-gray-850 pb-4 last:border-0">
                      <div className="w-32 flex-shrink-0 text-right pr-4 border-r border-gray-150 dark:border-gray-800">
                        <p className={`text-xs font-bold leading-tight ${isToday ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400 dark:text-gray-500'}`}>
                          {dateObj.toLocaleDateString('default', { weekday: 'long' })}
                        </p>
                        <p className={`text-xl font-roboto font-black ${isToday ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'}`}>
                          {dateObj.toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex-1 space-y-3">
                        {(dayEvs as CalendarEvent[]).map(ev => {
                          const colors = EVENT_TYPE_COLORS[ev.type];
                          return (
                            <div 
                              key={ev.id}
                              onClick={(e) => handleChipClick(e, ev)}
                              className="calendar-agenda-item align-middle group p-3 bg-gray-50 dark:bg-[#1E2333]/40 border border-gray-150 dark:border-gray-800 rounded-md cursor-pointer flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${colors.dot}`}></span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{ev.type}</span>
                                    {ev.entityId && <span className="text-[9px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-1 rounded">{ev.entityId}</span>}
                                  </div>
                                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5">{ev.title}</h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-3">
                                    <span>Vendor: <b>{ev.vendorName}</b></span>
                                    <span>• Priority: High</span>
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{ev.allDay ? 'All Day' : `${ev.startTime} - ${ev.endTime}`}</p>
                                <span className="text-[10px] text-gray-400 mt-1 block">Remind: {ev.remindMe}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 text-gray-300 dark:text-gray-700">
                  <LucideCalendar size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="font-bold">No Events Found</p>
                  <p className="text-xs">Adjust filters or create a new event for this view.</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Mini Calendar/Upcoming Sidebar Widget */}
        <div className="w-80 hidden lg:flex flex-col gap-4">
          
          {/* Mini Calendar Tracker card */}
          <div className="p-4 bg-white dark:bg-[#161B27] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
            <h3 className="font-roboto font-extrabold text-[#111827] dark:text-[#F1F5F9] text-xs uppercase tracking-widest mb-3">
              Event Heatmap
            </h3>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 mb-2">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
            
            {/* Short grid map for 5 weeks in June 2026 */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={`empty-m-${i}`} className="text-gray-200 dark:text-gray-800">•</span>
              ))}
              {Array.from({ length: 30 }).map((_, i) => {
                const dayNum = i + 1;
                const dStr = `2026-06-${String(dayNum).padStart(2, '0')}`;
                const hasEvents = events.some(e => e.date === dStr);
                const isToday = dayNum === 6;

                return (
                  <span 
                    key={i} 
                    onClick={() => setCurrentDate(new Date(`2026-06-${dayNum}`))}
                    className={`calendar-heatmap-cell p-1 rounded cursor-pointer ${isToday ? 'bg-orange-600 text-white' : ''} ${hasEvents && !isToday ? 'border-b-2 border-amber-500 font-bold text-gray-400' : 'text-gray-400'}`}
                  >
                    {dayNum}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Quick Info Alerts list */}
          <div className="p-4 bg-white dark:bg-[#161B27] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-roboto font-extrabold text-[#111827] dark:text-[#F1F5F9] text-xs uppercase tracking-widest">
                Upcoming Warnings
              </h3>
              <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-black px-1.5 py-0.5 rounded">
                Alerts Active
              </span>
            </div>

            <div className="space-y-3">
              {events.slice(0, 5).map(ev => {
                const colors = EVENT_TYPE_COLORS[ev.type];
                return (
                  <div key={ev.id} className="p-2.5 bg-gray-50 dark:bg-[#1C2030]/50 border border-gray-150 dark:border-gray-800 rounded text-xs">
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-gray-400">
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
                      {ev.type}
                    </div>
                    <p className="font-bold text-gray-800 dark:text-gray-200 leading-tight mb-1">{ev.title}</p>
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>{ev.date}</span>
                      <span>Assigned: Alex M.</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Popver View Details Card */}
      {activePopover && (
        <div 
          className="absolute z-50 w-76 bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl p-4 text-xs animate-in fade-in"
          style={{ 
            left: `${Math.min(activePopover.x, window.innerWidth - 320)}px`, 
            top: `${activePopover.y}px` 
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${EVENT_TYPE_COLORS[activePopover.event.type].bg} ${EVENT_TYPE_COLORS[activePopover.event.type].text} ${EVENT_TYPE_COLORS[activePopover.event.type].border}`}>
              {activePopover.event.type}
            </span>
            <button 
              onClick={() => setActivePopover(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={14} />
            </button>
          </div>

          <h4 className="font-roboto font-extrabold text-[#111827] dark:text-white text-sm tracking-tight mb-2">
            {activePopover.event.title}
          </h4>

          <div className="space-y-2 border-t border-gray-100 dark:border-gray-800 pt-2 mb-3">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <LucideCalendar size={12} className="opacity-70" />
              <span><b>Date:</b> {activePopover.event.date}</span>
            </div>
            {activePopover.event.startTime && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Clock size={12} className="opacity-70" />
                <span><b>Time:</b> {activePopover.event.startTime} - {activePopover.event.endTime}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Tag size={12} className="opacity-70" />
              <span><b>Vendor:</b> {activePopover.event.vendorName}</span>
            </div>
            {activePopover.event.entityId && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <LinkIcon size={12} className="opacity-70" />
                <span><b>Linked ID:</b> {activePopover.event.entityId}</span>
              </div>
            )}
          </div>

          {activePopover.event.notes && (
            <p className="bg-gray-50 dark:bg-[#1E2333]/50 p-2 rounded text-[10px] text-gray-500 italic mb-3">
              "{activePopover.event.notes}"
            </p>
          )}

          <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded text-[10px]">
            <span className="text-gray-400">Owner:</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{activePopover.event.assignTo[0]}</span>
          </div>
        </div>
      )}



      {/* Selected Day Events List Modal ("+N more" or Cell Double-Click) */}
      {selectedDayEvents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#161B27] border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gray-50 dark:bg-[#1C2333] px-6 py-4 border-b border-gray-150 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-roboto font-extrabold text-sm uppercase tracking-wider">
                Events Checklist ({selectedDate ? selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''})
              </h3>
              <button onClick={() => { setSelectedDayEvents(null); setSelectedDate(null); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-3 max-h-[360px] overflow-y-auto">
              {selectedDayEvents.map(ev => {
                const colors = EVENT_TYPE_COLORS[ev.type];
                return (
                  <div key={ev.id} className={`p-4 bg-gray-50 dark:bg-gray-800/40 rounded border ${colors.border}`}>
                    <p className="text-[10px] uppercase font-black text-gray-400 mb-1">{ev.type}</p>
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-snug">{ev.title}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Vendor: <b>{ev.vendorName}</b></span>
                    {ev.notes && <p className="mt-2 text-xs text-gray-400 italic">"{ev.notes}"</p>}
                  </div>
                );
              })}
            </div>

            <div className="bg-gray-50 dark:bg-[#1C2333] px-6 py-3 border-t border-gray-150 dark:border-gray-800 flex justify-between items-center">
              <button 
                onClick={() => {
                  if (selectedDate) {
                    const dateStr = selectedDate.toISOString().split('T')[0];
                    setNewEventDate(dateStr);
                    setSelectedDayEvents(null);
                    setAddModalOpen(true);
                  }
                }}
                className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded"
              >
                Add Event
              </button>
              <button 
                onClick={() => {
                  setSelectedDayEvents(null);
                  setSelectedDate(null);
                }}
                className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded"
              >
                Close List
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
