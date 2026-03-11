interface CtrlBtnProps {
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  activeClassName?: string;
}

export default function CtrlBtn({ onClick, disabled, title, children, active, className = "", activeClassName = "" }: CtrlBtnProps) {
  return (
    <button onClick={onClick} disabled={disabled} title={title} className={`${className}${active ? " " + activeClassName : ""}`}>
      {children}
    </button>
  );
}
