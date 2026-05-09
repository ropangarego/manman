interface StatCardProps {
  value: string | number;
  label: string;
  className?: string;
}

export function StatCard({ value, label, className = '' }: StatCardProps) {
  return (
    <div className={`stat-card ${className}`.trim()}>
      <b>{value}</b>
      <small>{label}</small>
    </div>
  );
}

