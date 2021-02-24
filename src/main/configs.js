import { app } from "electron";
import os from "os";
import path from "path";

function getPlatform() {
  switch (os.platform()) {
    case "aix":
    case "freebsd":
    case "linux":
    case "openbsd":
    case "android":
      return "linux";
    case "darwin":
    case "sunos":
      return "mac";
    case "win32":
      return "win";
  }
}

export const platform = getPlatform();

export const isDevelopment =
  process.env.NODE_ENV !== "production" && !app.isPackaged;

  export const assetsPath = path.resolve(
    !isDevelopment
      ? path.join(process.resourcesPath, "assets")
      : path.join(".", "src", "main", "assets")
  );