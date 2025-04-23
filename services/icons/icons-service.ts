import { camera, reel, ticket, trophy } from "@Assets"; // Import your assets
import { useQuery } from "@tanstack/react-query";

// Now, use the imported assets in the iconUrls array
const iconUrls = [
  camera, // Replace URL with the local asset
  reel, // Replace URL with the local asset
  ticket,
  trophy, // Replace URL with the local asset
];

// Fetching the icons from the local assets
const fetchIcons = async () => {
  // Return the icons directly since they are imported locally, no need to fetch from a URL
  return iconUrls;
};

// Using react-query to fetch the icons (although it's no longer fetching from URLs)
export const useGetIcons = () => {
  return useQuery({
    queryKey: ["icons"],
    queryFn: fetchIcons,
    staleTime: 1000 * 60 * 60, // Consider stale after 1 hour
  });
};
