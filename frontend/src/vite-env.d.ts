/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_STOCKS_API: string;
  readonly REACT_APP_GUEST_EMAIL: string;
  readonly REACT_APP_GUEST_PASS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
