const Paragraph: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <p className={"leading-7 [&:not(:first-child)]:mt-6 " + className}>
    {children}
  </p>
);

export { Paragraph };
