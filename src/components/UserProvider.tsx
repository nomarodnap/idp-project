"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface UserData {
  id: string;
  name: string;
  position: string | null;
  department: string | null;
  division: string | null;
  level: string | null;
  employeeType: string | null;
  avatarUrl: string | null;
}

interface UserContextType {
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  user: UserData | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children, initialUser }: { children: ReactNode, initialUser?: UserData | null }) {
  // Use a default avatar initially
  const [avatarUrl, setAvatarUrl] = useState<string>(
    initialUser?.avatarUrl || "https://api.dicebear.com/7.x/notionists/svg?seed=Somchai&backgroundColor=f3e8ff"
  );

  return (
    <UserContext.Provider value={{ avatarUrl, setAvatarUrl, user: initialUser || null }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
