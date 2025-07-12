import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Database,
  Search,
  CheckCircle,
  ArrowRight,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  Users,
  ShoppingCart,
  Package,
  Tag,
} from "lucide-react";
import { Link } from "react-router-dom";

interface TableInfo {
  name: string;
  schema: string;
  rowCount: number;
  fields: FieldInfo[];
  icon: any;
  description: string;
}

interface FieldInfo {
  name: string;
  type: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  mappedTo?: string;
}

export function SelectTables() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<
    Record<string, string[]>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  // Sample table data
  const tables: TableInfo[] = [
    {
      name: "customers",
      schema: "public",
      rowCount: 10000,
      icon: Users,
      description: "Customer master data with personal information",
      fields: [
        {
          name: "customer_id",
          type: "INTEGER",
          nullable: false,
          isPrimaryKey: true,
          isForeignKey: false,
          mappedTo: "cust_id",
        },
        {
          name: "customer_name",
          type: "VARCHAR(255)",
          nullable: false,
          isPrimaryKey: false,
          isForeignKey: false,
          mappedTo: "cust_name",
        },
        {
          name: "email_address",
          type: "VARCHAR(255)",
          nullable: true,
          isPrimaryKey: false,
          isForeignKey: false,
          mappedTo: "email",
        },
        {
          name: "created_date",
          type: "TIMESTAMP",
          nullable: false,
          isPrimaryKey: false,
          isForeignKey: false,
          mappedTo: "date_created",
        },
        {
          name: "status",
          type: "VARCHAR(50)",
          nullable: false,
          isPrimaryKey: false,
          isForeignKey: false,
          mappedTo: "customer_status",
        },
      ],
    },
    {
      name: "orders",
      schema: "public",
      rowCount: 45678,
      icon: ShoppingCart,
      description: "Order transactions and purchase history",
      fields: [
        {
          name: "order_id",
          type: "INTEGER",
          nullable: false,
          isPrimaryKey: true,
          isForeignKey: false,
          mappedTo: "order_number",
        },
        {
          name: "customer_id",
          type: "INTEGER",
          nullable: false,
          isPrimaryKey: false,
          isForeignKey: true,
          mappedTo: "cust_id",
        },
        {
          name: "order_date",
          type: "TIMESTAMP",
          nullable: false,
          isPrimaryKey: false,
          isForeignKey: false,
          mappedTo: "purchase_date",
        },
        {
          name: "order_total",
          type: "DECIMAL(10,2)",
          nullable: false,
          isPrimaryKey: false,
          isForeignKey: false,
          mappedTo: "total_amount",
        },
        {
          name: "order_status",
          type: "VARCHAR(50)",
          nullable: false,
          isPrimaryKey: false,
          isForeignKey: false,
          mappedTo: "status",
        },
      ],
    },
    {
      name: "products",
      schema: "public",
      rowCount: 1250,
      icon: Package,
      description: "Product catalog with pricing and inventory",
      fields: [
        {
          name: "product_id",
          type: "INTEGER",
          nullable: false,
          isPrimaryKey: true,
          isForeignKey: false,
          mappedTo: "sku",
        },
        {
          name: "product_name",
          type: "VARCHAR(255)",
          nullable: false,
          isPrimaryKey: false,
          isForeignKey: false,
          mappedTo: "title",
        },
        {
          name: "price",
          type: "DECIMAL(10,2)",
          nullable: false,
          isPrimaryKey: false,
          isForeignKey: false,
          mappedTo: "unit_price",
        },
        {
          name: "category_id",
          type: "INTEGER",
          nullable: true,
          isPrimaryKey: false,
          isForeignKey: true,
          mappedTo: "cat_id",
        },
      ],
    },
    {
      name: "categories",
      schema: "public",
      rowCount: 45,
      icon: Tag,
      description: "Product categorization and hierarchy",
      fields: [
        {
          name: "category_id",
          type: "INTEGER",
          nullable: false,
          isPrimaryKey: true,
          isForeignKey: false,
          mappedTo: "cat_id",
        },
        {
          name: "category_name",
          type: "VARCHAR(100)",
          nullable: false,
          isPrimaryKey: false,
          isForeignKey: false,
          mappedTo: "name",
        },
        {
          name: "description",
          type: "TEXT",
          nullable: true,
          isPrimaryKey: false,
          isForeignKey: false,
          mappedTo: "desc",
        },
      ],
    },
  ];

  const filteredTables = tables.filter((table) =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleTableSelect = (tableName: string, checked: boolean) => {
    if (checked) {
      setSelectedTables([...selectedTables, tableName]);
      // Auto-select all fields when table is selected
      const table = tables.find((t) => t.name === tableName);
      if (table) {
        setSelectedFields({
          ...selectedFields,
          [tableName]: table.fields.map((f) => f.name),
        });
      }
    } else {
      setSelectedTables(selectedTables.filter((t) => t !== tableName));
      const newSelectedFields = { ...selectedFields };
      delete newSelectedFields[tableName];
      setSelectedFields(newSelectedFields);
    }
  };

  const handleFieldSelect = (
    tableName: string,
    fieldName: string,
    checked: boolean,
  ) => {
    const tableFields = selectedFields[tableName] || [];
    if (checked) {
      setSelectedFields({
        ...selectedFields,
        [tableName]: [...tableFields, fieldName],
      });
    } else {
      setSelectedFields({
        ...selectedFields,
        [tableName]: tableFields.filter((f) => f !== fieldName),
      });
    }
  };

  const refreshTables = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const selectAllTables = () => {
    const allTableNames = tables.map((t) => t.name);
    setSelectedTables(allTableNames);
    const allFields: Record<string, string[]> = {};
    tables.forEach((table) => {
      allFields[table.name] = table.fields.map((f) => f.name);
    });
    setSelectedFields(allFields);
  };

  const clearAllTables = () => {
    setSelectedTables([]);
    setSelectedFields({});
  };

  const getTotalSelectedFields = () => {
    return Object.values(selectedFields).reduce(
      (total, fields) => total + fields.length,
      0,
    );
  };

  const getFieldIcon = (field: FieldInfo) => {
    if (field.isPrimaryKey) return "🔑";
    if (field.isForeignKey) return "🔗";
    if (!field.nullable) return "⚡";
    return "";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Select Tables & Fields
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Choose which tables and fields to include in the validation process
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
              <span className="text-sm font-medium">Source & Target</span>
            </div>
            <div className="h-px bg-border flex-1"></div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Database className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium">Select Tables</span>
            </div>
            <div className="h-px bg-muted flex-1"></div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground">
                  4
                </span>
              </div>
              <span className="text-sm text-muted-foreground">Validations</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{tables.length}</div>
            <p className="text-xs text-muted-foreground">Total Tables</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {selectedTables.length}
            </div>
            <p className="text-xs text-muted-foreground">Selected Tables</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-accent">
              {getTotalSelectedFields()}
            </div>
            <p className="text-xs text-muted-foreground">Selected Fields</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">
              {tables.reduce((sum, t) => sum + t.rowCount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total Rows</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshTables}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {isLoading ? "Loading..." : "Refresh"}
              </Button>
              <Button variant="outline" size="sm" onClick={selectAllTables}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={clearAllTables}>
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tables and Fields */}
      <Tabs defaultValue="tables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tables">Tables Overview</TabsTrigger>
          <TabsTrigger value="fields">Field Details</TabsTrigger>
        </TabsList>

        {/* Tables Tab */}
        <TabsContent value="tables" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTables.map((table) => {
              const isSelected = selectedTables.includes(table.name);
              const selectedFieldCount =
                selectedFields[table.name]?.length || 0;

              return (
                <Card
                  key={table.name}
                  className={`transition-colors ${
                    isSelected ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleTableSelect(table.name, checked as boolean)
                          }
                        />
                        <table.icon className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg font-mono">
                            {table.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {table.schema} schema
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {table.rowCount.toLocaleString()} rows
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {table.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {table.fields.length} fields
                      </span>
                      {isSelected && (
                        <Badge className="bg-primary">
                          {selectedFieldCount} selected
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Fields Tab */}
        <TabsContent value="fields" className="space-y-4">
          {selectedTables.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Tables Selected</h3>
                <p className="text-muted-foreground">
                  Select tables from the Tables Overview tab to configure field
                  selection
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {selectedTables.map((tableName) => {
                const table = tables.find((t) => t.name === tableName);
                if (!table) return null;

                return (
                  <Card key={tableName}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <table.icon className="h-5 w-5" />
                        <span className="font-mono">{table.name}</span>
                        <Badge variant="outline">
                          {selectedFields[tableName]?.length || 0} /{" "}
                          {table.fields.length} fields
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Field Name</TableHead>
                            <TableHead>Data Type</TableHead>
                            <TableHead>Mapped To</TableHead>
                            <TableHead>Properties</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {table.fields.map((field) => {
                            const isFieldSelected = (
                              selectedFields[tableName] || []
                            ).includes(field.name);

                            return (
                              <TableRow key={field.name}>
                                <TableCell>
                                  <Checkbox
                                    checked={isFieldSelected}
                                    onCheckedChange={(checked) =>
                                      handleFieldSelect(
                                        tableName,
                                        field.name,
                                        checked as boolean,
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell className="font-mono text-sm">
                                  <div className="flex items-center space-x-2">
                                    <span>{field.name}</span>
                                    <span>{getFieldIcon(field)}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="font-mono text-sm text-muted-foreground">
                                  {field.type}
                                </TableCell>
                                <TableCell className="font-mono text-sm">
                                  {field.mappedTo || (
                                    <span className="text-muted-foreground">
                                      Not mapped
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-1">
                                    {field.isPrimaryKey && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        PK
                                      </Badge>
                                    )}
                                    {field.isForeignKey && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        FK
                                      </Badge>
                                    )}
                                    {!field.nullable && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        NOT NULL
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Selection Summary */}
      {selectedTables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Selection Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {selectedTables.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Tables Selected
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {getTotalSelectedFields()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Fields Selected
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {selectedTables
                    .reduce((sum, tableName) => {
                      const table = tables.find((t) => t.name === tableName);
                      return sum + (table?.rowCount || 0);
                    }, 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Rows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {selectedTables
                    .map((tableName) => {
                      const table = tables.find((t) => t.name === tableName);
                      return table?.fields.filter((f) => f.isPrimaryKey).length;
                    })
                    .reduce((sum, count) => sum + (count || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Primary Keys
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Step */}
      <div className="flex justify-between items-center">
        <Link to="/target-config">
          <Button variant="outline">Back to Target Config</Button>
        </Link>
        <Link to="/validations">
          <Button disabled={selectedTables.length === 0}>
            Continue to Validations
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
