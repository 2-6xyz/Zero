/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional POST endpoint for order requests. Public by design. */
  readonly VITE_ORDER_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
