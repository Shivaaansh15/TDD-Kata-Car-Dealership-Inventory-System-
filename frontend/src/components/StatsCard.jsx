import React from 'react';
import { Car, DollarSign, PackageCheck, AlertTriangle } from 'lucide-react';

const StatsCard = ({ vehicles = [] }) => {
  const totalVehicles = vehicles.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);
  const totalModels = vehicles.length;
  
  const totalValue = vehicles.reduce(
    (sum, v) => sum + (Number(v.price) || 0) * (Number(v.quantity) || 0),
    0
  );

  const availableModels = vehicles.filter((v) => Number(v.quantity) > 0).length;
  const outOfStockModels = vehicles.filter((v) => Number(v.quantity) === 0).length;

  const stats = [
    {
      title: 'Total Vehicle Stock',
      value: totalVehicles.toLocaleString(),
      subtitle: `${totalModels} unique model${totalModels === 1 ? '' : 's'}`,
      icon: Car,
      color: 'from-indigo-500 to-cyan-500',
      shadow: 'shadow-indigo-500/10',
    },
    {
      title: 'Total Inventory Value',
      value: `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      subtitle: 'Combined asset value',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-400',
      shadow: 'shadow-emerald-500/10',
    },
    {
      title: 'Available Models',
      value: availableModels,
      subtitle: `${totalModels > 0 ? Math.round((availableModels / totalModels) * 100) : 0}% of fleet ready`,
      icon: PackageCheck,
      color: 'from-blue-500 to-indigo-400',
      shadow: 'shadow-blue-500/10',
    },
    {
      title: 'Out of Stock',
      value: outOfStockModels,
      subtitle: outOfStockModels > 0 ? 'Requires immediate restock' : 'All models in stock',
      icon: AlertTriangle,
      color: outOfStockModels > 0 ? 'from-amber-500 to-rose-500' : 'from-slate-600 to-slate-500',
      shadow: 'shadow-amber-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-300 hover:border-slate-700/80 hover:translate-y-[-2px]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.title}
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {stat.subtitle}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} p-0.5 shadow-lg ${stat.shadow}`}
              >
                <div className="w-full h-full bg-slate-950/80 backdrop-blur-md rounded-[14px] flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCard;
