type MediaPlaceholderProps = {
  label: string;
};

export function MediaPlaceholder({ label }: MediaPlaceholderProps) {
  return (
    <div className="media-placeholder" role="img" aria-label={label}>
      <span className="media-placeholder-label">{label}</span>
    </div>
  );
}
