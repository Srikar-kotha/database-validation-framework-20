import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Settings as SettingsIcon,
  Database,
  Bell,
  Shield,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Mail,
  Webhook,
  Clock,
  HardDrive,
  Palette,
  Monitor,
  Moon,
  Sun,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface DatabaseConnection {
  id: string;
  name: string;
  type: string;
  host: string;
  port: number;
  database: string;
  username: string;
  isDefault: boolean;
  lastUsed: Date;
  status: "connected" | "disconnected" | "error";
}

interface NotificationSetting {
  id: string;
  type: "email" | "webhook" | "slack";
  name: string;
  endpoint: string;
  enabled: boolean;
  events: string[];
}

export function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [showPasswords, setShowPasswords] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    appName: "DataSync Migration Validator",
    defaultBatchSize: 10000,
    maxConcurrency: 4,
    timeoutMinutes: 30,
    enableDetailedLogging: true,
    autoSaveResults: true,
    retentionDays: 30,
    theme: "system", // light, dark, system
  });

  // Database Connections
  const [dbConnections, setDbConnections] = useState<DatabaseConnection[]>([
    {
      id: "1",
      name: "Production DB",
      type: "postgresql",
      host: "prod-db.company.com",
      port: 5432,
      database: "production",
      username: "readonly_user",
      isDefault: true,
      lastUsed: new Date("2024-01-15"),
      status: "connected",
    },
    {
      id: "2",
      name: "Staging DB",
      type: "mysql",
      host: "staging-db.company.com",
      port: 3306,
      database: "staging",
      username: "test_user",
      isDefault: false,
      lastUsed: new Date("2024-01-10"),
      status: "disconnected",
    },
  ]);

  // Notification Settings
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "1",
      type: "email",
      name: "Admin Email",
      endpoint: "admin@company.com",
      enabled: true,
      events: ["validation_complete", "validation_failed"],
    },
    {
      id: "2",
      type: "webhook",
      name: "Slack Integration",
      endpoint: "https://hooks.slack.com/...",
      enabled: false,
      events: ["validation_complete"],
    },
  ]);

  // Validation Defaults
  const [validationDefaults, setValidationDefaults] = useState({
    enableRowCount: true,
    enableDataType: true,
    enableNullCheck: true,
    enablePrimaryKey: true,
    enableForeignKey: false,
    enableDuplicateCheck: false,
    stopOnFirstError: false,
    includeStatistics: true,
    customValidationQueries: "",
  });

  const handleSaveSettings = () => {
    // Simulate saving settings
    setHasUnsavedChanges(false);
    // In a real app, this would make API calls to save settings
    console.log("Settings saved!");
  };

  const handleResetSettings = () => {
    // Reset to defaults
    setHasUnsavedChanges(false);
  };

  const handleExportConfig = () => {
    const config = {
      general: generalSettings,
      databases: dbConnections,
      notifications: notifications,
      validationDefaults: validationDefaults,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "datasync-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteConnection = (id: string) => {
    setDbConnections(dbConnections.filter((conn) => conn.id !== id));
    setHasUnsavedChanges(true);
  };

  const toggleNotification = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif,
      ),
    );
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Configure application preferences and system settings
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-warning">
              Unsaved Changes
            </Badge>
          )}
          <Button variant="outline" onClick={handleResetSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="databases">Databases</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="h-5 w-5" />
                <span>Application Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="app-name">Application Name</Label>
                  <Input
                    id="app-name"
                    value={generalSettings.appName}
                    onChange={(e) => {
                      setGeneralSettings({
                        ...generalSettings,
                        appName: e.target.value,
                      });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={generalSettings.theme}
                    onValueChange={(value) => {
                      setGeneralSettings({ ...generalSettings, theme: value });
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center space-x-2">
                          <Sun className="h-4 w-4" />
                          <span>Light</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center space-x-2">
                          <Moon className="h-4 w-4" />
                          <span>Dark</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center space-x-2">
                          <Monitor className="h-4 w-4" />
                          <span>System</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Performance Defaults</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>
                      Default Batch Size:{" "}
                      {generalSettings.defaultBatchSize.toLocaleString()}
                    </Label>
                    <Slider
                      value={[generalSettings.defaultBatchSize]}
                      onValueChange={(value) => {
                        setGeneralSettings({
                          ...generalSettings,
                          defaultBatchSize: value[0],
                        });
                        setHasUnsavedChanges(true);
                      }}
                      min={1000}
                      max={100000}
                      step={1000}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Max Concurrency: {generalSettings.maxConcurrency} threads
                    </Label>
                    <Slider
                      value={[generalSettings.maxConcurrency]}
                      onValueChange={(value) => {
                        setGeneralSettings({
                          ...generalSettings,
                          maxConcurrency: value[0],
                        });
                        setHasUnsavedChanges(true);
                      }}
                      min={1}
                      max={16}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeout">Default Timeout (minutes)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      value={generalSettings.timeoutMinutes}
                      onChange={(e) => {
                        setGeneralSettings({
                          ...generalSettings,
                          timeoutMinutes: parseInt(e.target.value) || 30,
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">System Preferences</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="detailed-logging">
                        Enable Detailed Logging
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Log all validation steps and database operations
                      </p>
                    </div>
                    <Switch
                      id="detailed-logging"
                      checked={generalSettings.enableDetailedLogging}
                      onCheckedChange={(checked) => {
                        setGeneralSettings({
                          ...generalSettings,
                          enableDetailedLogging: checked,
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-save">Auto-save Results</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically save validation results to database
                      </p>
                    </div>
                    <Switch
                      id="auto-save"
                      checked={generalSettings.autoSaveResults}
                      onCheckedChange={(checked) => {
                        setGeneralSettings({
                          ...generalSettings,
                          autoSaveResults: checked,
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retention">Data Retention (days)</Label>
                    <Input
                      id="retention"
                      type="number"
                      value={generalSettings.retentionDays}
                      onChange={(e) => {
                        setGeneralSettings({
                          ...generalSettings,
                          retentionDays: parseInt(e.target.value) || 30,
                        });
                        setHasUnsavedChanges(true);
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      How long to keep validation results and logs
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Connections */}
        <TabsContent value="databases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Saved Database Connections</span>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Connection
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Manage your saved database connections for quick access
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPasswords(!showPasswords)}
                  >
                    {showPasswords ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Hide Passwords
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Show Passwords
                      </>
                    )}
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Database</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dbConnections.map((connection) => (
                      <TableRow key={connection.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <span>{connection.name}</span>
                            {connection.isDefault && (
                              <Badge variant="outline">Default</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">
                          {connection.type}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {connection.host}:{connection.port}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {connection.database}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {connection.status === "connected" && (
                              <CheckCircle className="h-4 w-4 text-success" />
                            )}
                            {connection.status === "disconnected" && (
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            )}
                            {connection.status === "error" && (
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            )}
                            <span className="capitalize text-sm">
                              {connection.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {connection.lastUsed.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Connection
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the
                                    connection "{connection.name}"? This action
                                    cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      deleteConnection(connection.id)
                                    }
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Validation Defaults */}
        <TabsContent value="validation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Default Validation Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Data Integrity Checks</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="row-count-default">
                        Row Count Validation
                      </Label>
                      <Switch
                        id="row-count-default"
                        checked={validationDefaults.enableRowCount}
                        onCheckedChange={(checked) => {
                          setValidationDefaults({
                            ...validationDefaults,
                            enableRowCount: checked,
                          });
                          setHasUnsavedChanges(true);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="data-type-default">
                        Data Type Matching
                      </Label>
                      <Switch
                        id="data-type-default"
                        checked={validationDefaults.enableDataType}
                        onCheckedChange={(checked) => {
                          setValidationDefaults({
                            ...validationDefaults,
                            enableDataType: checked,
                          });
                          setHasUnsavedChanges(true);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="null-check-default">
                        NULL Value Validation
                      </Label>
                      <Switch
                        id="null-check-default"
                        checked={validationDefaults.enableNullCheck}
                        onCheckedChange={(checked) => {
                          setValidationDefaults({
                            ...validationDefaults,
                            enableNullCheck: checked,
                          });
                          setHasUnsavedChanges(true);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="pk-check-default">
                        Primary Key Validation
                      </Label>
                      <Switch
                        id="pk-check-default"
                        checked={validationDefaults.enablePrimaryKey}
                        onCheckedChange={(checked) => {
                          setValidationDefaults({
                            ...validationDefaults,
                            enablePrimaryKey: checked,
                          });
                          setHasUnsavedChanges(true);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Advanced Checks</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="fk-check-default">
                        Foreign Key Validation
                      </Label>
                      <Switch
                        id="fk-check-default"
                        checked={validationDefaults.enableForeignKey}
                        onCheckedChange={(checked) => {
                          setValidationDefaults({
                            ...validationDefaults,
                            enableForeignKey: checked,
                          });
                          setHasUnsavedChanges(true);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="duplicate-check-default">
                        Duplicate Detection
                      </Label>
                      <Switch
                        id="duplicate-check-default"
                        checked={validationDefaults.enableDuplicateCheck}
                        onCheckedChange={(checked) => {
                          setValidationDefaults({
                            ...validationDefaults,
                            enableDuplicateCheck: checked,
                          });
                          setHasUnsavedChanges(true);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="stop-on-error-default">
                        Stop on First Error
                      </Label>
                      <Switch
                        id="stop-on-error-default"
                        checked={validationDefaults.stopOnFirstError}
                        onCheckedChange={(checked) => {
                          setValidationDefaults({
                            ...validationDefaults,
                            stopOnFirstError: checked,
                          });
                          setHasUnsavedChanges(true);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="include-stats-default">
                        Include Statistics
                      </Label>
                      <Switch
                        id="include-stats-default"
                        checked={validationDefaults.includeStatistics}
                        onCheckedChange={(checked) => {
                          setValidationDefaults({
                            ...validationDefaults,
                            includeStatistics: checked,
                          });
                          setHasUnsavedChanges(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-queries">
                  Default Custom Validation Queries
                </Label>
                <Textarea
                  id="custom-queries"
                  placeholder="Enter default SQL validation queries, one per line..."
                  value={validationDefaults.customValidationQueries}
                  onChange={(e) => {
                    setValidationDefaults({
                      ...validationDefaults,
                      customValidationQueries: e.target.value,
                    });
                    setHasUnsavedChanges(true);
                  }}
                  className="min-h-[100px] font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Settings</span>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Notification
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                      {notification.type === "email" && (
                        <Mail className="h-5 w-5" />
                      )}
                      {notification.type === "webhook" && (
                        <Webhook className="h-5 w-5" />
                      )}
                      {notification.type === "slack" && (
                        <Bell className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{notification.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {notification.endpoint}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        {notification.events.map((event) => (
                          <Badge
                            key={event}
                            variant="outline"
                            className="text-xs"
                          >
                            {event.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={notification.enabled}
                      onCheckedChange={() =>
                        toggleNotification(notification.id)
                      }
                    />
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">API Access</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="api-key"
                        type={showPasswords ? "text" : "password"}
                        value="••••••••••••••••••••••••••••••••"
                        readOnly
                      />
                      <Button variant="outline">Regenerate</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-secret">Webhook Secret</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="webhook-secret"
                        type={showPasswords ? "text" : "password"}
                        value="••••••••••••••••••••••••••••••••"
                        readOnly
                      />
                      <Button variant="outline">Regenerate</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Session Management</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically log out inactive users
                      </p>
                    </div>
                    <Select defaultValue="60">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require 2FA</Label>
                      <p className="text-sm text-muted-foreground">
                        Require two-factor authentication for all users
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Import/Export */}
        <TabsContent value="import-export" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Export Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Export your current configuration including database
                  connections, validation defaults, and application settings.
                </p>
                <Button onClick={handleExportConfig} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Configuration
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Import Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Import a previously exported configuration file to restore
                  your settings.
                </p>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to browse or drag and drop configuration file
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Automatic Backups</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically backup configuration daily
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>Backup Retention</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
