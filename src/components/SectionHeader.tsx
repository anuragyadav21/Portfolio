type SectionHeaderProps = {
  number: string;
  title: string;
  dark?: boolean;
  kicker?: string;
  className?: string;
};

export function SectionHeader({ number, title, dark = false, kicker, className }: SectionHeaderProps) {
  return (
    <div className={["sec-header", className].filter(Boolean).join(" ")} data-n={number} data-reveal data-delay="1">
      <span className="sec-n" aria-hidden="true">
        {number}
      </span>
      <div className="sec-hgroup">
        {kicker ? <div className={dark ? "sec-kicker sec-kicker-dark" : "sec-kicker"}>{kicker}</div> : null}
        <h2 className={dark ? "sec-t sec-t-dark" : "sec-t"}>{title}</h2>
      </div>
    </div>
  );
}
