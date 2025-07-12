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
import {
  Database,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link } from "react-router-dom";

type SourceType = "database" | "file";

interface DatabaseConfig {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  dbType: string;
}

export function SourceConfig() {
  const [sourceType, setSourceType] = useState<SourceType>("database");
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
    if (sourceType === "database") {
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
          Source Configuration
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Configure your source database or upload source data file
        </p>
      </div>

      {/* Source Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Source Type</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={sourceType}
            onValueChange={(value) => setSourceType(value as SourceType)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="database" id="database" />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-primary" />
                  <Label htmlFor="database" className="text-base font-medium">
                    Database Connection
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect to PostgreSQL, MySQL, SQL Server, or Oracle
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="file" id="file" />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <Label htmlFor="file" className="text-base font-medium">
                    File Upload
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload CSV, Excel, or other data files
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Database Configuration */}
      {sourceType === "database" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dbType">Database Type</Label>
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
                <Label htmlFor="host">Host</Label>
                <Input
                  id="host"
                  placeholder="localhost or IP address"
                  value={dbConfig.host}
                  onChange={(e) => handleDbConfigChange("host", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  placeholder="5432"
                  value={dbConfig.port}
                  onChange={(e) => handleDbConfigChange("port", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="database">Database Name</Label>
                <Input
                  id="database"
                  placeholder="database_name"
                  value={dbConfig.database}
                  onChange={(e) =>
                    handleDbConfigChange("database", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="username"
                  value={dbConfig.username}
                  onChange={(e) =>
                    handleDbConfigChange("username", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
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
                        Connection successful
                      </span>
                    </>
                  )}
                  {connectionStatus === "error" && (
                    <>
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <span className="text-destructive font-medium">
                        Connection failed
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

            {/* Sample Connection Strings */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Example Configurations:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>
                  <strong>PostgreSQL:</strong> Host: 10.0.0.1, Port: 5432, DB:
                  production_db
                </div>
                <div>
                  <strong>MySQL:</strong> Host: db.company.com, Port: 3306, DB:
                  sales_data
                </div>
                <div>
                  <strong>SQL Server:</strong> Host: server01, Port: 1433, DB:
                  DataWarehouse
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Upload Configuration */}
      {sourceType === "file" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>File Upload</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!uploadedFile ? (
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById("source-file")?.click()}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Upload Source Data File
                </h3>
                <p className="text-muted-foreground mb-4">
                  Click to browse or drag and drop your source data file here
                </p>
                <p className="text-sm text-muted-foreground">
                  Supported formats: .csv, .xlsx, .xls, .json
                </p>
                <input
                  id="source-file"
                  type="file"
                  accept=".csv,.xlsx,.xls,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(1)} KB •{" "}
                      {uploadedFile.type || "Unknown format"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadedFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Configuration Summary */}
      {isConfigValid() && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Source Configuration Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sourceType === "database" ? (
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className="bg-success">Connected</Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File Name:</span>
                  <span className="font-medium">{uploadedFile?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File Size:</span>
                  <span className="font-medium">
                    {uploadedFile && (uploadedFile.size / 1024).toFixed(1)} KB
                  </span>
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
        <Link to="/upload-mapping">
          <Button variant="outline">Back to Mapping</Button>
        </Link>
        <Link to="/target-config">
          <Button disabled={!isConfigValid()}>
            Continue to Target Configuration
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
