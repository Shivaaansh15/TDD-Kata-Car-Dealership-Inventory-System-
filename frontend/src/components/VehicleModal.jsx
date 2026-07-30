import React, { useState, useEffect } from 'react';
import { X, Car, Plus, Save, AlertCircle, Loader2 } from 'lucide-react';

const VehicleModal = ({ isOpen, onClose, onSubmit, initialData = null, loading = false, error = '' }) => {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    quantity: 1,
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        brand: initialData.brand || '',
        model: initialData.model || '',
        year: initialData.year || new Date().getFullYear(),
        price: initialData.price || '',
        quantity: initialData.quantity !== undefined ? initialData.quantity : 1,
      });
    } else {
      setFormData({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        quantity: 1,
      });
    }
    setValidationError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.brand.trim()) {
      setValidationError('Brand is required.');
      return;
    }
    if (!formData.model.trim()) {
      setValidationError('Model is required.');
      return;
    }
    if (!formData.year || Number(formData.year) < 1900 || Number(formData.year) > 2030) {
      setValidationError('Please enter a valid year between 1900 and 2030.');
      return;
    }
    if (formData.price === '' || Number(formData.price) < 0) {
      setValidationError('Please enter a valid non-negative price.');
      return;
    }
    if (formData.quantity === '' || Number(formData.quantity) < 0) {
      setValidationError('Please enter a valid non-negative quantity.');
      return;
    }

    const payload = {
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      year: Number(formData.year),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow accent header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEdit
                  ? 'Update inventory car attributes'
                  : 'Enter car specs to add to dealership database'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert Banners */}
        {(validationError || error) && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <p className="font-medium">{validationError || error}</p>
          </div>
        )}

        {/* Vehicle Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Brand & Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Toyota, BMW, Ford"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Model *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. Camry, M3, Mustang"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                required
              />
            </div>
          </div>

          {/* Year & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Year *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1900"
                max="2030"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="1"
                placeholder="e.g. 35000"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
                required
              />
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Stock Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 5"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
              required
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 font-medium text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : isEdit ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Vehicle</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Vehicle</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;
