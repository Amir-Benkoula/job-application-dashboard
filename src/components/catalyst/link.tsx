import * as Headless from "@headlessui/react";
import React from "react";
import { Link as RouterLink } from "react-router";

type RouterLinkProps = React.ComponentPropsWithoutRef<typeof RouterLink>;

export const Link = React.forwardRef<
  HTMLAnchorElement,
  { href: string } & Omit<RouterLinkProps, "to">
>(function Link(props, ref) {
  const { href, ...rest } = props;

  return (
    <Headless.DataInteractive>
      <RouterLink {...rest} to={href} ref={ref} />
    </Headless.DataInteractive>
  );
});
