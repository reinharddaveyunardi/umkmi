"use client";
import { usePageTransition } from "@/contexts/TransitionContext";

export default function CustomLink({
  className,
  href,
  children,
  ...props
}: {
  className?: string;
  href: string;
  children: React.ReactNode;
}) {
  const { transitionToNewPage } = usePageTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    transitionToNewPage(href);
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
