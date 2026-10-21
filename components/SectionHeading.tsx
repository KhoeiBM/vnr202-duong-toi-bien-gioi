export default function SectionHeading({
  kicker,
  title,
  desc,
  id,
}: {
  kicker: string;
  title: string;
  desc?: string;
  id?: string;
}) {
  return (
    <div className="section-head" id={id}>
      <div className="section-kicker">{kicker}</div>
      <h2 className="section-title">{title}</h2>
      {desc ? <p className="section-desc">{desc}</p> : null}
    </div>
  );
}
