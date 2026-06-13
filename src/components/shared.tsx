export function ArchiveList({
  title,
  items,
}: {
  title: string;
  items: Array<{ title: string; summary: string; year?: string; period?: string }>;
}) {
  return (
    <div className="archive reveal">
      <div className="archive-heading">
        <span className="section-mini">{title}</span>
        <p>后续内容增加后，这里可以升级为独立详情页或筛选归档。</p>
      </div>
      <div className="archive-grid">
        {items.map((item) => (
          <article className="archive-card" key={item.title}>
            <span>{item.year ?? item.period}</span>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="section-label reveal" aria-hidden="true">
      <span>{index}</span>
      <span>{label}</span>
    </div>
  );
}
