import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/SiteLayout";
import { WebMcpTools } from "./components/WebMcpTools";
import { BrowsePage } from "./pages/BrowsePage";
import {
  McpDetailPage,
  PluginDetailPage,
} from "./pages/CatalogDetailPage";
import { HomePage } from "./pages/HomePage";
import { LanguagePage } from "./pages/LanguagePage";
import { LanguagesPage } from "./pages/LanguagesPage";
import { McpsPage } from "./pages/McpsPage";
import { PluginsPage } from "./pages/PluginsPage";
import { SdkDetailPage } from "./pages/SdkDetailPage";
import { SearchPage } from "./pages/SearchPage";

export default function App() {
  return (
    <BrowserRouter>
      <WebMcpTools />
      <SiteLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/plugins" element={<PluginsPage />} />
          <Route path="/plugin/:slug" element={<PluginDetailPage />} />
          <Route path="/mcps" element={<McpsPage />} />
          <Route path="/mcp/:slug" element={<McpDetailPage />} />
          <Route path="/languages" element={<LanguagesPage />} />
          <Route path="/languages/:langId" element={<LanguagePage />} />
          <Route path="/sdk/:slug" element={<SdkDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route
            path="*"
            element={
              <section className="relative z-10 mx-auto min-h-[50vh] w-full max-w-[1200px] px-5 py-16 md:px-6">
                <h1 className="text-display-lg text-ink">Page not found</h1>
                <p className="mt-3 text-body">
                  That route is not in the directory.
                </p>
              </section>
            }
          />
        </Routes>
      </SiteLayout>
    </BrowserRouter>
  );
}
