import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Database,
  FileText,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

export function Overview() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Data Migration Validator
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Ensure data integrity across your migration process
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium">
              Total Validations
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              <span className="text-success">+12</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+2.1%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tables Processed
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+89</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-destructive">+3</span> since yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Validation Process */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Current Validation Process</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>3 of 8 steps completed</span>
              </div>
              <Progress value={37.5} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-success"></div>
                <span className="text-sm">Upload Mapping File</span>
                <Badge variant="secondary" className="ml-auto">
                  Complete
                </Badge>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-success"></div>
                <span className="text-sm">Source Configuration</span>
                <Badge variant="secondary" className="ml-auto">
                  Complete
                </Badge>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-success"></div>
                <span className="text-sm">Target Configuration</span>
                <Badge variant="secondary" className="ml-auto">
                  Complete
                </Badge>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-sm font-medium">
                  Select Tables & Fields
                </span>
                <Badge className="ml-auto">In Progress</Badge>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-muted"></div>
                <span className="text-sm text-muted-foreground">
                  Choose Validations
                </span>
                <Badge variant="outline" className="ml-auto">
                  Pending
                </Badge>
              </div>
            </div>

            <div className="pt-4">
              <Link to="/select-tables">
                <Button className="w-full">
                  Continue Process
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Recent Validations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm font-medium">Customer Migration</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <Badge className="bg-success">Passed</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-sm font-medium">Product Catalog</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-warning border-warning"
                >
                  Warning
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm font-medium">Order History</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <Badge className="bg-success">Passed</Badge>
              </div>
            </div>

            <div className="pt-4">
              <Link to="/results">
                <Button variant="outline" className="w-full">
                  View All Results
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/upload-mapping">
              <Button variant="outline" className="h-24 flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span>Start New Validation</span>
              </Button>
            </Link>
            <Link to="/results">
              <Button variant="outline" className="h-24 flex-col space-y-2">
                <Target className="h-6 w-6" />
                <span>View Recent Results</span>
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="outline" className="h-24 flex-col space-y-2">
                <Database className="h-6 w-6" />
                <span>Configure Databases</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
