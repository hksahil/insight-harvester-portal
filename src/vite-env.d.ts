
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RAZORPAY_KEY_ID?: string;
  readonly RAZORPAY_KEY_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
