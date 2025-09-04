import React from 'react';

const StatsCard = ({ icon: Icon, title, value, change, positive = true }) => {
  return (
    <div className="glass-card rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 rounded-lg bg-gradient-primary/20">
          <Icon className="h-5 w-5 text-dark-accent" />
        </div>
        <span className={`text-sm font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  );
};

export default StatsCard;