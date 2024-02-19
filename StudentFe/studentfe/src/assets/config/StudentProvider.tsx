"use client";

import { Session } from "inspector";
import { SessionOptions } from "next-auth";
import { SessionProvider, SessionProviderProps } from "next-auth/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  session: any;
}
export default function ClientProviders({ children, session }: Props) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
