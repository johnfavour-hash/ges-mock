// axios.config.ts
import { toaster } from "@components/ui/toaster"
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"
import ENV from "@configs/env.config"
import useAuthStore from "@stores/auth.store"


export const axiosClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// List of public endpoints that don't require auth token
const PUBLIC_ENDPOINTS = [
  "/v1/auth/login",
  // Add any other public endpoints here
];

// Helper to check if endpoint is public
const isPublicEndpoint = (url: string = ''): boolean => {
  return PUBLIC_ENDPOINTS.some(endpoint =>
    url.endsWith(endpoint)
  );
};

// Helper functions
const getErrorMessage = (error: any): string => {
  if (error.response?.data) {
    const { message, errors } = error.response.data;

    if (errors && Array.isArray(errors) && errors.length > 0) {
      return errors.map(err => `${err.field}: ${err.message}`).join(', ');
    }

    return message || "Invalid request sent to the server.";
  }

  return error.message || "Invalid request sent to the server.";
};

const getErrorTitle = (error: AxiosError): string => {
  if (!error.response) return "Network Error";

  const status = error.response.status;
  const statusText = error.response.statusText;

  switch (status) {
    case 400: return "Bad Request";
    case 401: return "Unauthorized";
    case 402: return "Payment Required";
    case 403: return "Forbidden";
    case 404: return "Not Found";
    case 405: return "Method Not Allowed";
    case 406: return "Not Acceptable";
    case 408: return "Request Timeout";
    case 409: return "Conflict";
    case 410: return "Gone";
    case 411: return "Length Required";
    case 412: return "Precondition Failed";
    case 413: return "Payload Too Large";
    case 414: return "URI Too Long";
    case 415: return "Unsupported Media Type";
    case 416: return "Range Not Satisfiable";
    case 417: return "Expectation Failed";
    case 418: return "I'm a teapot";
    case 422: return "Validation Error";
    case 429: return "Too Many Requests";
    case 500: return "Internal Server Error";
    case 501: return "Not Implemented";
    case 502: return "Bad Gateway";
    case 503: return "Service Unavailable";
    case 504: return "Gateway Timeout";
    case 505: return "HTTP Version Not Supported";
    case 506: return "Variant Also Negotiates";
    case 507: return "Insufficient Storage";
    case 508: return "Loop Detected";
    case 509: return "Bandwidth Limit Exceeded";
    case 510: return "Not Extended";
    case 511: return "Network Authentication Required";
    default: return `${status} - ${statusText}`;
  }
};

// Token refresh queue management


// Request interceptor to add auth token - FIXED
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ✅ Skip auth header for public endpoints
    const isPublic = isPublicEndpoint(config.url);

    if (!isPublic) {
      // ✅ Get fresh tokens from store for each request
      // NEW:
      const authToken = useAuthStore.getState().token;
      if (authToken && config.headers) {
        config.headers.Authorization = `Bearer ${authToken}`
      }
    }

    return config
  },
  (error: AxiosError) => {
    toaster.error({
      title: getErrorTitle(error),
      description: getErrorMessage(error),
      closable: true
    });
    return Promise.reject(error)
  },
)

// Response interceptor - FIXED
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && originalRequest.url === "/auth/login") {
      toaster.error({
        title: getErrorTitle(error),
        description: getErrorMessage(error),
        closable: true
      });
    }

    // 🟠 Unauthorized (Token expired) - Skip for public endpoints
    if (error.response?.status === 401 && !originalRequest._retry && !isPublicEndpoint(originalRequest.url)) {
      console.warn("🟠 Unauthorized (Token expired):", error.config?.url);

      toaster.error({
        title: getErrorTitle(error),
        description: getErrorMessage(error),
        closable: true
      });

    }

    // 🟡 Bad Request (400)
    if (error.response?.status === 400) {
      console.warn("⚠️ Bad Request:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: getErrorMessage(error),
        closable: true
      });
    }

    // 🔵 Payment Required (402)
    if (error.response?.status === 402) {
      console.warn("💰 Payment Required:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "Payment required to access this resource.",
        closable: true
      });
    }

    // 🟣 Forbidden (403)
    if (error.response?.status === 403) {
      console.warn("🚫 Access forbidden:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "You don't have permission to access this resource.",
        closable: true
      });
    }

    // 🔵 Not Found (404)
    if (error.response?.status === 404) {
      console.warn("⚠️ Resource not found:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: getErrorMessage(error),
        closable: true
      });
    }

    // 🟠 Method Not Allowed (405)
    if (error.response?.status === 405) {
      console.warn("🚫 Method not allowed:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "This HTTP method is not allowed for the requested resource.",
        closable: true
      });
    }

    // 🔵 Not Acceptable (406)
    if (error.response?.status === 406) {
      console.warn("❌ Not acceptable:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "The server cannot produce a response matching the accept headers.",
        closable: true
      });
    }

    // 🟡 Request Timeout (408)
    if (error.response?.status === 408) {
      console.warn("⏰ Request timeout:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "The request timed out. Please try again.",
        closable: true
      });
    }

    // 🔴 Conflict (409)
    if (error.response?.status === 409) {
      console.warn("⚡ Conflict:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: getErrorMessage(error) || "A conflict occurred with the current state of the resource.",
        closable: true
      });
    }

    // 🔵 Gone (410)
    if (error.response?.status === 410) {
      console.warn("🗑️ Resource gone:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "The requested resource is no longer available.",
        closable: true
      });
    }

    // 🟡 Length Required (411)
    if (error.response?.status === 411) {
      console.warn("📏 Length required:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "Content-Length header is required for this request.",
        closable: true
      });
    }

    // 🟡 Precondition Failed (412)
    if (error.response?.status === 412) {
      console.warn("🔒 Precondition failed:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "Precondition given in the request failed.",
        closable: true
      });
    }

    // 🟡 Payload Too Large (413)
    if (error.response?.status === 413) {
      console.warn("📦 Payload too large:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "The request payload is too large.",
        closable: true
      });
    }

    // 🟡 URI Too Long (414)
    if (error.response?.status === 414) {
      console.warn("🔗 URI too long:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "The request URI is too long.",
        closable: true
      });
    }

    // 🟡 Unsupported Media Type (415)
    if (error.response?.status === 415) {
      console.warn("🎭 Unsupported media type:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "The media type is not supported by the server.",
        closable: true
      });
    }

    // 🟡 Range Not Satisfiable (416)
    if (error.response?.status === 416) {
      console.warn("🎯 Range not satisfiable:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "The requested range cannot be satisfied.",
        closable: true
      });
    }

    // 🟡 Expectation Failed (417)
    if (error.response?.status === 417) {
      console.warn("🎭 Expectation failed:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "The server cannot meet the requirements of the Expect request-header field.",
        closable: true
      });
    }

    // 🟠 I'm a teapot (418) - Easter egg
    if (error.response?.status === 418) {
      console.warn("🫖 I'm a teapot:", error.config?.url);
      toaster.error({
        title: "I'm a teapot",
        description: "The server refuses to brew coffee because it is, permanently, a teapot.",
        closable: true
      });
    }

    // 🟡 Too Many Requests (429)
    // if (error.response?.status === 429) {
    //   console.warn("🚦 Too many requests:", error.config?.url);
    //   toaster.error({
    //     title: getErrorTitle(error),
    //     description: "Too many requests. Please slow down and try again later.",
    //     closable: true
    //   });
    // }

    // 🟠 Validation Error (422)
    if (error.response?.status === 422) {
      console.warn("📝 Validation error:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: getErrorMessage(error),
        closable: true
      });
    }

    // 🔴 Internal Server Error (500)
    if (error.response?.status === 500) {
      console.error("🚨 Internal server error:", error.config?.url, error.response);
      toaster.error({
        title: getErrorTitle(error),
        description: "Something went wrong on our server. Please try again later.",
        closable: true
      });
    }

    // 🔴 Not Implemented (501)
    if (error.response?.status === 501) {
      console.error("🔧 Not implemented:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "This feature is not implemented on the server.",
        closable: true
      });
    }

    // 🔴 Bad Gateway (502)
    if (error.response?.status === 502) {
      console.error("🌐 Bad gateway:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "The server received an invalid response from the upstream server.",
        closable: true
      });
    }

    // 🔴 Service Unavailable (503)
    if (error.response?.status === 503) {
      console.error("🔧 Service unavailable:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "The service is temporarily unavailable. Please try again later.",
        closable: true
      });
    }

    // 🔴 Gateway Timeout (504)
    if (error.response?.status === 504) {
      console.error("⏰ Gateway timeout:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "The gateway timed out. Please try again.",
        closable: true
      });
    }

    // 🔴 HTTP Version Not Supported (505)
    if (error.response?.status === 505) {
      console.error("🔌 HTTP version not supported:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "The HTTP version used in the request is not supported.",
        closable: true
      });
    }

    // 🔴 Variant Also Negotiates (506)
    if (error.response?.status === 506) {
      console.error("🔄 Variant also negotiates:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "The server has an internal configuration error.",
        closable: true
      });
    }

    // 🔴 Insufficient Storage (507)
    if (error.response?.status === 507) {
      console.error("💾 Insufficient storage:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "The server is out of storage space.",
        closable: true
      });
    }

    // 🔴 Loop Detected (508)
    if (error.response?.status === 508) {
      console.error("🔄 Loop detected:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "The server detected an infinite loop while processing the request.",
        closable: true
      });
    }

    // 🔴 Bandwidth Limit Exceeded (509)
    if (error.response?.status === 509) {
      console.error("📊 Bandwidth limit exceeded:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "The server's bandwidth limit has been exceeded.",
        closable: true
      });
    }

    // 🔴 Not Extended (510)
    if (error.response?.status === 510) {
      console.error("🔌 Not extended:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "Further extensions to the request are required.",
        closable: true
      });
    }

    // 🔴 Network Authentication Required (511)
    if (error.response?.status === 511) {
      console.error("🔐 Network authentication required:", error.config?.url);
      toaster.error({
        title: getErrorTitle(error),
        description: "Network authentication is required to access this resource.",
        closable: true
      });
    }

    // 🔴 Server Errors (5xx) - Catch all
    if (error.response?.status && error.response.status >= 500 && error.response.status < 600) {
      console.error("🚨 Server error:", error.config?.url, error.response);
      toaster.error({
        title: getErrorTitle(error),
        description: "Something went wrong on our server. Please try again later.",
        closable: true
      });
    }

    // ⚫ Network or unknown errors
    if (!error.response) {
      console.error("🌐 Network error or no response from server:", error.message);
      toaster.error({
        title: "Network Error",
        description: "Please check your internet connection and try again.",
        closable: true
      });
    }

    return Promise.reject(error);
  }
);



export default axiosClient;
