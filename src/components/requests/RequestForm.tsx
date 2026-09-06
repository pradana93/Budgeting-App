import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { ReimbursementRequestSchema, ReimbursementRequestData } from '@/utils/validation';
import { Category, Budget } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { compressImage } from '@/utils/formatting';

interface RequestFormProps {
  budget: Budget;
  categories: Category[];
  onSubmit: (data: ReimbursementRequestData & { photoUrl?: string }) => Promise<void>;
  isLoading?: boolean;
}

export const RequestForm: React.FC<RequestFormProps> = ({
  budget,
  categories,
  onSubmit,
  isLoading = false,
}) => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ReimbursementRequestData>({
    resolver: zodResolver(ReimbursementRequestSchema),
  });

  const amount = watch('amount');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File must be an image');
      return;
    }

    setPhotoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      let photoUrl: string | undefined;

      if (photoFile) {
        // Compress image before uploading
        const compressedBlob = await compressImage(photoFile);
        const compressedFile = new File([compressedBlob], photoFile.name, {
          type: 'image/jpeg',
        });

        // In a real app, you'd upload to storage
        // For now, we'll create a data URL
        const reader = new FileReader();
        photoUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(compressedFile);
        });
      }

      await onSubmit({ ...data, photoUrl });
      reset();
      removePhoto();
      toast.success('Request submitted successfully!');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to submit request'
      );
    }
  });

  const remainingBudget = budget.amount - budget.spent;

  return (
    <form onSubmit={handleFormSubmit} className="card space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
        Request Reimbursement
      </h2>

      {/* Budget Status */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          Remaining Budget: <span className="font-bold">${remainingBudget.toFixed(2)}</span>
        </p>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
          Amount ($)
        </label>
        <input
          {...register('amount', { valueAsNumber: true })}
          type="number"
          placeholder="0.00"
          step="0.01"
          max={remainingBudget}
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
        )}
        {amount && amount > remainingBudget && (
          <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-1">
            Amount exceeds remaining budget
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
          Category
        </label>
        <select
          {...register('categoryId')}
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          placeholder="What was this expense for?"
          rows={4}
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
          Receipt Photo (Optional)
        </label>

        {photoPreview ? (
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={photoPreview}
              alt="Receipt preview"
              className="w-full h-64 object-cover"
            />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
            <Upload className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Click to upload photo
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              PNG, JPG or GIF (max 10MB)
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isLoading && <LoadingSpinner size="sm" />}
        {isLoading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
};

export default RequestForm;
