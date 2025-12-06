import { User } from "./user";

export interface Package {
  key: number;
  id: string;
  version: string;
  authors: string[];
  description: string;
  downloads: number;
  hasReadme: boolean;
  hasEmbeddedIcon: boolean;
  isPrerelease: boolean;
  releaseNotes: string;
  language: string;
  listed: boolean;
  minClientVersion: string;
  published: string;
  requireLicenseAcceptance: boolean;
  semVerLevel: SemVerLevel;
  summary: string;
  title: string;
  iconUrl: string;
  licenseUrl: string;
  projectUrl: string;
  repositoryUrl: string;
  repositoryType: string;
  tags: string[];
  rowVersion: string;
  dependencies: PackageDependency[];
  packageTypes: PackageType[];
  targetFrameworks: TargetFramework[];
  normalizedVersionString: string;
  originalVersionString: string;
  iconUrlString: string;
  licenseUrlString: string;
  projectUrlString: string;
  repositoryUrlString: string;
}

export enum SemVerLevel {
  Unknown = 0,
  SemVer2 = 2,
}

export interface PackageDependency {
  key: number;
  id: string;
  versionRange: string;
  targetFramework: string;
  package: Package;
}

export interface PackageType {
  key: number;
  name: string;
  version: string;
  package: Package;
}

export interface TargetFramework {
  key: number;
  moniker: string;
  package: Package;
}

export interface PackageDependent {
  id: string;
  description: string;
  totalDownloads: number;
}

export interface DependencyGroupModel {
  name: string;
  dependencies: DependencyModel[];
}

export interface DependencyModel {
  packageId: string;
  versionSpec: string;
}

export interface PackageDetailsState {
  iconUrl?: string;
  licenseUrl?: string;
  packageDownloadUrl?: string;
  found: boolean;
  package: Package;
  isDotnetTemplate: boolean;
  isDotnetTool: boolean;
  lastUpdated: string;
  totalDownloads: number;
  usedBy: PackageDependent[];
  dependencyGroups: DependencyGroupModel[];
  readme: string;
  versions: any[];
}

export interface PackageUpdateRecordResponse {
  id: number;
  packageId: string;
  version: string;
  operationType: string;
  operationDescription: string;
  operationIP: string;
  userId: string;
  user: User;
  operationTime: string;
}
