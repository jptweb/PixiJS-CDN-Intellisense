# PixiJS Intellisense — Student Setup

This gives VS Code autocomplete and hover docs for PixiJS (`PIXI.Application`, `PIXI.Sprite`, etc.) in our class projects, even though we're loading PixiJS from the CDN with a `<script>` tag and not using npm.

## 1. Download the extension

Grab **`pixijs-cdn-intellisense-0.0.1.vsix`** from myCourses and save it somewhere you can find it (Downloads is fine).

## 2. Install it in VS Code

Pick whichever is easier:

**Option A — GUI**
1. Open VS Code.
2. Click the **Extensions** icon in the left sidebar (or `Cmd+Shift+X` / `Ctrl+Shift+X`).
3. Click the **`…`** menu in the top-right of the Extensions panel.
4. Choose **Install from VSIX…**
5. Pick the `.vsix` file you downloaded.

**Option B — Terminal**
```sh
code --install-extension pixijs-cdn-intellisense-0.0.1.vsix
```

You only have to do this once. It applies to every folder you open in VS Code from now on.

## 3. Turn it on for a project

Open your project folder in VS Code. You'll get one of these:

- **A popup in the bottom-right** asking if you want to enable PixiJS intellisense → click **Yes**.
- **No popup?** Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and run **PixiJS: Enable Intellisense in this Folder**.
- **Or** right-click your project folder in the Explorer sidebar → **PixiJS: Enable Intellisense in this Folder**.

You'll see two new things appear in your folder: a `.pixi-types/` folder and a `jsconfig.json` file. Leave them alone — that's what makes the autocomplete work.

## 4. Check that it works

Open (or create) a `.js` file in your project and type:

```js
PIXI.
```

You should see a dropdown with `Application`, `Sprite`, `Assets`, `Graphics`, etc. Hover over any of them and you'll get docs.

## ⚠️ Important: put your PixiJS code in a `.js` file, not inside `<script>` tags in HTML

VS Code uses two different engines for JavaScript, and the one for code embedded inside `.html` files **does not support this extension**. You'll get no autocomplete and sometimes wrong suggestions (like `square.fill` showing up as an array method).

**Do this:**
```html
<script src="https://pixijs.download/release/pixi.min.js"></script>
<script type="module" src="./app.js"></script>
```
…and put all your PixiJS code in `app.js`. Everything will work correctly there.

## Troubleshooting

- **No autocomplete in my `.js` file** — Make sure you ran the "Enable Intellisense" command for *this* folder. Check that `.pixi-types/` and `jsconfig.json` exist at the root.
- **Autocomplete in HTML doesn't work** — Expected. See the warning above. Move your code to a `.js` file.
- **I already had a `jsconfig.json`** — The extension won't overwrite it. Either delete yours and re-run the command, or add `".pixi-types/**/*.d.ts"` to your existing `include` array.
