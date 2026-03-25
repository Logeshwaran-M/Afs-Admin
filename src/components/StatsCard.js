import React from 'react';

const StatsCard = ({ icon, title, value, color = 'blue' }) => {
  return (
    <div className="stats-card">
      <div className={`stats-icon ${color}`}>{icon}</div>
      <div className="stats-info">
        <h3>{title}</h3>
        <p className="number">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;