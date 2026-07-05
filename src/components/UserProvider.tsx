"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // Use a default avatar initially (e.g. from DiceBear or a standard placeholder)
  const [avatarUrl, setAvatarUrl] = useState<string>("https://api.dicebear.com/7.x/notionists/svg?seed=Somchai&backgroundColor=f3e8ff");

  return (
    <UserContext.Provider value={{ avatarUrl, setAvatarUrl }}>
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
