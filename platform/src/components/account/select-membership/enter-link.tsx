"use client";

import type { MouseEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { setResource } from "@/lib/actions/account/set-resource.action";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  resourceId: string;
  resourceType: "ORGANIZATION" | "CLINIC";
};

export function EnterLink({
  href,
  className,
  children,
  resourceId,
  resourceType,
}: Props) {
  const router = useRouter();

  const stop = async (e: MouseEvent) => {
    e.stopPropagation();
    await setResource(resourceId, resourceType);

    router.push(href);
  };

  return (
    <div onClick={stop} className={className}>
      {children}
    </div>
  );
}
