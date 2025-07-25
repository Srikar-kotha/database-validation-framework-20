import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Overview } from "./pages/Overview";
import { UploadMapping } from "./pages/UploadMapping";
import { SourceConfig } from "./pages/SourceConfig";
import { TargetConfig } from "./pages/TargetConfig";
import { SelectTables } from "./pages/SelectTables";
import { Validations } from "./pages/Validations";
import { RunValidation } from "./pages/RunValidation";
import { Results } from "./pages/Results";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Placeholder components for other routes
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-lg text-muted-foreground mt-2">
          This page is coming soon...
        </p>
      </div>
      <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center">
        <p className="text-muted-foreground">
          Content for {title} will be implemented here.
        </p>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/upload-mapping" element={<UploadMapping />} />
            <Route path="/source-config" element={<SourceConfig />} />
            <Route path="/target-config" element={<TargetConfig />} />
            <Route path="/select-tables" element={<SelectTables />} />
            <Route path="/validations" element={<Validations />} />
            <Route path="/run-validation" element={<RunValidation />} />
            <Route path="/results" element={<Results />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
