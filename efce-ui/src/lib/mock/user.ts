// Copyright (c) 2026 Jeyapragash. All rights reserved.

export type UserProfile = {
  name: string;
  email: string;
  org: string;
  avatarUrl?: string;
};

export const mockUser: UserProfile = {
  name: "Kisho Jeyapragash",
  email: "alex.morgan@example.com",
  org: "Contoso Health",
  avatarUrl: undefined,
};

