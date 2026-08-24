export default function SectionHeader({ kicker, title, children }) {
  return (
    <div className="section-header">
      <div>
        <p className="section-kicker">{kicker}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      <p className="section-copy">{children}</p>
    </div>
  );
}
