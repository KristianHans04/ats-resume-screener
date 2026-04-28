import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import Button from '../../components/ui/Button';

const DEPARTMENTS = ['Engineering', 'Analytics', 'Web Development', 'Product', 'Design', 'Operations', 'Finance', 'HR', 'Marketing', 'Legal'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const LOCATIONS = ['On-site', 'Remote', 'Hybrid'];

export default function CreateJobView() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', company: '', department: '', location: '', employment_type: '',
    salary: '', description: '', requirements: '', responsibilities: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setError(null);
    try {
      await apiFetch('/jobs/jobs/', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      navigate('/recruiter/role-config');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create job');
      setSubmitted(false);
    }
  }

  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full p-4 md:p-8 animate-fade-in-up">

      <Button variant="ghost" size="sm" className="self-start -ml-3 mb-6" onClick={() => navigate('/recruiter/role-config')}>
        ← Back to Jobs
      </Button>

      <div className="bg-white border border-border rounded-2xl shadow-sm p-6 md:p-10">

        {/* Header */}
        <div className="pb-6 mb-8 border-b border-border">
          <p className="font-mono text-xs tracking-widest uppercase text-accent mb-2">Recruiter Portal</p>
          <h1 className="font-display text-2xl text-neutral-dark mb-2">Post New Job Role</h1>
          <p className="text-sm text-gray-500">Fill in the details below. The CSAS AI engine will use your <span className="text-orange-500 font-semibold">Required Capabilities</span> to semantically rank applicant CVs.</p>
        </div>

        {error && <div className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>}

        <form className="space-y-8" onSubmit={handleSubmit}>

          {/* Section 1: Basic Info */}
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-gray-400 mb-4">1 — Basic Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="font-mono text-xs tracking-widest uppercase text-gray-500">Job Title *</label>
                <input required type="text" value={form.title} onChange={set('title')}
                  className="w-full bg-gray-50 border border-border rounded-lg p-3 text-sm focus:border-accent focus:outline-none transition-colors"
                  placeholder="e.g. Senior Backend Engineer" />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs tracking-widest uppercase text-gray-500">Company / Organisation *</label>
                <input required type="text" value={form.company} onChange={set('company')}
                  className="w-full bg-gray-50 border border-border rounded-lg p-3 text-sm focus:border-accent focus:outline-none transition-colors"
                  placeholder="e.g. Safaricom PLC" />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs tracking-widest uppercase text-gray-500">Department *</label>
                <select required value={form.department} onChange={set('department')}
                  className="w-full bg-gray-50 border border-border rounded-lg p-3 text-sm focus:border-accent focus:outline-none transition-colors text-gray-700">
                  <option value="">Select department...</option>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs tracking-widest uppercase text-gray-500">Employment Type *</label>
                <select required value={form.employment_type} onChange={set('employment_type')}
                  className="w-full bg-gray-50 border border-border rounded-lg p-3 text-sm focus:border-accent focus:outline-none transition-colors text-gray-700">
                  <option value="">Select type...</option>
                  {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Location */}
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-gray-400 mb-4">2 — Location</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="font-mono text-xs tracking-widest uppercase text-gray-500">City / Region *</label>
                <input required type="text" value={form.location} onChange={set('location')}
                  className="w-full bg-gray-50 border border-border rounded-lg p-3 text-sm focus:border-accent focus:outline-none transition-colors"
                  placeholder="e.g. Nairobi, Kenya" />
              </div>
            </div>
          </div>

          {/* Section 3: Role Description */}
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-gray-400 mb-4">3 — Role Description</p>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="font-mono text-xs tracking-widest uppercase text-gray-500">About the Role *</label>
                <textarea required value={form.description} onChange={set('description')}
                  className="w-full bg-gray-50 border border-border rounded-lg p-3 text-sm min-h-[100px] focus:border-accent focus:outline-none transition-colors resize-y"
                  placeholder="Describe the day-to-day responsibilities and the impact of this role..." />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs tracking-widest uppercase text-gray-500">
                  Required Capabilities <span className="text-orange-500">(AI Extraction Baseline) *</span>
                </label>
                <textarea required value={form.requirements} onChange={set('requirements')}
                  className="w-full bg-gray-50 border border-orange-200 rounded-lg p-3 text-sm min-h-[120px] focus:border-orange-400 focus:outline-none transition-colors resize-y"
                  placeholder={"- 5+ years Python/FastAPI\n- Distributed Systems Architecture\n- Kubernetes Orchestration\n- PostgreSQL & Redis"} />
                <p className="text-xs text-orange-500 font-mono tracking-wide">
                  ⚠ CSAS uses these as ground-truth vector embeddings to rank candidates semantically. Be specific.
                </p>
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs tracking-widest uppercase text-gray-500">Responsibilities *</label>
                <textarea required value={form.responsibilities} onChange={set('responsibilities')}
                  className="w-full bg-gray-50 border border-border rounded-lg p-3 text-sm min-h-[100px] focus:border-accent focus:outline-none transition-colors resize-y"
                  placeholder={"List core responsibilities..."} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => navigate('/recruiter/role-config')}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={submitted}>
              {submitted ? 'Publishing...' : 'Publish Job Role'}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}