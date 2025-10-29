import { JSX } from "react";

export interface NavbarLinkProps {
  href: string;
  label: string;
  icon?: () => JSX.Element;
}
