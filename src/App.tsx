import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import NotFound from "./pages/NotFound";
import AgendamentoPetShop from "./pages/AgendamentoPetShop";
import AgendaOnlineBanhoTosa from "./pages/AgendaOnlineBanhoTosa";
import SistemaParaPetShop from "./pages/SistemaParaPetShop";
import { SEO } from "./components/SEO";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* SEO Niche Pages */}
          <Route path="/agendamento-pet-shop" element={<AgendamentoPetShop />} />
          <Route path="/agenda-online-banho-e-tosa" element={<AgendaOnlineBanhoTosa />} />
          <Route path="/sistema-para-pet-shop" element={<SistemaParaPetShop />} />

          {/* Dynamic Profile Route - Place last to avoid conflicts */}
          <Route path="/:slug" element={<ProfessionalProfile />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
