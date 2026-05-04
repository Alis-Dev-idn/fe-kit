import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouteKit } from "../core/RouteKit";

export const AuthRoute: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const config = RouteKit.getConfig();

  useEffect(() => {
    const check = async () => {
      try {
        let auth = false;
        if (config.authStore && config.authSelector) {
          auth = config.authSelector(config.authStore());
        } else if (config.authCheck) {
          auth = await config.authCheck();
        } else {
          auth = true; // No auth check defined
        }

        setIsAuthorized(auth);
        if (!auth) navigate(config.loginPath);
      } catch {
        setIsAuthorized(false);
        navigate(config.loginPath);
      }
    };
    check();
  }, [config, navigate]);

  if (isAuthorized === null) return <>{fallback}</>;
  return isAuthorized ? <>{children}</> : null;
};

export const RoleRoute: React.FC<{ children: React.ReactNode; roles: string[] }> = ({ 
  children, 
  roles 
}) => {
  const [hasRole, setHasRole] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const config = RouteKit.getConfig();

  useEffect(() => {
    const check = async () => {
      try {
        let userRoles: string[] = [];
        if (config.roleStore && config.roleSelector) {
          userRoles = config.roleSelector(config.roleStore());
        } else if (config.getRoles) {
          userRoles = await config.getRoles();
        }

        const allowed = roles.some(r => userRoles.includes(r));
        setHasRole(allowed);
        if (!allowed) navigate(config.unauthorizedPath);
      } catch {
        setHasRole(false);
        navigate(config.unauthorizedPath);
      }
    };
    check();
  }, [config, navigate, roles]);

  if (hasRole === null) return null;
  return hasRole ? <>{children}</> : null;
};
