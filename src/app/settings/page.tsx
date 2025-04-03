import SettingsForm from "./components/settings-form";

export default function SettingsPage() {
  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <div className="grid gap-10 pt-6">
        <SettingsForm />
      </div>
    </div>
  );
}
