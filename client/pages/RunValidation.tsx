import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  Square,
  AlertTriangle,
  Clock,
  Database,
  Zap,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

interface ValidationStep {
  id: string;
  name: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  progress: number;
  startTime?: Date;
  endTime?: Date;
  duration?: string;
  recordsProcessed?: number;
  totalRecords?: number;
  errors?: string[];
  warnings?: string[];
}

interface ValidationRun {
  id: string;
  status: "not-started" | "running" | "paused" | "completed" | "failed";
  overallProgress: number;
  startTime?: Date;
  estimatedCompletion?: Date;
  totalSteps: number;
  completedSteps: number;
}

export function RunValidation() {
  const [validationRun, setValidationRun] = useState<ValidationRun>({
    id: "run-" + Date.now(),
    status: "not-started",
    overallProgress: 0,
    totalSteps: 6,
    completedSteps: 0,
  });

  const [showStopDialog, setShowStopDialog] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const [validationSteps, setValidationSteps] = useState<ValidationStep[]>([
    {
      id: "init",
      name: "Initialize Validation",
      description:
        "Setting up connections and preparing validation environment",
      status: "pending",
      progress: 0,
    },
    {
      id: "row-count",
      name: "Row Count Validation",
      description: "Comparing record counts between source and target tables",
      status: "pending",
      progress: 0,
      totalRecords: 57000,
    },
    {
      id: "data-type",
      name: "Data Type Validation",
      description: "Verifying data types match between source and target",
      status: "pending",
      progress: 0,
      totalRecords: 12500,
    },
    {
      id: "null-check",
      name: "NULL Value Validation",
      description: "Checking NULL value preservation and consistency",
      status: "pending",
      progress: 0,
      totalRecords: 57000,
    },
    {
      id: "primary-key",
      name: "Primary Key Validation",
      description: "Validating primary key uniqueness and integrity",
      status: "pending",
      progress: 0,
      totalRecords: 4,
    },
    {
      id: "finalize",
      name: "Generate Report",
      description: "Compiling validation results and generating reports",
      status: "pending",
      progress: 0,
    },
  ]);

  const startValidation = () => {
    setValidationRun({
      ...validationRun,
      status: "running",
      startTime: new Date(),
      estimatedCompletion: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    });

    // Simulate validation process
    simulateValidation();
  };

  const pauseValidation = () => {
    setValidationRun({ ...validationRun, status: "paused" });
  };

  const resumeValidation = () => {
    setValidationRun({ ...validationRun, status: "running" });
  };

  const stopValidation = () => {
    setValidationRun({ ...validationRun, status: "failed" });
    setShowStopDialog(false);
  };

  const simulateValidation = () => {
    let currentStepIndex = 0;

    const processStep = () => {
      if (currentStepIndex >= validationSteps.length) {
        // Validation completed
        setValidationRun((prev) => ({
          ...prev,
          status: "completed",
          overallProgress: 100,
          completedSteps: prev.totalSteps,
        }));
        return;
      }

      const currentStep = validationSteps[currentStepIndex];

      // Start the step
      setValidationSteps((prev) =>
        prev.map((step, index) =>
          index === currentStepIndex
            ? {
                ...step,
                status: "running",
                startTime: new Date(),
              }
            : step,
        ),
      );

      // Simulate step progress
      let stepProgress = 0;
      const stepInterval = setInterval(() => {
        stepProgress += Math.random() * 20;

        if (stepProgress >= 100) {
          stepProgress = 100;
          clearInterval(stepInterval);

          // Complete the step
          setValidationSteps((prev) =>
            prev.map((step, index) =>
              index === currentStepIndex
                ? {
                    ...step,
                    status: Math.random() > 0.8 ? "failed" : "completed",
                    progress: 100,
                    endTime: new Date(),
                    duration: "1.2s",
                    recordsProcessed: step.totalRecords,
                    errors: Math.random() > 0.8 ? ["Sample error message"] : [],
                    warnings: Math.random() > 0.5 ? ["Sample warning"] : [],
                  }
                : step,
            ),
          );

          // Update overall progress
          const completedSteps = currentStepIndex + 1;
          const overallProgress =
            (completedSteps / validationSteps.length) * 100;

          setValidationRun((prev) => ({
            ...prev,
            overallProgress,
            completedSteps,
          }));

          // Move to next step
          currentStepIndex++;
          setTimeout(processStep, 1000);
        } else {
          // Update step progress
          setValidationSteps((prev) =>
            prev.map((step, index) =>
              index === currentStepIndex
                ? {
                    ...step,
                    progress: stepProgress,
                    recordsProcessed: Math.floor(
                      (stepProgress / 100) * (step.totalRecords || 0),
                    ),
                  }
                : step,
            ),
          );

          // Update overall progress
          const baseProgress =
            (currentStepIndex / validationSteps.length) * 100;
          const stepContribution =
            (stepProgress / 100) * (100 / validationSteps.length);
          const overallProgress = baseProgress + stepContribution;

          setValidationRun((prev) => ({
            ...prev,
            overallProgress,
          }));
        }
      }, 500);
    };

    processStep();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "running":
        return <Zap className="h-5 w-5 text-primary animate-pulse" />;
      case "failed":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "paused":
        return <Pause className="h-5 w-5 text-warning" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success">Completed</Badge>;
      case "running":
        return <Badge className="bg-primary">Running</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "paused":
        return <Badge className="bg-warning">Paused</Badge>;
      case "skipped":
        return <Badge variant="outline">Skipped</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const formatDuration = (start?: Date, end?: Date) => {
    if (!start) return "-";
    const endTime = end || new Date();
    const duration = Math.abs(endTime.getTime() - start.getTime()) / 1000;
    return `${duration.toFixed(1)}s`;
  };

  const isValidationActive = ["running", "paused"].includes(
    validationRun.status,
  );
  const isValidationCompleted = validationRun.status === "completed";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Run Validation Process
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Execute data validation and monitor progress in real-time
        </p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Validation Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(validationRun.status)}
              {getStatusBadge(validationRun.status)}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>
                {validationRun.completedSteps} / {validationRun.totalSteps}{" "}
                steps
              </span>
            </div>
            <Progress value={validationRun.overallProgress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {validationRun.startTime &&
                  `Started: ${validationRun.startTime.toLocaleTimeString()}`}
              </span>
              <span>
                {validationRun.estimatedCompletion &&
                  validationRun.status === "running" &&
                  `ETC: ${validationRun.estimatedCompletion.toLocaleTimeString()}`}
              </span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center space-x-2 pt-4 border-t">
            {validationRun.status === "not-started" && (
              <Button onClick={startValidation} className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                Start Validation
              </Button>
            )}

            {validationRun.status === "running" && (
              <>
                <Button
                  onClick={pauseValidation}
                  variant="outline"
                  className="flex items-center"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button
                  onClick={() => setShowStopDialog(true)}
                  variant="destructive"
                  className="flex items-center"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </>
            )}

            {validationRun.status === "paused" && (
              <>
                <Button
                  onClick={resumeValidation}
                  className="flex items-center"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
                <Button
                  onClick={() => setShowStopDialog(true)}
                  variant="destructive"
                  className="flex items-center"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </>
            )}

            {validationRun.status === "completed" && (
              <Link to="/results">
                <Button className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  View Results
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoScroll(!autoScroll)}
              className="ml-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Auto-scroll: {autoScroll ? "On" : "Off"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Validation Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Validation Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {validationSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    step.status === "running"
                      ? "bg-primary/10 border-primary/50"
                      : step.status === "completed"
                        ? "bg-success/10 border-success/50"
                        : step.status === "failed"
                          ? "bg-destructive/10 border-destructive/50"
                          : "bg-muted/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{step.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(step.status)}
                      {getStatusBadge(step.status)}
                    </div>
                  </div>

                  {step.status === "running" && (
                    <div className="space-y-2">
                      <Progress value={step.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {step.recordsProcessed?.toLocaleString() || 0} /{" "}
                          {step.totalRecords?.toLocaleString() || 0} records
                        </span>
                        <span>{step.progress.toFixed(1)}%</span>
                      </div>
                    </div>
                  )}

                  {step.status === "completed" && (
                    <div className="mt-2 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>
                          Duration:{" "}
                          {formatDuration(step.startTime, step.endTime)}
                        </span>
                        <span>
                          {step.recordsProcessed?.toLocaleString()} records
                          processed
                        </span>
                      </div>
                      {step.warnings && step.warnings.length > 0 && (
                        <div className="mt-2 p-2 bg-warning/10 rounded text-warning text-xs">
                          ⚠️ {step.warnings.join(", ")}
                        </div>
                      )}
                    </div>
                  )}

                  {step.status === "failed" && step.errors && (
                    <div className="mt-2 p-2 bg-destructive/10 rounded text-destructive text-xs">
                      ❌ {step.errors.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Validation Summary */}
      {isValidationActive && (
        <Card>
          <CardHeader>
            <CardTitle>Real-time Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {validationSteps
                    .reduce(
                      (sum, step) => sum + (step.recordsProcessed || 0),
                      0,
                    )
                    .toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Records Processed
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {
                    validationSteps.filter((s) => s.status === "completed")
                      .length
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  Steps Completed
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {validationSteps.reduce(
                    (sum, step) => sum + (step.warnings?.length || 0),
                    0,
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {validationSteps.reduce(
                    (sum, step) => sum + (step.errors?.length || 0),
                    0,
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Link to="/validations">
          <Button variant="outline">Back to Configuration</Button>
        </Link>

        {isValidationCompleted && (
          <Link to="/results">
            <Button>
              View Detailed Results
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Stop Confirmation Dialog */}
      <AlertDialog open={showStopDialog} onOpenChange={setShowStopDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Stop Validation Process</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to stop the validation process? This will
              terminate all running validations and you will lose the current
              progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={stopValidation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Stop Validation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
