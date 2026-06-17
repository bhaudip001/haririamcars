'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Edit, Trash2, Plus, X, Search, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();

  const fetchBrands = async () => {
    try {
      const res = await api.get('/brands');
      setBrands(res.data);
    } catch (error) {
      toast.error('Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openAddModal = () => {
    setEditingBrand(null);
    reset({ name: '', models: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (brand) => {
    setEditingBrand(brand);
    reset({
      name: brand.name,
      models: brand.models.join(', ')
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (editingBrand) {
        await api.put(`/brands/${editingBrand._id}`, data);
        toast.success('Brand updated successfully');
      } else {
        await api.post('/brands', data);
        toast.success('Brand added successfully');
      }
      closeModal();
      fetchBrands();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this brand?')) {
      try {
        await api.delete(`/brands/${id}`);
        toast.success('Brand deleted successfully');
        fetchBrands();
      } catch (error) {
        toast.error('Failed to delete brand');
      }
    }
  };

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text">Car Brands & Models</h1>
          <p className="font-body text-sm text-text-muted mt-1">
            Manage the list of available brands and their models for the inventory.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-body text-sm font-bold transition-all shadow-lg shadow-primary/25"
        >
          <Plus size={18} />
          Add Brand
        </button>
      </div>

      {/* Search & List */}
      <div className="bg-surface rounded-2xl border border-gray-100/10 overflow-hidden">
        <div className="p-4 border-b border-gray-100/10">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-transparent focus:border-primary/30 rounded-xl font-body text-sm text-text outline-none transition-all focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-gray-100/10 text-text-muted font-heading text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Brand Name</th>
                <th className="p-4 font-semibold">Models</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/10">
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-text-muted">Loading brands...</td>
                </tr>
              ) : filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-text-muted">No brands found.</td>
                </tr>
              ) : (
                filteredBrands.map((brand) => (
                  <tr key={brand._id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <span className="font-body text-sm font-bold text-text">{brand.name}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5">
                        {brand.models.map((model, idx) => (
                          <span key={idx} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-medium text-text-muted">
                            {model}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(brand)}
                          className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(brand._id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-gray-100/10 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100/10 flex justify-between items-center">
              <h2 className="font-heading font-bold text-xl text-text">
                {editingBrand ? 'Edit Brand' : 'Add Brand'}
              </h2>
              <button onClick={closeModal} className="text-text-muted hover:text-text transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="font-body text-sm font-semibold text-text">Brand Name</label>
                <input
                  {...register('name', { required: 'Brand name is required' })}
                  placeholder="e.g. Hyundai"
                  className="w-full px-4 py-3 bg-background border border-transparent focus:border-primary/30 rounded-xl font-body text-sm text-text outline-none transition-all focus:ring-2 focus:ring-primary/10"
                />
                {errors.name && <span className="text-red-500 text-xs font-body">{errors.name.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="font-body text-sm font-semibold text-text">Models (Comma-separated)</label>
                <textarea
                  {...register('models')}
                  placeholder="e.g. Creta, i20, Venue"
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-transparent focus:border-primary/30 rounded-xl font-body text-sm text-text outline-none transition-all focus:ring-2 focus:ring-primary/10 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100/10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl font-body text-sm font-bold text-text hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-body text-sm font-bold transition-all shadow-lg shadow-primary/25 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
