# @alisdev/fe-kit-axios

A robust, TypeScript-first HTTP client wrapper built on top of Axios. It provides unified error handling, streamlined request/response interception, and a clean API for interacting with backend services.

## Features

- 🛠️ **Unified Configuration**: Centralized setup for `baseURL`, `headers`, and `timeout`.
- 🛡️ **Built-in Interceptors**: Standardized request and response logging/transformation.
- 🚦 **Global Error Handling**: Centralized logic for authentication failures (401), forbidden access (403), and server errors (500).
- 🧬 **Type Safety**: Fully typed request parameters and response payloads.
- 🔄 **Token Management**: Built-in utilities to set and clear authorization headers dynamically.

## Installation

```bash
pnpm add @alisdev/fe-kit-axios
```

## Global Setup

Before making any requests, you should configure the global settings. This is typically done in your application's entry point (e.g., `src/main.tsx` or `src/App.tsx`).

```typescript
import { AxiosKit } from "@alisdev/fe-kit-axios";

AxiosKit.setup({
  baseURL: "https://api.yourdomain.com/v1",
  timeout: 15000,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
  // Global handler for 401 Unauthorized responses
  onUnauthorized: () => {
    console.warn("Session expired. Redirecting to login...");
    AxiosKit.clearToken();
    window.location.href = "/login";
  }
});

// If the user is already logged in (e.g., from local storage)
const savedToken = localStorage.getItem("token");
if (savedToken) {
  AxiosKit.setToken(savedToken);
}
```

## Creating an Instance

While you can use the default instance implicitly, it's recommended to create a dedicated instance for your services.

```typescript
import { AxiosKit } from "@alisdev/fe-kit-axios";

// Creates an instance using the global configuration
export const api = AxiosKit.createInstance();
```

## Usage Examples

### 1. Basic GET Request

```typescript
import { api } from "./api";

interface User {
  id: string;
  name: string;
  email: string;
}

export async function fetchUsers(): Promise<User[]> {
  // api.get<T>() automatically extracts the `data` property from the Axios response
  const response = await api.get<User[]>("/users");
  return response;
}
```

### 2. POST Request with Payload

```typescript
interface CreateUserDto {
  name: string;
  email: string;
}

export async function createUser(data: CreateUserDto): Promise<User> {
  const response = await api.post<User>("/users", data);
  return response;
}
```

### 3. Request with Query Parameters

```typescript
export async function searchUsers(query: string, status: string): Promise<User[]> {
  const response = await api.get<User[]>("/users/search", {
    params: {
      q: query,
      status: status
    }
  });
  return response;
}
```

### 4. Overriding Config for a Single Request

```typescript
export async function uploadAvatar(userId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(`/users/${userId}/avatar`, formData, {
    // Override default headers for this specific request
    headers: {
      "Content-Type": "multipart/form-data"
    },
    timeout: 30000 // Longer timeout for uploads
  });
  return response;
}
```

## Authentication Token Management

The kit provides dedicated methods to handle the `Authorization` header without needing to manually modify interceptors.

```typescript
import { AxiosKit } from "@alisdev/fe-kit-axios";

// After successful login:
// This sets `Authorization: Bearer <token>` on all future requests
AxiosKit.setToken("eyJhbGciOiJIUzI1NiIsIn...");

// After logout:
// This removes the `Authorization` header
AxiosKit.clearToken();
```

## API Reference

### `AxiosKitConfig`

The configuration object passed to `AxiosKit.setup(config)`:

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `baseURL` | `string` | `""` | The base URL for all requests. |
| `timeout` | `number` | `10000` | Request timeout in milliseconds. |
| `headers` | `Record<string, string>` | `{}` | Default headers applied to all requests. |
| `onUnauthorized` | `() => void` | `undefined` | Callback triggered globally when a 401 response is received. |

### Error Handling

The kit automatically formats errors into a consistent structure. It throws an `Error` object where you can inspect the response.

```typescript
try {
  await api.get("/protected-route");
} catch (error: any) {
  console.error("Status:", error.response?.status);
  console.error("Message:", error.response?.data?.message || error.message);
}
```
