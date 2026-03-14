import { useSearchTours, useGetDepartureCities } from "@workspace/api-client-react";

// Re-exporting the generated hooks directly to abstract the workspace import
// and make it cleaner to use throughout our application components.
export { useSearchTours, useGetDepartureCities };
