"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { mockUser, UserProfile } from "@/lib/mock/user";

export function ProfileSettings() {
  const [profile, setProfile] = useState<UserProfile>(mockUser);
  const [editing, setEditing] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  }

  function handleSave() {
    setEditing(false);
    // Would persist to backend here
  }

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div className="font-semibold text-lg">Profile</div>
        <div className="grid gap-4">
          <div>
            <div className="text-xs text-muted-foreground">Name</div>
            <Input
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!editing}
              className="mt-1"
            />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Email</div>
            <Input
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!editing}
              className="mt-1"
            />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Organization</div>
            <Input
              name="org"
              value={profile.org}
              onChange={handleChange}
              disabled={!editing}
              className="mt-1"
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          {editing ? (
            <>
              <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
