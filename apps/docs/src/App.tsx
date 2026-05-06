import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";

import { NotifyContainer } from "@alisdev/fe-kit-notify";
import { ConfirmContainer } from "@alisdev/fe-kit-confirm";
import { ModalStack } from "@alisdev/fe-kit-modal";

// Pages
import { HomePage } from "./pages/HomePage";
import { GettingStartedPage } from "./pages/GettingStartedPage";
import { NotifyPage } from "./pages/NotifyPage";
import { ConfirmPage } from "./pages/ConfirmPage";
import { FormPage } from "./pages/FormPage";
import { TablePage } from "./pages/TablePage";
import { ModalPage } from "./pages/ModalPage";
import { StorePage } from "./pages/StorePage";
import { ChartPage } from "./pages/ChartPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MapPage } from "./pages/MapPage";
import { RoutePage } from "./pages/RoutePage";
import { AxiosPage } from "./pages/AxiosPage";
import { InputPage } from "./pages/InputPage";
import { UIPage } from "./pages/UIPage";

const PlaceholderPage = ({ name }: { name: string }) => (
  <div className="py-20">
    <h1 className="text-4xl">{name} Kit</h1>
    <p className="text-text-2 mt-4 italic">Demo coming soon in the next phase of development...</p>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/getting-started" element={<GettingStartedPage />} />
          <Route path="/notify" element={<NotifyPage />} />
          <Route path="/confirm" element={<ConfirmPage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/table" element={<TablePage />} />
          <Route path="/modal" element={<ModalPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/chart" element={<ChartPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/route" element={<RoutePage />} />
          <Route path="/axios" element={<AxiosPage />} />
          <Route path="/input" element={<InputPage />} />
          <Route path="/ui" element={<UIPage />} />
        </Routes>
      </Layout>
      <NotifyContainer />
      <ConfirmContainer />
      <ModalStack />
    </BrowserRouter>
  );
};

export default App;
