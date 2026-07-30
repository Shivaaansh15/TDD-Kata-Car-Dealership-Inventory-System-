import React, { useState } from 'react';
import {
  Edit2,
  Trash2,
  ShoppingBag,
  PlusCircle,
  ArrowUpDown,
  Car,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const VehicleTable = ({
  vehicles = [],
  loading = false,
  onEdit,
  onDelete,
  onPurchase,
  onRestock,
  actionLoadingId = null,
}) => {
  const [sortField, setSortField] = useState('brand');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedVehicles = [...vehicles].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal || '').toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="space-y-4">
          <div className="h-8 bg-slate-800/60 rounded-xl w-1/4 animate-pulse"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 rounded-xl skeleton-shimmer border border-slate-800/40"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <Car className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Vehicles Found</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
          There are currently no cars matching your criteria in the inventory database.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-300 text-xs uppercase font-bold tracking-wider">
              <th
                onClick={() => handleSort('brand')}
                className="py-4 px-5 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Brand</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleSort('model')}
                className="py-4 px-5 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Model</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleSort('year')}
                className="py-4 px-5 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Year</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleSort('price')}
                className="py-4 px-5 cursor-pointer hover:text-white transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Price</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleSort('quantity')}
                className="py-4 px-5 cursor-pointer hover:text-white transition-colors text-center"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Quantity</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>
              <th className="py-4 px-5 text-center">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm font-medium">
            {sortedVehicles.map((car) => {
              const carId = car._id || car.id;
              const qty = Number(car.quantity) || 0;
              const price = Number(car.price) || 0;
              const isProcessing = actionLoadingId === carId;

              // Status badge derived from quantity
              let statusBadge = (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  In Stock
                </span>
              );

              if (qty === 0) {
                statusBadge = (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <XCircle className="w-3.5 h-3.5" />
                    Out of Stock
                  </span>
                );
              } else if (qty <= 2) {
                statusBadge = (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Low Stock ({qty})
                  </span>
                );
              }

              return (
                <tr
                  key={carId}
                  className="hover:bg-slate-800/40 transition-colors duration-150 group"
                >
                  {/* Brand */}
                  <td className="py-4 px-5 font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {car.brand}
                  </td>

                  {/* Model */}
                  <td className="py-4 px-5 text-slate-200 font-semibold">
                    {car.model}
                  </td>

                  {/* Year */}
                  <td className="py-4 px-5 text-slate-400 font-mono">
                    {car.year}
                  </td>

                  {/* Price */}
                  <td className="py-4 px-5 text-right font-bold text-emerald-400 font-mono text-base">
                    ${price.toLocaleString()}
                  </td>

                  {/* Quantity */}
                  <td className="py-4 px-5 text-center">
                    <span
                      className={`inline-block font-mono font-bold px-2.5 py-0.5 rounded-lg border ${
                        qty === 0
                          ? 'bg-rose-950/40 text-rose-300 border-rose-800/40'
                          : qty <= 2
                          ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                          : 'bg-slate-900 text-slate-200 border-slate-800'
                      }`}
                    >
                      {qty}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-5 text-center">{statusBadge}</td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Purchase Button */}
                      <button
                        onClick={() => onPurchase(car)}
                        disabled={qty === 0 || isProcessing}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 shadow-sm cursor-pointer ${
                          qty === 0
                            ? 'bg-slate-800/40 text-slate-600 border border-slate-800 cursor-not-allowed'
                            : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 active:scale-95'
                        }`}
                        title={
                          qty === 0
                            ? 'Out of stock'
                            : 'Purchase vehicle (decreases stock)'
                        }
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span className="hidden lg:inline">Purchase</span>
                      </button>

                      {/* Restock Button */}
                      <button
                        onClick={() => onRestock(car)}
                        disabled={isProcessing}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all duration-150 active:scale-95 shadow-sm cursor-pointer"
                        title="Restock vehicle (increases stock)"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span className="hidden lg:inline">Restock</span>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(car)}
                        disabled={isProcessing}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all cursor-pointer"
                        title="Edit vehicle details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDelete(car)}
                        disabled={isProcessing}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                        title="Delete vehicle"
                      >
                        <Trash2 className="w-4 h-4" />
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
  );
};

export default VehicleTable;
