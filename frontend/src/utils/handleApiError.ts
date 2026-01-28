import { AxiosError } from "axios";
import i18n from "../i18n";

interface ApiErrorResponse {
  message?: string;
  [key: string]: unknown; // to capture other potential fields
}

export function handleApiError(err: unknown) {
  console.error("❌ [handleApiError] Full error object:", err);

  const error = err as AxiosError<ApiErrorResponse>;

  let alertMessage = "";

  if (error.response) {
    // Error getted from backend
    console.error("❌ Backend error details:", {
      status: error.response.status,
      statusText: error.response.statusText,
      headers: error.response.headers,
      data: error.response.data,
    });

    const data = error.response.data;
    alertMessage = i18n.t("err.backend", { message: data?.message ?? "Erreur serveur" });
  } else if (error.request) {
    // Request sent but no response received
    console.error("❌ No response received:", error.request);
    alertMessage = i18n.t("err.noResponse");
  } else if (error.message) {
    // Error configuring the request
    console.error("❌ Error setting up request:", error.message);
    alertMessage = i18n.t("err.frontend", { message: error.message });
  } else {
    // Unknown state
    console.error("❌ Unknown error type:", err);
    alertMessage = i18n.t("err.unknown", { message: String(err) });
  }

  // Global display in the UI
  alert(`🚨 ${i18n.t("err.api")}\n${alertMessage}`);
}