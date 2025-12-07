import { UAParser } from "ua-parser-js";

/**
 * check mobile device in server
 */
export const isMobileDevice = () => {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const device = new UAParser(ua).getDevice();

  return device.type === "mobile";
};

/**
 * check mobile device in server
 */
export const gerServerDeviceInfo = () => {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const parser = new UAParser(ua);

  return {
    browser: parser.getBrowser().name,
    isMobile: isMobileDevice(),
    os: parser.getOS().name,
  };
};
