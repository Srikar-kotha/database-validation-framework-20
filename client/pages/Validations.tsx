import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  CheckCircle,
  ArrowRight,
  Database,
  AlertTriangle,
  Info,
  Settings,
  Zap,
  Shield,
  Target,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

interface ValidationOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: "data-integrity" | "performance" | "business-rules";
  enabled: boolean;
  severity: "critical" | "high" | "medium" | "low";
  estimatedTime: string;
}

interface ValidationConfig {
  batchSize: number;
  maxConcurrency: number;
  timeoutMinutes: number;
  enableLogging: boolean;
  stopOnFirstError: boolean;
  includeStatistics: boolean;
}

export function Validations() {
  const [validationOptions, setValidationOptions] = useState<
    ValidationOption[]
  >([
    {
      id: "row-count",
      name: "Row Count Validation",
      description: "Compare record counts between source and target tables",
      icon: Database,
      category: "data-integrity",
      enabled: true,
      severity: "critical",
      estimatedTime: "1-2 minutes",
    },
    {
      id: "data-type",
      name: "Data Type Matching",
      description: "Verify data types match between source and target fields",
      icon: Shield,
      category: "data-integrity",
      enabled: true,
      severity: "high",
      estimatedTime: "2-5 minutes",
    },
    {
      id: "null-check",
      name: "NULL Value Validation",
      description: "Ensure NULL values are preserved correctly",
      icon: AlertTriangle,
      category: "data-integrity",
      enabled: true,
      severity: "medium",
      estimatedTime: "3-7 minutes",
    },
    {
      id: "primary-key",
      name: "Primary Key Validation",
      description: "Validate primary key uniqueness and presence",
      icon: CheckCircle,
      category: "data-integrity",
      enabled: true,
      severity: "critical",
      estimatedTime: "2-4 minutes",
    },
    {
      id: "foreign-key",
      name: "Foreign Key Validation",
      description: "Check referential integrity between tables",
      icon: Target,
      category: "data-integrity",
      enabled: false,
      severity: "high",
      estimatedTime: "5-15 minutes",
    },
    {
      id: "duplicate-check",
      name: "Duplicate Detection",
      description: "Identify duplicate records based on business rules",
      icon: Zap,
      category: "business-rules",
      enabled: false,
      severity: "medium",
      estimatedTime: "10-20 minutes",
    },
    {
      id: "data-range",
      name: "Data Range Validation",
      description: "Verify data values fall within expected ranges",
      icon: Settings,
      category: "business-rules",
      enabled: false,
      severity: "low",
      estimatedTime: "5-10 minutes",
    },
    {
      id: "performance-test",
      name: "Performance Benchmarking",
      description: "Compare query performance between source and target",
      icon: Clock,
      category: "performance",
      enabled: false,
      severity: "low",
      estimatedTime: "15-30 minutes",
    },
  ]);

  const [config, setConfig] = useState<ValidationConfig>({
    batchSize: 10000,
    maxConcurrency: 4,
    timeoutMinutes: 30,
    enableLogging: true,
    stopOnFirstError: false,
    includeStatistics: true,
  });

  const [customValidation, setCustomValidation] = useState("");

  const toggleValidation = (id: string) => {
    setValidationOptions(
      validationOptions.map((option) =>
        option.id === id ? { ...option, enabled: !option.enabled } : option,
      ),
    );
  };

  const enabledValidations = validationOptions.filter((v) => v.enabled);
  const criticalValidations = enabledValidations.filter(
    (v) => v.severity === "critical",
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "data-integrity":
        return <Shield className="h-4 w-4" />;
      case "performance":
        return <Clock className="h-4 w-4" />;
      case "business-rules":
        return <Settings className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-destructive";
      case "high":
        return "text-warning";
      case "medium":
        return "text-primary";
      case "low":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge className="bg-warning">High</Badge>;
      case "medium":
        return <Badge className="bg-primary">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getEstimatedTime = () => {
    // Simple estimation based on enabled validations
    const baseTime = enabledValidations.length * 2;
    const complexityMultiplier = enabledValidations.some((v) =>
      ["foreign-key", "duplicate-check", "performance-test"].includes(v.id),
    )
      ? 2
      : 1;
    return `${baseTime * complexityMultiplier}-${
      baseTime * complexityMultiplier + 10
    } minutes`;
  };

  const groupedValidations = validationOptions.reduce(
    (groups, validation) => {
      const category = validation.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(validation);
      return groups;
    },
    {} as Record<string, ValidationOption[]>,
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Validation Configuration
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Configure validation rules and performance settings
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
              <span className="text-sm font-medium">Tables Selected</span>
            </div>
            <div className="h-px bg-border flex-1"></div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Settings className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium">Validation Rules</span>
            </div>
            <div className="h-px bg-muted flex-1"></div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground">
                  5
                </span>
              </div>
              <span className="text-sm text-muted-foreground">Run</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {enabledValidations.length}
            </div>
            <p className="text-xs text-muted-foreground">Validations Enabled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {criticalValidations.length}
            </div>
            <p className="text-xs text-muted-foreground">Critical Checks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-accent">
              {getEstimatedTime()}
            </div>
            <p className="text-xs text-muted-foreground">Estimated Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">3</div>
            <p className="text-xs text-muted-foreground">Tables Ready</p>
          </CardContent>
        </Card>
      </div>

      {/* Validation Options */}
      <div className="space-y-6">
        {Object.entries(groupedValidations).map(([category, validations]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getCategoryIcon(category)}
                <span className="capitalize">
                  {category.replace("-", " ")} Validations
                </span>
                <Badge variant="outline">
                  {validations.filter((v) => v.enabled).length} /{" "}
                  {validations.length} enabled
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {validations.map((validation) => (
                <div
                  key={validation.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    validation.enabled
                      ? "bg-accent/20 border-primary/50"
                      : "bg-muted/20"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={validation.enabled}
                      onCheckedChange={() => toggleValidation(validation.id)}
                    />
                    <validation.icon
                      className={`h-5 w-5 ${
                        validation.enabled
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{validation.name}</h4>
                        {getSeverityBadge(validation.severity)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {validation.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {validation.estimatedTime}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Performance Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="batch-size">
                  Batch Size: {config.batchSize.toLocaleString()} records
                </Label>
                <Slider
                  id="batch-size"
                  min={1000}
                  max={100000}
                  step={1000}
                  value={[config.batchSize]}
                  onValueChange={(value) =>
                    setConfig({ ...config, batchSize: value[0] })
                  }
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Larger batches improve performance but use more memory
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="concurrency">
                  Max Concurrency: {config.maxConcurrency} threads
                </Label>
                <Slider
                  id="concurrency"
                  min={1}
                  max={16}
                  step={1}
                  value={[config.maxConcurrency]}
                  onValueChange={(value) =>
                    setConfig({ ...config, maxConcurrency: value[0] })
                  }
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  More threads increase speed but may impact database
                  performance
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeout">Timeout (minutes)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={config.timeoutMinutes}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      timeoutMinutes: parseInt(e.target.value) || 30,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Maximum time allowed for the entire validation process
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable-logging">
                      Enable Detailed Logging
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Log all validation steps and results
                    </p>
                  </div>
                  <Switch
                    id="enable-logging"
                    checked={config.enableLogging}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, enableLogging: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="stop-on-error">Stop on First Error</Label>
                    <p className="text-xs text-muted-foreground">
                      Halt validation when first error is encountered
                    </p>
                  </div>
                  <Switch
                    id="stop-on-error"
                    checked={config.stopOnFirstError}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, stopOnFirstError: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="include-stats">Include Statistics</Label>
                    <p className="text-xs text-muted-foreground">
                      Generate detailed performance statistics
                    </p>
                  </div>
                  <Switch
                    id="include-stats"
                    checked={config.includeStatistics}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, includeStatistics: checked })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Validation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>Custom Validation (Optional)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-validation">
              Custom SQL Validation Query
            </Label>
            <Textarea
              id="custom-validation"
              placeholder="SELECT COUNT(*) FROM source_table WHERE condition..."
              value={customValidation}
              onChange={(e) => setCustomValidation(e.target.value)}
              className="min-h-[100px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Add custom SQL queries to validate specific business rules
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Validation Summary */}
      {enabledValidations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Validation Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {enabledValidations.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Validations
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {config.batchSize.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Batch Size
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">
                    {config.maxConcurrency}
                  </div>
                  <div className="text-sm text-muted-foreground">Threads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {getEstimatedTime()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Estimated Time
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Enabled Validations:</h4>
                <div className="flex flex-wrap gap-2">
                  {enabledValidations.map((validation) => (
                    <Badge key={validation.id} className="bg-primary">
                      {validation.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Step */}
      <div className="flex justify-between items-center">
        <Link to="/select-tables">
          <Button variant="outline">Back to Table Selection</Button>
        </Link>
        <Link to="/run-validation">
          <Button disabled={enabledValidations.length === 0}>
            Start Validation Process
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
