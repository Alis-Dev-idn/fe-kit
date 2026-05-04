# Prompt: `modal-kit` — Modal/Dialog Library (React + TypeScript)

## Overview

Build the `modal` package inside `@alisdev/fe-kit` monorepo. Provides a component-based modal system with sub-components (`Modal.Header`, `Modal.Body`, `Modal.Footer`), built-in download and preview modals, MacOS/Windows/custom close button styles, responsive behavior, layer stacking, and animations.

---

## Package Structure

```
packages/modal/
├── src/
│   ├── components/
│   │   ├── Modal.tsx              # Main modal component
│   │   ├── Modal.Header.tsx       # Header sub-component
│   │   ├── Modal.Body.tsx         # Body sub-component
│   │   ├── Modal.Footer.tsx       # Footer sub-component
│   │   ├── Modal.Download.tsx     # Built-in download content
│   │   ├── Modal.Preview.tsx      # Built-in preview content
│   │   └── CloseButton/
│   │       ├── MacOSClose.tsx     # 🔴🟡🟢 style
│   │       ├── WindowsClose.tsx   # × top-right style
│   │       └── ButtonClose.tsx    # Custom button style
│   ├── core/
│   │   ├── ModalKit.ts            # Setup & configuration
│   │   └── ModalStack.ts          # Layer stack manager
│   ├── hooks/
│   │   └── useModal.ts            # Optional hook helper
│   ├── types/
│   │   └── index.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

---

## Dependencies

```json
{
  "peerDependencies": {
    "react": "^18.x",
    "react-dom": "^18.x"
  }
}
```

---

## 1. Types

```typescript
type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "full" | { width: string; height?: string }
type ModalPosition = "center" | "top" | "bottom" | "left" | "right"
type CloseButtonStyle = "macos" | "windows" | "button"
type ScrollBehavior = "body" | "outside"
type AnimationType = "fade" | "slide" | "zoom" | "bounce"

interface AnimationConfig {
  in?: AnimationType      // default: "fade"
  out?: AnimationType     // default: "fade"
  duration?: number       // ms, default: 200
}

// Size presets in px
const SIZE_PRESETS = {
  xs:   "320px",
  sm:   "480px",
  md:   "600px",
  lg:   "800px",
  xl:   "1024px",
  full: "100vw"
}

// Responsive breakpoint
const MOBILE_BREAKPOINT = 768  // px

// Download progress — matches axios-kit DownloadProgress shape
interface DownloadProgress {
  percent: number
  loaded: number
  total: number
  speed: number
  estimatedTime: number
}
```

---

## 2. `ModalKit` — Setup

```typescript
interface ModalKitConfig {
  animation?: AnimationConfig
  closeButtonStyle?: CloseButtonStyle   // default: "windows"
  backdrop?: {
    enabled?: boolean                   // default: true
    baseOpacity?: number                // default: 0.5
    opacityIncrement?: number           // per layer, default: 0.1
    // e.g. layer 1 → 0.5, layer 2 → 0.6, layer 3 → 0.7
  }
}

class ModalKit {
  static setup(config: ModalKitConfig): void
  static getConfig(): Required<ModalKitConfig>
}
```

---

## 3. `Modal` Component

Main component. All props are optional except `isOpen` and `onClose`.

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onOpen?: () => void                        // called when modal finishes opening
  size?: ModalSize                           // default: "md"
  position?: ModalPosition                   // default: "center"
  closeOnBackdrop?: boolean                  // default: true
  closeOnEscape?: boolean                    // default: true
  preventClose?: boolean                     // disables all close triggers, default: false
  closeButtonStyle?: CloseButtonStyle        // override global setting
  closeButton?: React.ReactNode              // fully custom close button
  scrollBehavior?: ScrollBehavior            // default: "body"
  animation?: AnimationConfig                // override global animation
  children: React.ReactNode
}
```

**Compound component pattern:**
```typescript
const Modal: React.FC<ModalProps> & {
  Header: typeof ModalHeader
  Body: typeof ModalBody
  Footer: typeof ModalFooter
  Download: typeof ModalDownload
  Preview: typeof ModalPreview
}
```

---

## 4. Sub-Components

### `Modal.Header`

```typescript
interface ModalHeaderProps {
  children: React.ReactNode
  showCloseButton?: boolean    // default: true
}
```

- Renders title + close button
- Close button position and style driven by `closeButtonStyle` prop from parent `Modal`
- MacOS style → buttons on left side of header
- Windows style → × on right side of header
- `button` style → renders `closeButton` prop or default styled button

### `Modal.Body`

```typescript
interface ModalBodyProps {
  children: React.ReactNode
  padding?: string | number    // default: "1.5rem"
}
```

- If `scrollBehavior: "body"` → this component has `overflow-y: auto`
- If `scrollBehavior: "outside"` → no overflow, parent modal scrolls

### `Modal.Footer`

```typescript
interface ModalFooterProps {
  children: React.ReactNode
  align?: "left" | "center" | "right"   // default: "right"
  divider?: boolean                      // show top border, default: true
}
```

---

## 5. Close Button Styles

### MacOS Style (`closeButtonStyle: "macos"`)

```
┌─────────────────────────────────────┐
│ 🔴 🟡 🟢  Modal Title               │
├─────────────────────────────────────┤
```

- Three circles: red (close), yellow (minimize), green (maximize)
- Only red (close) is functional — clicking it calls `onClose()`
- Yellow and green are decorative (dimmed/disabled appearance)
- On hover → show × symbol inside red circle
- Position: left side of header

### Windows Style (`closeButtonStyle: "windows"`) — default

```
┌─────────────────────────────────────┐
│  Modal Title                      × │
├─────────────────────────────────────┤
```

- Single × button on right side of header
- On hover → background highlight

### Button Style (`closeButtonStyle: "button"`)

```typescript
// Default button — can be fully overridden
<Modal closeButtonStyle="button" closeButton={<MyCloseButton />}>

// If closeButton prop not provided → renders a default styled "Close" text button
```

---

## 6. Responsive Behavior (Automatic)

No configuration needed — automatically detected via `window.innerWidth`.

```
Desktop (> 768px):
  → Modal renders at defined size and position
  → All positions available: center, top, bottom, left, right

Mobile (≤ 768px):
  position: "bottom" → renders as bottom sheet
    - slides up from bottom
    - width: 100vw
    - height: auto (max 90vh)
    - rounded top corners
    - drag handle indicator at top (decorative)

  position: "top" → renders as top sheet
    - slides down from top

  position: "left" | "right" → renders as side drawer
    - full height, partial width (default: 85vw)

  position: "center" | undefined → renders as centered modal
    - width: 92vw
    - max-height: 85vh

  size: "full" → always full screen on mobile
```

**Requirements:**
- Responsive detection uses `window.matchMedia("(max-width: 768px)")`
- Re-evaluates on window resize
- No layout shift — animation adapts to mobile position automatically

---

## 7. Layer Stacking

Multiple modals can be open simultaneously, stacking on top of each other.

```typescript
// Modal 1 opens
// Modal 2 opens while Modal 1 is still open → appears on top
// Closing Modal 2 → Modal 1 is still visible and interactive

// Backdrop darkens per layer:
// Layer 1 → backdrop opacity: 0.5
// Layer 2 → backdrop opacity: 0.6
// Layer 3 → backdrop opacity: 0.7
```

**Requirements:**
- Each modal manages its own `z-index` (base: 1000, increment: 10 per layer)
- `ModalStack` tracks open modals in order
- Escape key closes only the topmost modal
- Focus trap applies only to topmost modal

---

## 8. `Modal.Download` — Built-in Download Content

Integrates with `axios-kit` download progress if available, otherwise plain anchor download.

```typescript
interface ModalDownloadProps {
  filename: string
  url: string
  label?: string                                       // button label, default: "Download"
  onProgress?: (progress: DownloadProgress) => void   // optional progress callback
  onComplete?: () => void                              // called when download finishes
  onError?: (error: Error) => void
  autoClose?: boolean                                  // close modal after download, default: false
  autoStart?: boolean                                  // start download on mount, default: false
}
```

**UI behavior:**
```
┌──────────────────────────────┐
│  Download File             × │
├──────────────────────────────┤
│  📄 report.pdf               │
│                              │
│  [████████░░░░] 65%          │
│  2.3 MB / 3.5 MB             │
│  1.2 MB/s · 1s remaining     │
│                              │
│  [  Cancel  ] [ Download ]   │
└──────────────────────────────┘
```

- If `onProgress` provided → show progress bar with percent, loaded/total, speed, ETA
- If no `onProgress` → plain download button (anchor tag with `download` attribute)
- Cancel during download → aborts via `AbortController`

---

## 9. `Modal.Preview` — Built-in Preview Content

```typescript
type PreviewType = "image" | "pdf" | "video"

interface ModalPreviewProps {
  type: PreviewType
  src: string
  filename?: string    // shown in header
  alt?: string         // for image type
}
```

**Per type:**

**Image:**
```
- Renders <img> centered in Modal.Body
- Zoom in/out via scroll or +/- buttons
- Min/max zoom: 25% - 300%
```

**PDF:**
```
- Renders <iframe> or <embed> with src
- Full width/height of Modal.Body
- Browser-native PDF viewer
```

**Video:**
```
- Renders <video controls> with src
- Full width, auto height
- Native browser controls
```

---

## 10. `useModal` Hook (Optional Helper)

```typescript
interface UseModalResult {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

function useModal(defaultOpen?: boolean): UseModalResult
```

**Usage:**
```typescript
const modal = useModal()

<button onClick={modal.open}>Open Modal</button>

<Modal isOpen={modal.isOpen} onClose={modal.close}>
  ...
</Modal>
```

---

## 11. Full Usage Example (README.md)

```typescript
import {
  ModalKit, Modal, useModal
} from "@alisdev/fe-kit"

// ── Setup (main.tsx) ──────────────────────────────────────────────

ModalKit.setup({
  animation: { in: "zoom", out: "fade", duration: 200 },
  closeButtonStyle: "macos",
  backdrop: {
    enabled: true,
    baseOpacity: 0.5,
    opacityIncrement: 0.1
  }
})

// ── Basic Modal ───────────────────────────────────────────────────

function ProfileModal() {
  const modal = useModal()

  return (
    <>
      <button onClick={modal.open}>Edit Profile</button>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        size="md"
        position="center"
        closeButtonStyle="macos"
        scrollBehavior="body"
      >
        <Modal.Header>Edit Profile</Modal.Header>
        <Modal.Body>
          <CreateUserForm />
        </Modal.Body>
        <Modal.Footer align="right">
          <button onClick={modal.close}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

// ── Custom Close Button ───────────────────────────────────────────

<Modal
  isOpen={isOpen}
  onClose={onClose}
  closeButtonStyle="button"
  closeButton={
    <button style={{ background: "red", color: "white", borderRadius: 4 }}>
      Close ×
    </button>
  }
>
  <Modal.Header showCloseButton={true}>Custom Close</Modal.Header>
  <Modal.Body>Content here</Modal.Body>
</Modal>

// ── Layer Stacking ────────────────────────────────────────────────

function LayeredModals() {
  const first = useModal()
  const second = useModal()

  return (
    <>
      <button onClick={first.open}>Open First</button>

      <Modal isOpen={first.isOpen} onClose={first.close} size="lg">
        <Modal.Header>First Modal</Modal.Header>
        <Modal.Body>
          <button onClick={second.open}>Open Second Modal</button>
        </Modal.Body>
      </Modal>

      {/* Stacks on top of first modal */}
      <Modal isOpen={second.isOpen} onClose={second.close} size="sm">
        <Modal.Header>Second Modal (on top)</Modal.Header>
        <Modal.Body>I am layered on top!</Modal.Body>
        <Modal.Footer>
          <button onClick={second.close}>Back</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

// ── Download Modal ────────────────────────────────────────────────

function DownloadReportModal() {
  const modal = useModal()
  const [progress, setProgress] = useState<DownloadProgress | null>(null)

  return (
    <>
      <button onClick={modal.open}>Download Report</button>

      <Modal isOpen={modal.isOpen} onClose={modal.close} size="sm">
        <Modal.Header>Download Report</Modal.Header>
        <Modal.Body>
          <Modal.Download
            filename="report-2024.pdf"
            url="/api/reports/export"
            onProgress={setProgress}
            onComplete={modal.close}
            autoStart={true}
          />
        </Modal.Body>
      </Modal>
    </>
  )
}

// ── Preview Modal ─────────────────────────────────────────────────

function ImagePreviewModal({ src }: { src: string }) {
  const modal = useModal()

  return (
    <>
      <img src={src} onClick={modal.open} style={{ cursor: "pointer" }} />

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        size="xl"
        position="center"
      >
        <Modal.Header>Preview</Modal.Header>
        <Modal.Body padding={0}>
          <Modal.Preview type="image" src={src} alt="Preview" />
        </Modal.Body>
      </Modal>
    </>
  )
}

// ── Prevent Close (loading state) ────────────────────────────────

function UploadModal() {
  const modal = useModal()
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    setUploading(true)
    await FileService.upload(file)
    setUploading(false)
    modal.close()
  }

  return (
    <Modal
      isOpen={modal.isOpen}
      onClose={modal.close}
      preventClose={uploading}   // cannot close while uploading
      size="sm"
    >
      <Modal.Header>Upload File</Modal.Header>
      <Modal.Body>
        {uploading ? <p>Uploading...</p> : <FileInput />}
      </Modal.Body>
      <Modal.Footer>
        <button onClick={modal.close} disabled={uploading}>Cancel</button>
        <button onClick={handleUpload} disabled={uploading}>Upload</button>
      </Modal.Footer>
    </Modal>
  )
}

// ── Responsive (automatic) ────────────────────────────────────────

// Desktop → centered modal, size "md"
// Mobile  → full screen centered modal (92vw, max 85vh)
<Modal isOpen={isOpen} onClose={onClose} size="md" position="center">
  ...
</Modal>

// Desktop → bottom positioned
// Mobile  → bottom sheet (slides up)
<Modal isOpen={isOpen} onClose={onClose} position="bottom">
  ...
</Modal>
```

---

## Output Requirements

1. Implement all files in `src/` with full TypeScript types
2. Export `ModalKit`, `Modal`, `useModal` from `src/index.ts`
3. `Modal` renders via React Portal at `document.body`
4. Compound component pattern — `Modal.Header`, `Modal.Body`, `Modal.Footer`, `Modal.Download`, `Modal.Preview` attached as static properties
5. Animations implemented via CSS transitions — no external animation library
6. Focus trap implemented natively — Tab cycles within topmost modal only
7. `z-index` managed by `ModalStack` — base 1000, +10 per layer
8. Responsive detection uses `window.matchMedia` with resize listener
9. Add inline JSDoc on all public APIs
10. Handle edge cases:
    - `preventClose: true` + backdrop click → do nothing, no close
    - `preventClose: true` + Escape key → do nothing, no close
    - `preventClose: true` + close button click → do nothing, no close
    - `Modal.Download` with no `onProgress` → plain `<a download>` link, no progress bar
    - `Modal.Preview type="pdf"` → fallback to download link if browser doesn't support PDF embed
    - `size: "full"` on mobile → always full screen regardless of position
    - Multiple modals with same `isOpen: true` on mount → all render in stack order (DOM order)
    - `closeOnBackdrop: false` + `closeOnEscape: false` + `preventClose: false` → only close button works
    - MacOS close button: yellow and green circles must be visually dimmed and non-interactive
    - Image preview zoom: scroll inside `Modal.Body` zooms image, not scrolls body
