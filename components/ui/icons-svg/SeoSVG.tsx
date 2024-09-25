interface IProps extends React.SVGProps<SVGSVGElement> {
  children: React.ReactNode;
}

export default function SeoSVG({
  className,
  color = 'currentColor',
  viewBox = '0 0 24 24',
  strokeWidth = 1,
  children,
  ...props
}: IProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      fill="none"
      viewBox={viewBox}
      strokeWidth={strokeWidth}
      stroke={color}
      className={className || 'w-6 h-6'}
      {...props}
    >
      {children}
    </svg>
  );
}
