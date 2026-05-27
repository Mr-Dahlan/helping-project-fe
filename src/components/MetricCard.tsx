import React from 'react';

interface MetricCardProps {
    label: string;
    value: string | number;
    colorClass: 'orange' | 'purple' | 'blue' | 'green';
    icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, colorClass, icon }) => {
    return (
        <div className={`metric-card ${colorClass}`}>
            <div className="metric-info">
                <span className="metric-label">{label}</span>
                <span className="metric-value">{value}</span>
            </div>
            <div className="metric-icon">
                {icon}
            </div>
        </div>
    );
};

export default MetricCard;