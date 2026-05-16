import { useState, useEffect } from 'react';
import type { JobFormData, Job } from '../../types';
import { Input, Textarea } from '../ui/Input';
import Button from '../ui/Button';
import { extractApiError } from '../../utils/apiError';

interface JobFormProps {
  initial?: Partial<Job>;
  onSubmit: (data: JobFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

const CATEGORIES = [
  'Engineering', 'Design', 'Marketing', 'Sales', 'Finance',
  'Operations', 'HR', 'Legal', 'Product', 'Data', 'Customer Support', 'Other',
];

export default function JobForm({ initial, onSubmit, onCancel, submitLabel = 'Post Job' }: JobFormProps) {
  const [form, setForm] = useState<JobFormData>({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    requirements: initial?.requirements ?? '',
    location: initial?.location ?? '',
    salaryRange: initial?.salaryRange ?? '',
    category: initial?.category ?? '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title ?? '',
        description: initial.description ?? '',
        requirements: initial.requirements ?? '',
        location: initial.location ?? '',
        salaryRange: initial.salaryRange ?? '',
        category: initial.category ?? '',
      });
    }
  }, [initial]);

  const set = (field: keyof JobFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.requirements.trim()) errs.requirements = 'Requirements are required';
    if (!form.location.trim()) errs.location = 'Location is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      await onSubmit({
        ...form,
        salaryRange: form.salaryRange || undefined,
        category: form.category || undefined,
      });
    } catch (err) {
      setServerError(extractApiError(err, 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {serverError && <div className="alert alert-error">{serverError}</div>}

      <Input
        id="job-title"
        label="Job Title *"
        placeholder="e.g. Senior React Developer"
        value={form.title}
        onChange={set('title')}
        error={errors.title}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Input
          id="job-location"
          label="Location *"
          placeholder="e.g. New York, NY / Remote"
          value={form.location}
          onChange={set('location')}
          error={errors.location}
        />
        <Input
          id="job-salary"
          label="Salary Range"
          placeholder="e.g. $80,000 – $120,000"
          value={form.salaryRange ?? ''}
          onChange={set('salaryRange')}
        />
      </div>

      <div className="input-wrapper">
        <label htmlFor="job-category" className="input-label">Category</label>
        <select
          id="job-category"
          className="input"
          value={form.category ?? ''}
          onChange={set('category')}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <Textarea
        id="job-description"
        label="Job Description *"
        placeholder="Describe the role, responsibilities, and what makes it exciting..."
        value={form.description}
        onChange={set('description')}
        error={errors.description}
        style={{ minHeight: 120 }}
      />

      <Textarea
        id="job-requirements"
        label="Requirements *"
        placeholder="List skills, experience, and qualifications..."
        value={form.requirements}
        onChange={set('requirements')}
        error={errors.requirements}
        style={{ minHeight: 100 }}
      />

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button id="job-form-submit" type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
