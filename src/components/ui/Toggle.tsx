interface ToggleProps {
  checked: boolean;
  label: string;
  onChange: () => void;
}

export function Toggle({ checked, label, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      className={`switch${checked ? ' on' : ''}`}
      aria-label={label}
      aria-pressed={checked}
      onClick={onChange}
    />
  );
}

