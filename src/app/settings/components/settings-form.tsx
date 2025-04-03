"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSettings from "./general-settings";
import ProfileSettings from "./profile-settings";
import NotificationSettings from "./notification-settings";

export default function SettingsForm() {
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so we can safely check for mounted status here
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4 pt-4">
        <GeneralSettings />
      </TabsContent>
      <TabsContent value="profile" className="space-y-4 pt-4">
        <ProfileSettings />
      </TabsContent>
      <TabsContent value="notifications" className="space-y-4 pt-4">
        <NotificationSettings />
      </TabsContent>
    </Tabs>
  );
}
