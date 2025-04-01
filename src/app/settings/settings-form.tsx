"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Bell, User, Sun, Moon, Monitor } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  email: z
    .string()
    .min(1, { message: "This field is required" })
    .email("This is not a valid email"),
  bio: z.string().max(160).optional(),
  urls: z
    .object({
      twitter: z
        .string()
        .url({ message: "Please enter a valid URL." })
        .optional(),
      github: z
        .string()
        .url({ message: "Please enter a valid URL." })
        .optional(),
      linkedin: z
        .string()
        .url({ message: "Please enter a valid URL." })
        .optional(),
    })
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
  name: "",
  email: "",
  bio: "",
  urls: {
    twitter: "",
    github: "",
    linkedin: "",
  },
};

export default function SettingsForm() {
  const { setTheme, theme, resolvedTheme, systemTheme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so we can safely check for mounted status here
  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log(data);
      setIsLoading(false);
    }, 1000);
  }

  // Get the actual resolved theme for visual display when system is selected
  const actualTheme =
    theme === "system"
      ? systemTheme || (resolvedTheme === "dark" ? "dark" : "light")
      : theme;

  // Get icon for the current theme
  const getThemeIcon = (themeValue: string) => {
    switch (themeValue) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "system":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  // Determine if system theme is dark, regardless of the currently selected theme
  const isSystemThemeDark = systemTheme === "dark";

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
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the app looks and feels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Theme</h3>
                  {getThemeIcon(theme || "light")}
                  <span className="text-sm text-muted-foreground capitalize">
                    {theme || "light"}
                    {theme === "system" && actualTheme && ` (${actualTheme})`}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Select your preferred theme.
                </p>
              </div>
              <RadioGroup
                value={theme || "light"}
                onValueChange={setTheme}
                className="grid grid-cols-3 gap-4 pt-2">
                <div className="[&:has([data-state=checked])>div]:border-primary">
                  <div>
                    <RadioGroupItem
                      value="light"
                      id="light"
                      className="sr-only"
                    />
                  </div>
                  <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                    <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                      <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                        <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                        <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                        <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                        <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                        <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                        <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full p-2">
                    <span className="text-center font-normal">Light</span>
                    {theme === "light" && <Sun className="h-4 w-4" />}
                  </div>
                </div>

                <div className="[&:has([data-state=checked])>div]:border-primary">
                  <div>
                    <RadioGroupItem
                      value="dark"
                      id="dark"
                      className="sr-only"
                    />
                  </div>
                  <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                    <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                      <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                        <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                        <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                        <div className="h-4 w-4 rounded-full bg-slate-400" />
                        <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                        <div className="h-4 w-4 rounded-full bg-slate-400" />
                        <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full p-2">
                    <span className="text-center font-normal">Dark</span>
                    {theme === "dark" && <Moon className="h-4 w-4" />}
                  </div>
                </div>

                <div className="[&:has([data-state=checked])>div]:border-primary">
                  <div>
                    <RadioGroupItem
                      value="system"
                      id="system"
                      className="sr-only"
                    />
                  </div>
                  <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                    <div
                      className={`space-y-2 rounded-sm ${
                        isSystemThemeDark ? "bg-slate-950" : "bg-[#ecedef]"
                      } p-2`}>
                      <div
                        className={`space-y-2 rounded-md ${
                          isSystemThemeDark ? "bg-slate-800" : "bg-white"
                        } p-2 shadow-sm`}>
                        <div
                          className={`h-2 w-[80px] rounded-lg ${
                            isSystemThemeDark ? "bg-slate-400" : "bg-[#ecedef]"
                          }`}
                        />
                        <div
                          className={`h-2 w-[100px] rounded-lg ${
                            isSystemThemeDark ? "bg-slate-400" : "bg-[#ecedef]"
                          }`}
                        />
                      </div>
                      <div
                        className={`flex items-center space-x-2 rounded-md ${
                          isSystemThemeDark ? "bg-slate-800" : "bg-white"
                        } p-2 shadow-sm`}>
                        <div
                          className={`h-4 w-4 rounded-full ${
                            isSystemThemeDark ? "bg-slate-400" : "bg-[#ecedef]"
                          }`}
                        />
                        <div
                          className={`h-2 w-[100px] rounded-lg ${
                            isSystemThemeDark ? "bg-slate-400" : "bg-[#ecedef]"
                          }`}
                        />
                      </div>
                      <div
                        className={`flex items-center space-x-2 rounded-md ${
                          isSystemThemeDark ? "bg-slate-800" : "bg-white"
                        } p-2 shadow-sm`}>
                        <div
                          className={`h-4 w-4 rounded-full ${
                            isSystemThemeDark ? "bg-slate-400" : "bg-[#ecedef]"
                          }`}
                        />
                        <div
                          className={`h-2 w-[100px] rounded-lg ${
                            isSystemThemeDark ? "bg-slate-400" : "bg-[#ecedef]"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full p-2">
                    <span className="text-center font-normal">System</span>
                    {theme === "system" && <Monitor className="h-4 w-4" />}
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                  <h3 className="font-medium">Difficulty Preference</h3>
                  <p className="text-sm text-muted-foreground">
                    Set your default quiz difficulty.
                  </p>
                </div>
                <Select defaultValue="BEGINNER">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                  <h3 className="font-medium">Time Limit</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable time limits for quizzes by default.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all your data.
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="profile" className="space-y-4 pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your profile information.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" alt="Profile picture" />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="font-medium">Profile Picture</h3>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    Upload
                  </Button>
                  <Button size="sm" variant="outline">
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about yourself"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        You can <span>@mention</span> other users and
                        organizations.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="urls.twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://twitter.com/username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="urls.github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://github.com/username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="urls.linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://linkedin.com/in/username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stats</CardTitle>
            <CardDescription>View your quiz statistics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col space-y-1 rounded-lg border p-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Total XP
                </span>
                <span className="text-2xl font-bold">1,250</span>
              </div>
              <div className="flex flex-col space-y-1 rounded-lg border p-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Current Streak
                </span>
                <span className="text-2xl font-bold">7 days</span>
              </div>
              <div className="flex flex-col space-y-1 rounded-lg border p-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Best Streak
                </span>
                <span className="text-2xl font-bold">14 days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-4 pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure how you receive notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications about your activity.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                  <h3 className="font-medium">Quiz Reminders</h3>
                  <p className="text-sm text-muted-foreground">
                    Get reminders to maintain your streak.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                  <h3 className="font-medium">Achievement Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified when you earn new achievements.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                  <h3 className="font-medium">Marketing Emails</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new features and updates.
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="gap-1">
              <Bell className="h-4 w-4" />
              Test Notification
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
