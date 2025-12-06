import { get } from "@/utils/fetch";

export const Search = (
  q?: string | null,
  skip: number = 0,
  take: number = 20,
  prerelease?: boolean | null,
  semVerLevel?: string | null,
  packageType?: string | null,
  framework?: string | null,
) => {
  const query = new URLSearchParams();
  if (q) query.append("q", q);
  if (skip) query.append("skip", skip.toString());
  if (take) query.append("take", take.toString());
  if (prerelease) query.append("prerelease", prerelease.toString());
  if (semVerLevel) query.append("semVerLevel", semVerLevel);
  if (packageType) query.append("packageType", packageType);
  if (framework) query.append("framework", framework);
  return get(`/v3/search?${query.toString()}`);
};

export const Autocomplete = (
  q?: string,
  id?: string,
  skip: number = 0,
  take: number = 20,
  prerelease?: boolean,
  semVerLevel?: string,
  packageType?: string,
) => {
  const query = new URLSearchParams();
  if (q) query.append("q", q);
  if (id) query.append("id", id);
  if (skip) query.append("skip", skip.toString());
  if (take) query.append("take", take.toString());
  if (prerelease) query.append("prerelease", prerelease.toString());
  if (semVerLevel) query.append("semVerLevel", semVerLevel);
  if (packageType) query.append("packageType", packageType);
  return get(`/v3/autocomplete?${query.toString()}`);
};

export const Dependents = (packageId?: string) => {
  const query = new URLSearchParams();
  if (packageId) query.append("packageId", packageId);
  return get(`/v3/dependents?${query.toString()}`);
};
