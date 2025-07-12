import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Database,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Target,
  Server,
} from "lucide-react";
import { Link } from "react-router-dom";

type TargetType = "database" | "file";

interface DatabaseConfig {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  dbType: string;
  schema?: string;
}

export function TargetConfig() {
  const [targetType, setTargetType] = useState<TargetType>("database");
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [dbConfig, setDbConfig] = useState<DatabaseConfig>({
    host: "",
    port: "5432",
    database: "",
    username: "",
    password: "",
    dbType: "postgresql",
    schema: "",
  });

  const handleDbConfigChange = (field: keyof DatabaseConfig, value: string) => {
    setDbConfig((prev) => ({ ...prev, [field]: value }));
  };

  const testConnection = async () => {
    setIsConnecting(true);
    setConnectionStatus("idle");

    // Simulate connection test
    setTimeout(() => {
      const isValid =
        dbConfig.host &&
        dbConfig.database &&
        dbConfig.username &&
        dbConfig.password;
      setConnectionStatus(isValid ? "success" : "error");
      setIsConnecting(false);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const isConfigValid = () => {
    if (targetType === "database") {
      return (
        connectionStatus === "success" &&
        dbConfig.host &&
        dbConfig.database &&
        dbConfig.username &&
        dbConfig.password
      );
    }
    return uploadedFile !== null;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Target Configuration
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Configure your target database or specify target data location
        </p>
      </div>

      {/* Progress Indicator */}
      <Card className="bg-accent/50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-success flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-success-foreground" />
              </div>
              <span className="text-sm font-medium">Source Configured</span>
            </div>
            <div className="h-px bg-border flex-1"></div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Target className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium">Target Configuration</span>
            </div>
            <div className="h-px bg-muted flex-1"></div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground">
                  3
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                Select Tables
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Target Type</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={targetType}
            onValueChange={(value) => setTargetType(value as TargetType)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="database" id="target-database" />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-primary" />
                  <Label
                    htmlFor="target-database"
                    className="text-base font-medium"
                  >
                    Database Connection
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect to target PostgreSQL, MySQL, SQL Server, or Oracle
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="file" id="target-file" />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <Label
                    htmlFor="target-file"
                    className="text-base font-medium"
                  >
                    File Export
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Export validation results to CSV, Excel, or JSON
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Database Configuration */}
      {targetType === "database" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5" />
              <span>Target Database Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target-dbType">Database Type</Label>
                <Select
                  value={dbConfig.dbType}
                  onValueChange={(value) =>
                    handleDbConfigChange("dbType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select database type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="sqlserver">SQL Server</SelectItem>
                    <SelectItem value="oracle">Oracle</SelectItem>
                    <SelectItem value="sqlite">SQLite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-host">Host</Label>
                <Input
                  id="target-host"
                  placeholder="target-db.company.com"
                  value={dbConfig.host}
                  onChange={(e) => handleDbConfigChange("host", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target-port">Port</Label>
                <Input
                  id="target-port"
                  placeholder="5432"
                  value={dbConfig.port}
                  onChange={(e) => handleDbConfigChange("port", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-database">Database Name</Label>
                <Input
                  id="target-database"
                  placeholder="target_database"
                  value={dbConfig.database}
                  onChange={(e) =>
                    handleDbConfigChange("database", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-schema">Schema (Optional)</Label>
                <Input
                  id="target-schema"
                  placeholder="public"
                  value={dbConfig.schema}
                  onChange={(e) =>
                    handleDbConfigChange("schema", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target-username">Username</Label>
                <Input
                  id="target-username"
                  placeholder="username"
                  value={dbConfig.username}
                  onChange={(e) =>
                    handleDbConfigChange("username", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-password">Password</Label>
                <div className="relative">
                  <Input
                    id="target-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    value={dbConfig.password}
                    onChange={(e) =>
                      handleDbConfigChange("password", e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Connection Test */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {connectionStatus === "success" && (
                    <>
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span className="text-success font-medium">
                        Target connection successful
                      </span>
                    </>
                  )}
                  {connectionStatus === "error" && (
                    <>
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <span className="text-destructive font-medium">
                        Target connection failed
                      </span>
                    </>
                  )}
                </div>
                <Button
                  onClick={testConnection}
                  disabled={isConnecting}
                  variant="outline"
                >
                  {isConnecting ? "Testing..." : "Test Connection"}
                </Button>
              </div>
            </div>

            {/* Connection Notes */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Target Environment Notes:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>
                  <strong>Production:</strong> Ensure read-only access and
                  off-peak testing
                </div>
                <div>
                  <strong>Staging:</strong> Recommended for initial validation
                  testing
                </div>
                <div>
                  <strong>Permissions:</strong> SELECT, INSERT permissions
                  required for validation
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Export Configuration */}
      {targetType === "file" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Export Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="export-format">Export Format</Label>
                <Select defaultValue="csv">
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV Files</SelectItem>
                    <SelectItem value="excel">Excel Workbook</SelectItem>
                    <SelectItem value="json">JSON Format</SelectItem>
                    <SelectItem value="parquet">Parquet Files</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="export-location">Export Location</Label>
                <Input
                  id="export-location"
                  placeholder="/exports/migration-data/"
                  defaultValue="/exports/migration-data/"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-naming">File Naming Convention</Label>
              <Input
                id="file-naming"
                placeholder="table_name_YYYYMMDD_HHMMSS"
                defaultValue="table_name_YYYYMMDD_HHMMSS"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="export-notes">Export Notes (Optional)</Label>
              <Textarea
                id="export-notes"
                placeholder="Add any specific export requirements or notes..."
                className="min-h-[80px]"
              />
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Export Settings:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Files will be generated during validation process</div>
                <div>• Large tables will be split into multiple files</div>
                <div>• Compression will be applied automatically</div>
                <div>• Export manifest file will be included</div>
              </div>
            </div>

            {/* Auto-mark as valid for file export */}
            <div className="flex items-center space-x-2 pt-4">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="text-success font-medium">
                Export configuration ready
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration Summary */}
      {isConfigValid() && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Target Configuration Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {targetType === "database" ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Database Type:</span>
                  <span className="font-medium capitalize">
                    {dbConfig.dbType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Host:</span>
                  <span className="font-medium">{dbConfig.host}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Database:</span>
                  <span className="font-medium">{dbConfig.database}</span>
                </div>
                {dbConfig.schema && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Schema:</span>
                    <span className="font-medium">{dbConfig.schema}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className="bg-success">Connected</Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Export Type:</span>
                  <span className="font-medium">File Export</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format:</span>
                  <span className="font-medium">CSV Files</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">/exports/migration-data/</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className="bg-success">Ready</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Next Step */}
      <div className="flex justify-between items-center">
        <Link to="/source-config">
          <Button variant="outline">Back to Source Config</Button>
        </Link>
        <Link to="/select-tables">
          <Button disabled={!isConfigValid()}>
            Continue to Table Selection
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
