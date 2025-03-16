import { PageHeader } from "@/components/ui-components/PageHeader";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    institutionName: "University of Education",
    emailNotifications: true,
    reportLogoEnabled: true,
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
      variant: "default",
    });
  };

  return (
    <Layout>
      <div className="page-container">
        <PageHeader
          title="Settings"
          subtitle="Configure application settings and preferences"
        />

        <div className="mt-8 max-w-2xl mx-auto">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="p-6 border rounded-lg bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-4">General Settings</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="institution-name">Institution Name</Label>
                  <Input
                    id="institution-name"
                    value={settings.institutionName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        institutionName: e.target.value,
                      })
                    }
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    This will appear on all generated reports
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications when new reports are generated
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="report-logo">Include Logo on Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your institution logo on generated reports
                    </p>
                  </div>
                  <Switch
                    id="report-logo"
                    checked={settings.reportLogoEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, reportLogoEnabled: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save Settings</Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
