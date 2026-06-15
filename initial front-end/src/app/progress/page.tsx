'use client';

import { useEffect, useState, useCallback } from 'react';
import type { ProgressEntryData, SRALevel, ProgressStats } from '@/types';
import { formatDate, getScorePercentage, getGradeLabel, getGradeColor } from '@/lib/utils';

export default function ProgressPage() {
  const [entries, setEntries] = useState<ProgressEntryData[]>([]);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [levels, setLevels] = useState<SRALevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchLevel, setSearchLevel] = useState('');

  // Form state
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    colorLevelId: '',
    targetColorLevelId: '',
    powerBuildersCompleted: 1,
    score: 0,
    totalItems: 20,
    timeframe: 'daily',
    notes: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [progressRes, levelsRes] = await Promise.all([
        fetch('/api/progress'),
        fetch('/api/sra-levels'),
      ]);
      if (progressRes.ok) {
        const data = await progressRes.json();
        setEntries(data.entries || []);
        setStats(data.stats || null);
      }
      if (levelsRes.ok) {
        const data = await levelsRes.json();
        setLevels(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().split('T')[0],
      colorLevelId: '',
      targetColorLevelId: '',
      powerBuildersCompleted: 1,
      score: 0,
      totalItems: 20,
      timeframe: 'daily',
      notes: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (entry: ProgressEntryData) => {
    setForm({
      date: entry.date.split('T')[0],
      colorLevelId: entry.colorLevelId,
      targetColorLevelId: entry.targetColorLevelId || '',
      powerBuildersCompleted: entry.powerBuildersCompleted,
      score: entry.score,
      totalItems: entry.totalItems,
      timeframe: entry.timeframe,
      notes: entry.notes || '',
    });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this progress entry?')) return;
    try {
      const res = await fetch(`/api/progress/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/progress/${editingId}` : '/api/progress';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        resetForm();
        fetchData();
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const filteredLevels = levels.filter(
    (l) => l.code.toLowerCase().includes(searchLevel.toLowerCase()) ||
           l.name.toLowerCase().includes(searchLevel.toLowerCase())
  );

  const getLevel = (id: string) => levels.find((l) => l.id === id);

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ padding: 'var(--space-16)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
        Loading progress data...
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1>Progress Report</h1>
          <p>Track and monitor your SRA reading progress</p>
        </div>
        <button className="btn btn--primary" onClick={() => { resetForm(); setShowForm(true); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Entry
        </button>
      </div>

      {/* Stats Dashboard */}
      {stats && (
        <div className="stats-grid">
          <div className="glass-card stat-card">
            <div className="stat-card__label">Total Power Builders</div>
            <div className="stat-card__value">{stats.totalPowerBuilders}</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-card__label">Average Score</div>
            <div className="stat-card__value" style={{ color: getGradeColor(stats.averageScore) }}>
              {stats.averageScore}%
            </div>
            <div className="stat-card__sub">{getGradeLabel(stats.averageScore)}</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-card__label">Highest Score</div>
            <div className="stat-card__value" style={{ color: 'var(--color-success)' }}>
              {stats.highestScore}%
            </div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-card__label">Lowest Score</div>
            <div className="stat-card__value" style={{ color: 'var(--color-warning)' }}>
              {stats.lowestScore}%
            </div>
          </div>
        </div>
      )}

      {/* Progress Entries Table */}
      <section className="section">
        <h3 className="section__title">Progress Entries</h3>
        {entries.length === 0 ? (
          <div className="glass-card empty-state">
            <svg className="empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <div className="empty-state__title">No entries yet</div>
            <div className="empty-state__text">
              Start tracking your SRA progress by adding your first Power Builder entry.
            </div>
            <button className="btn btn--primary" onClick={() => setShowForm(true)}>
              Add Your First Entry
            </button>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Level</th>
                    <th>PBs Done</th>
                    <th>Score</th>
                    <th>Grade</th>
                    <th>Timeframe</th>
                    <th>Notes</th>
                    <th style={{ width: 100 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => {
                    const pct = getScorePercentage(entry.score, entry.totalItems);
                    return (
                      <tr key={entry.id}>
                        <td>{formatDate(entry.date)}</td>
                        <td>
                          <span className="color-swatch">
                            <span className="color-swatch__dot" style={{ background: entry.colorLevel?.hexColor }} />
                            {entry.colorLevel?.code}
                          </span>
                        </td>
                        <td>{entry.powerBuildersCompleted}</td>
                        <td>{entry.score}/{entry.totalItems} ({pct}%)</td>
                        <td>
                          <span className="badge" style={{ background: getGradeColor(pct), color: '#fff', opacity: 0.9 }}>
                            {getGradeLabel(pct)}
                          </span>
                        </td>
                        <td style={{ textTransform: 'capitalize' }}>{entry.timeframe}</td>
                        <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {entry.notes || '—'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                            <button className="btn btn--ghost btn--sm" onClick={() => handleEdit(entry)} aria-label="Edit entry">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button className="btn btn--danger btn--sm" onClick={() => handleDelete(entry.id)} aria-label="Delete entry">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}>
          <div className="modal">
            <div className="modal__header">
              <h3 className="modal__title">{editingId ? 'Edit Entry' : 'Add Progress Entry'}</h3>
              <button className="modal__close" onClick={resetForm} aria-label="Close modal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                <div className="form-grid">
                  <div className="input-group">
                    <label htmlFor="entry-date" className="input-label">Date</label>
                    <input
                      id="entry-date"
                      type="date"
                      className="input"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="entry-timeframe" className="input-label">Timeframe</label>
                    <select
                      id="entry-timeframe"
                      className="input select"
                      value={form.timeframe}
                      onChange={(e) => setForm({ ...form, timeframe: e.target.value })}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                {/* Color Level Selector */}
                <div className="input-group">
                  <label className="input-label">Current SRA Color Level</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Search levels..."
                    value={searchLevel}
                    onChange={(e) => setSearchLevel(e.target.value)}
                  />
                  <div className="level-selector__grid">
                    {filteredLevels.map((level) => (
                      <div
                        key={level.id}
                        className={`level-selector__item ${form.colorLevelId === level.id ? 'level-selector__item--selected' : ''}`}
                        onClick={() => setForm({ ...form, colorLevelId: level.id })}
                      >
                        <span className="color-swatch__dot" style={{ background: level.hexColor }} />
                        <span>{level.code}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target Level */}
                <div className="input-group">
                  <label htmlFor="entry-target" className="input-label">Target Color Level (optional)</label>
                  <select
                    id="entry-target"
                    className="input select"
                    value={form.targetColorLevelId}
                    onChange={(e) => setForm({ ...form, targetColorLevelId: e.target.value })}
                  >
                    <option value="">No target</option>
                    {levels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.code} — {level.name} (Grade {level.gradeLevel})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-grid">
                  <div className="input-group">
                    <label htmlFor="entry-pbs" className="input-label">Power Builders Completed</label>
                    <input
                      id="entry-pbs"
                      type="number"
                      className="input"
                      min="1"
                      value={form.powerBuildersCompleted}
                      onChange={(e) => setForm({ ...form, powerBuildersCompleted: parseInt(e.target.value) || 1 })}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="entry-total" className="input-label">Total Items</label>
                    <input
                      id="entry-total"
                      type="number"
                      className="input"
                      min="1"
                      value={form.totalItems}
                      onChange={(e) => setForm({ ...form, totalItems: parseInt(e.target.value) || 20 })}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="entry-score" className="input-label">
                    Score ({form.totalItems > 0 ? getScorePercentage(form.score, form.totalItems) : 0}%)
                  </label>
                  <input
                    id="entry-score"
                    type="number"
                    className="input"
                    min="0"
                    max={form.totalItems}
                    value={form.score}
                    onChange={(e) => setForm({ ...form, score: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="entry-notes" className="input-label">Notes (optional)</label>
                  <textarea
                    id="entry-notes"
                    className="input textarea"
                    placeholder="Any reflections or observations..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="modal__actions">
                <button type="button" className="btn btn--secondary" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn btn--primary" disabled={!form.colorLevelId}>
                  {editingId ? 'Save Changes' : 'Add Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
