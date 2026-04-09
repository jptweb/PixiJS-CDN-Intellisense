const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

const SUPPRESS_KEY = "pixijsCdn.dontAskAgain";

function enableInFolder(folderUri, extensionPath) {
  // Resolve target root: if a folder URI was passed (right-click), use it;
  // otherwise fall back to the first workspace folder.
  let root;
  if (folderUri && folderUri.fsPath) {
    root = folderUri.fsPath;
  } else {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
      vscode.window.showErrorMessage("Open a folder first, then run this command.");
      return false;
    }
    root = folders[0].uri.fsPath;
  }

  const assets = path.join(extensionPath, "assets");

  // 1. Drop pixi.js.d.ts into <root>/.pixi-types/
  const typesDir = path.join(root, ".pixi-types");
  if (!fs.existsSync(typesDir)) fs.mkdirSync(typesDir, { recursive: true });
  fs.copyFileSync(
    path.join(assets, "pixi.js.d.ts"),
    path.join(typesDir, "pixi.js.d.ts")
  );

  // 2. Drop jsconfig.json at root unless one (or tsconfig.json) already exists
  const jsconfig = path.join(root, "jsconfig.json");
  const tsconfig = path.join(root, "tsconfig.json");
  let configCreated = false;
  if (!fs.existsSync(jsconfig) && !fs.existsSync(tsconfig)) {
    fs.copyFileSync(path.join(assets, "jsconfig.json"), jsconfig);
    configCreated = true;
  }

  const msg = configCreated
    ? "PixiJS intellisense enabled. Type PIXI. in a .js file to test."
    : "PixiJS types added to .pixi-types/. Existing js/tsconfig was left untouched — make sure it includes .pixi-types/**/*.d.ts.";
  vscode.window.showInformationMessage(msg);
  return true;
}

async function detectAndPrompt(context) {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) return;
  const root = folders[0].uri.fsPath;

  // Already set up? Skip.
  if (
    fs.existsSync(path.join(root, "jsconfig.json")) ||
    fs.existsSync(path.join(root, "tsconfig.json")) ||
    fs.existsSync(path.join(root, ".pixi-types"))
  ) {
    return;
  }

  // User said "don't ask again" for this workspace.
  if (context.workspaceState.get(SUPPRESS_KEY)) return;

  // Look for an HTML file that references the PixiJS CDN.
  const htmlFiles = await vscode.workspace.findFiles("**/*.html", "**/node_modules/**", 20);
  let found = false;
  for (const file of htmlFiles) {
    try {
      const text = fs.readFileSync(file.fsPath, "utf8");
      if (/pixijs\.download|pixi\.min\.js|pixi\.js.*cdn|cdn.*pixi/i.test(text)) {
        found = true;
        break;
      }
    } catch (_) {}
  }
  if (!found) return;

  const pick = await vscode.window.showInformationMessage(
    "PixiJS detected in this folder. Enable intellisense?",
    "Yes",
    "No",
    "Don't ask again"
  );
  if (pick === "Yes") {
    enableInFolder(folders[0].uri, context.extensionPath);
  } else if (pick === "Don't ask again") {
    context.workspaceState.update(SUPPRESS_KEY, true);
  }
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("pixijsCdn.enable", (uri) => {
      enableInFolder(uri, context.extensionPath);
    })
  );

  // Auto-detect on startup (and when folders change).
  detectAndPrompt(context);
  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => detectAndPrompt(context))
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
