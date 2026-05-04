import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { RouteConfig } from "../types";
import { AuthRoute, RoleRoute } from "../components/Guards";
import { RouteKit } from "./RouteKit";

export function createRoutes(routes: RouteConfig[]): React.ReactElement {
  return (
    <Routes>
      {renderRoutes(routes)}
    </Routes>
  );
}

function renderRoutes(routes: RouteConfig[]) {
  const config = RouteKit.getConfig();

  return routes.map((route, index) => {
    let element: React.ReactNode;
    const Component = route.component as any;

    // Handle Lazy Loading
    if (route.lazy || typeof Component === 'function' && Component.toString().includes('import')) {
      const LazyComponent = lazy(typeof Component === 'function' ? Component : () => Promise.resolve({ default: Component }));
      element = (
        <Suspense fallback={config.suspenseFallback}>
          <LazyComponent />
        </Suspense>
      );
    } else {
      element = <Component />;
    }

    // Wrap with Guards
    if (route.roles) {
      element = <RoleRoute roles={route.roles}>{element}</RoleRoute>;
    } else if (route.auth) {
      element = <AuthRoute>{element}</AuthRoute>;
    }

    // Layout
    if (route.layout) {
      const Layout = route.layout;
      element = <Layout>{element}</Layout>;
    }

    if (route.index) {
      return (
        <Route 
          key={index} 
          index={true}
          element={element}
        />
      );
    }

    return (
      <Route 
        key={route.path || index} 
        path={route.path} 
        element={element}
      >
        {route.children && renderRoutes(route.children)}
      </Route>
    );
  });
}
