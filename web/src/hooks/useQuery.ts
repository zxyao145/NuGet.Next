import { useSearchParams } from "react-router-dom";
export const useQuery = () => {
  const [searchParams] = useSearchParams();
  return {
    q: decodeURIComponent(searchParams.get("q") ?? ""),
    packageType: searchParams.get("packageType"),
    framework: searchParams.get("framework"),
    prerelease:
      searchParams.get("prerelease") === "true"
        ? true
        : searchParams.get("prerelease") === "false"
          ? false
          : undefined,
  };
};
