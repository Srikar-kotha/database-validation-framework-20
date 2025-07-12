import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

interface MappingRow {
  id: string;
  sourceField: string;
  targetField: string;
  dataType: string;
  status: "valid" | "warning" | "error";
}

export function UploadMapping() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [mappingData, setMappingData] = useState<MappingRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sampleMappings: MappingRow[] = [
    {
      id: "1",
      sourceField: "customer_id",
      targetField: "cust_id",
      dataType: "INTEGER",
      status: "valid",
    },
    {
      id: "2",
      sourceField: "customer_name",
      targetField: "cust_name",
      dataType: "VARCHAR(255)",
      status: "valid",
    },
    {
      id: "3",
      sourceField: "email_address",
      targetField: "email",
      dataType: "VARCHAR(255)",
      status: "warning",
    },
    {
      id: "4",
      sourceField: "created_date",
      targetField: "date_created",
      dataType: "TIMESTAMP",
      status: "valid",
    },
    {
      id: "5",
      sourceField: "order_total",
      targetField: "total_amount",
      dataType: "DECIMAL(10,2)",
      status: "error",
    },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsProcessing(true);

      // Simulate file processing
      setTimeout(() => {
        setMappingData(sampleMappings);
        setIsProcessing(false);
      }, 2000);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type.includes("csv") || file.type.includes("excel"))) {
      setUploadedFile(file);
      setIsProcessing(true);

      setTimeout(() => {
        setMappingData(sampleMappings);
        setIsProcessing(false);
      }, 2000);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setMappingData([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return <Badge className="bg-success">Valid</Badge>;
      case "warning":
        return <Badge className="bg-warning">Warning</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return null;
    }
  };

  const validCount = mappingData.filter((m) => m.status === "valid").length;
  const warningCount = mappingData.filter((m) => m.status === "warning").length;
  const errorCount = mappingData.filter((m) => m.status === "error").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Upload Mapping File
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Upload a CSV or Excel file that maps source fields to target fields
        </p>
      </div>

      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>File Upload</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!uploadedFile ? (
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Mapping File</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your CSV or Excel file here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Supported formats: .csv, .xlsx, .xls
              </p>
              <input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing file...</span>
                    <span>Please wait</span>
                  </div>
                  <Progress value={undefined} className="h-2" />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mapping Preview */}
      {mappingData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Mapping Preview</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{mappingData.length} mappings</Badge>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">
                  {validCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Valid Mappings
                </div>
              </div>
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <div className="text-2xl font-bold text-warning">
                  {warningCount}
                </div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <div className="text-2xl font-bold text-destructive">
                  {errorCount}
                </div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
            </div>

            {/* Mapping Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Source Field</TableHead>
                    <TableHead>Target Field</TableHead>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappingData.map((mapping) => (
                    <TableRow key={mapping.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(mapping.status)}
                          {getStatusBadge(mapping.status)}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {mapping.sourceField}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {mapping.targetField}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {mapping.dataType}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Step */}
      {mappingData.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {errorCount > 0 ? (
              <span className="text-destructive">
                Please resolve {errorCount} error(s) before proceeding
              </span>
            ) : (
              <span className="text-success">
                Mapping file validated successfully
              </span>
            )}
          </div>
          <Link to="/source-config">
            <Button disabled={errorCount > 0}>
              Continue to Source Configuration
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
