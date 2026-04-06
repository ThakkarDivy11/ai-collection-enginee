import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Payments from "./pages/Payments";
import AiInsights from "./pages/AiInsights";
import CustomerDashboard from "./pages/CustomerDashboard";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import DemoOne from "./pages/demo";
import ShaderDemo from "./pages/ShaderDemo";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/clients" element={
          <ProtectedRoute>
            <Layout><Clients /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/payments" element={
          <ProtectedRoute>
            <Layout><Payments /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/ai-insights" element={
          <ProtectedRoute>
            <Layout><AiInsights /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout><Settings /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/customer-dashboard" element={
          <ProtectedRoute>
            <CustomerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/demo" element={<DemoOne />} />
        <Route path="/shader-demo" element={<ShaderDemo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;