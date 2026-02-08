// Copyright (c) 2026 Jeyapragash. All rights reserved.

export type NotificationItem = {
  id: number;
  message: string;
  type?: "info" | "success" | "error";
  read: boolean;
  createdAt: string;
};

export type NotificationCreate = {
  message: string;
  type?: "info" | "success" | "error";
};
