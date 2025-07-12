import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  Database,
  Clock,
} from "lucide-react";

interface ValidationResult {
  id: string;
  table: string;
  status: "pass" | "fail" | "warning";
  rowCountMatch: boolean;
  typeMatch: boolean;
  nullsMatch: boolean;
  primaryKeyMatch: boolean;
  foreignKeyMatch: boolean;
  sourceRows: number;
  targetRows: number;
  issues: number;
}

interface ValidationDetail {
  id: string;
  table: string;
  field: string;
  sourceValue: string;
  targetValue: string;
  mismatchType: string;
  severity: "error" | "warning";
}

export function Results() {
  const [selectedTable, setSelectedTable] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const validationResults: ValidationResult[] = [
    {
      id: "1",
      table: "customers",
      status: "fail",
      rowCountMatch: false,
      typeMatch: true,
      nullsMatch: true,
      primaryKeyMatch: false,
      foreignKeyMatch: true,
      sourceRows: 10000,
      targetRows: 9999,
      issues: 3,
    },
    {
      id: "2",
      table: "orders",
      status: "pass",
      rowCountMatch: true,
      typeMatch: true,
      nullsMatch: true,
      primaryKeyMatch: true,
      foreignKeyMatch: true,
      sourceRows: 45678,
      targetRows: 45678,
      issues: 0,
    },
    {
      id: "3",
      table: "products",
      status: "warning",
      rowCountMatch: true,
      typeMatch: false,
      nullsMatch: true,
      primaryKeyMatch: true,
      foreignKeyMatch: true,
      sourceRows: 1250,
      targetRows: 1250,
      issues: 2,
    },
    {
      id: "4",
      table: "order_items",
      status: "pass",
      rowCountMatch: true,
      typeMatch: true,
      nullsMatch: true,
      primaryKeyMatch: true,
      foreignKeyMatch: true,
      sourceRows: 123456,
      targetRows: 123456,
      issues: 0,
    },
    {
      id: "5",
      table: "categories",
      status: "warning",
      rowCountMatch: true,
      typeMatch: true,
      nullsMatch: false,
      primaryKeyMatch: true,
      foreignKeyMatch: true,
      sourceRows: 45,
      targetRows: 45,
      issues: 1,
    },
  ];

  const validationDetails: ValidationDetail[] = [
    {
      id: "1",
      table: "customers",
      field: "customer_id",
      sourceValue: "12345",
      targetValue: "NULL",
      mismatchType: "Missing Record",
      severity: "error",
    },
    {
      id: "2",
      table: "customers",
      field: "email",
      sourceValue: "john@example.com",
      targetValue: "NULL",
      mismatchType: "Null Value",
      severity: "error",
    },
    {
      id: "3",
      table: "products",
      field: "price",
      sourceValue: "499.99",
      targetValue: "'499.99'",
      mismatchType: "Data Type",
      severity: "warning",
    },
    {
      id: "4",
      table: "categories",
      field: "description",
      sourceValue: "Electronics",
      targetValue: "NULL",
      mismatchType: "Null Value",
      severity: "warning",
    },
  ];

  const totalTables = validationResults.length;
  const passedTables = validationResults.filter(
    (r) => r.status === "pass",
  ).length;
  const failedTables = validationResults.filter(
    (r) => r.status === "fail",
  ).length;
  const warningTables = validationResults.filter(
    (r) => r.status === "warning",
  ).length;
  const totalIssues = validationResults.reduce((sum, r) => sum + r.issues, 0);
  const successRate = ((passedTables / totalTables) * 100).toFixed(1);

  const filteredResults = validationResults.filter((result) => {
    const matchesTable =
      selectedTable === "all" || result.table === selectedTable;
    const matchesStatus =
      selectedStatus === "all" || result.status === selectedStatus;
    return matchesTable && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "fail":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass":
        return <Badge className="bg-success">Pass</Badge>;
      case "warning":
        return <Badge className="bg-warning">Warning</Badge>;
      case "fail":
        return <Badge variant="destructive">Fail</Badge>;
      default:
        return null;
    }
  };

  const downloadReport = (format: string) => {
    // Simulate download
    console.log(`Downloading report in ${format} format`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Validation Results
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Customer Migration Validation - Completed 2 hours ago
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTables}</div>
            <p className="text-xs text-muted-foreground">Validated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {successRate}%
            </div>
            <Progress value={parseFloat(successRate)} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {passedTables}
            </div>
            <p className="text-xs text-muted-foreground">Tables</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {warningTables}
            </div>
            <p className="text-xs text-muted-foreground">Tables</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {failedTables}
            </div>
            <p className="text-xs text-muted-foreground">Tables</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="summary" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="download">Download</TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="w-32 lg:w-40">
                <SelectValue placeholder="All tables" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tables</SelectItem>
                {validationResults.map((result) => (
                  <SelectItem key={result.table} value={result.table}>
                    {result.table}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-28 lg:w-32">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pass">Pass</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="fail">Fail</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Row Count</TableHead>
                    <TableHead>Type Match</TableHead>
                    <TableHead>Nulls Match</TableHead>
                    <TableHead>Primary Key</TableHead>
                    <TableHead>Foreign Key</TableHead>
                    <TableHead>Issues</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-mono text-sm">
                        {result.table}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(result.status)}
                          {getStatusBadge(result.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {result.rowCountMatch ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell>
                        {result.typeMatch ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell>
                        {result.nullsMatch ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell>
                        {result.primaryKeyMatch ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell>
                        {result.foreignKeyMatch ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell>
                        {result.issues > 0 ? (
                          <Badge variant="outline" className="text-destructive">
                            {result.issues}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-success">
                            0
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table</TableHead>
                    <TableHead>Field</TableHead>
                    <TableHead>Source Value</TableHead>
                    <TableHead>Target Value</TableHead>
                    <TableHead>Mismatch Type</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validationDetails.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell className="font-mono text-sm">
                        {detail.table}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {detail.field}
                      </TableCell>
                      <TableCell className="font-mono text-sm bg-muted/30 px-2 py-1 rounded">
                        {detail.sourceValue}
                      </TableCell>
                      <TableCell className="font-mono text-sm bg-muted/30 px-2 py-1 rounded">
                        {detail.targetValue}
                      </TableCell>
                      <TableCell>{detail.mismatchType}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            detail.severity === "error"
                              ? "destructive"
                              : "outline"
                          }
                          className={
                            detail.severity === "warning" ? "text-warning" : ""
                          }
                        >
                          {detail.severity}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Download Tab */}
        <TabsContent value="download" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Download Validation Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Excel Report</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Complete validation report with summary and details
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => downloadReport("excel")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download .xlsx
                  </Button>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">CSV Report</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Raw data in CSV format for further analysis
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => downloadReport("csv")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download .csv
                  </Button>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">PDF Report</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Executive summary for stakeholders
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => downloadReport("pdf")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download .pdf
                  </Button>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Report Contents:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Validation summary with success rates</li>
                  <li>• Detailed mismatch analysis per table</li>
                  <li>• Data quality metrics and recommendations</li>
                  <li>• Migration readiness assessment</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
