# TipTap Simple Editor

A reusable TipTap-powered editor template packaged with tsup. React is kept as a peer dependency and the bundle ships ESM, CJS, and type definitions for easy consumption.

## Install

```bash
npm install tip-tap-source
# or: pnpm add tip-tap-source
```

Import the styles once in your app entry:

```ts
import "tip-tap-source/style.css"
```

## Quick start

```tsx
import { SimpleEditor } from "tip-tap-source"
import "tip-tap-source/style.css"

export default function Example() {
  return (
    <SimpleEditor
      initialContent="<p>Hello world</p>"
      onUpdate={({ editor }) => {
        console.log(editor.getJSON())
      }}
      onImageUpload={async (file) => {
        // Replace with your upload target
        return URL.createObjectURL(file)
      }}
    />
  )
}
```

## Props

- `initialContent` – optional TipTap `Content`; defaults to the bundled demo JSON
- `onUpdate` – callback fired on editor updates with the active editor instance
- `onImageUpload` – custom uploader; defaults to a safe in-browser data URL implementation
- `className` – optional class passed to the root wrapper

## Commands

- `npm run dev` – playground with Vite
- `npm run build` – build the library with tsup
- `npm run build:demo` – build the Vite demo shell
- `npm run typecheck` – type-check the source
- `npm run lint` – run ESLint
