"use client";

import React, { createContext, useContext } from "react";
import { UserSessionState } from "@/lib/permissions";

export interface AuthContextType {
  currentUser: UserSessionState;
  switchRole: (roleName: string) => void;
  toggleCustomPermission: (permId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within DashboardLayout");
  return context;
};
