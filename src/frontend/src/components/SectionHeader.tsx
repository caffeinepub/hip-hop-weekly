interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-1">
        <h2 className="font-display font-black text-foreground uppercase tracking-tight text-2xl md:text-3xl whitespace-nowrap">
          {title}
        </h2>
        <div className="flex-1 h-px bg-gold-dark" />
      </div>
      {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
    </div>
  );
}
