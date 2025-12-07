import urlJoin from "url-join";

import pkg from "../../package.json";

export const OFFICIAL_URL = "https://thor-chat.token-ai.cn/";
export const OFFICIAL_SITE = "https://token-ai.cn/";

export const GITHUB = pkg.homepage;
export const GITHUB_ISSUES = urlJoin(GITHUB, "issues/new/choose");
export const CHANGELOG = urlJoin(GITHUB, "blob/main/CHANGELOG.md");

export const DOCUMENTS = urlJoin("/docs");
export const USAGE_DOCUMENTS = urlJoin(DOCUMENTS, "/usage");
export const SELF_HOSTING_DOCUMENTS = urlJoin(DOCUMENTS, "/self-hosting");

export const WIKI = urlJoin(GITHUB, "wiki");
export const WIKI_PLUGIN_GUIDE = urlJoin(USAGE_DOCUMENTS, "/plugins/development");
export const MANUAL_UPGRADE_URL = urlJoin(SELF_HOSTING_DOCUMENTS, "/advanced/upstream-sync");

export const BLOG = urlJoin(OFFICIAL_SITE, "blog");

export const ABOUT = OFFICIAL_SITE;

export const EMAIL_SUPPORT = "239573049@qq.com";
export const EMAIL_BUSINESS = "239573049@qq.com";

export const MEDIDUM = "https://medium.com/@tokenhub";
export const X = "https://x.com/AIDotNet";
export const RELEASES_URL = urlJoin(GITHUB, "releases");

export const mailTo = (email: string) => `mailto:${email}`;
