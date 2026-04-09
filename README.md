# PixiJS CDN Intellisense

VS Code extension that gives plain-JS projects full PixiJS v8 intellisense — no `npm`, no bundler, no build step. Designed for students using the CDN `<script>` tag.

Bundled with **pixi.js v8.17.1** type definitions.

## Install

```sh
code --install-extension pixijs-cdn-intellisense-0.0.1.vsix
```

Or in VS Code: Extensions panel → `…` menu → **Install from VSIX…**

## Use

1. Open your project folder in VS Code.
2. Command Palette (`Cmd/Ctrl+Shift+P`) → **PixiJS: Enable Intellisense in this Folder**.
3. Done. Type `PIXI.` in any `.js` file and you'll see autocomplete for `Application`, `Sprite`, `Assets`, etc.

The command creates:
- `.pixi-types/pixi.js.d.ts` — the bundled PixiJS type definitions
- `jsconfig.json` — tells VS Code to use them (skipped if you already have one)

## Build the .vsix yourself

```sh
npm install -g @vscode/vsce
vsce package
```

## Refresh to a newer PixiJS version

```sh
curl -sL https://registry.npmjs.org/pixi.js/-/pixi.js-8.X.Y.tgz | tar xz -C /tmp
cp /tmp/package/dist/pixi.js.d.ts assets/pixi.js.d.ts
# bump version in package.json, then: vsce package
```

## How it works

PixiJS's bundled `pixi.js.d.ts` already includes `export as namespace PIXI;`, so once it's in a TypeScript-aware folder (a workspace with `jsconfig.json`), VS Code's language server exposes the entire PIXI API as a global namespace. The extension just drops those two files in for you.
