import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to control how many transactions are captured
  tracesSampleRate: 1.0,

  // Enable always capture for debugging
  captureFailedRequests: true,

  // Environment
  environment: process.env.NODE_ENV,
});

// Log successful initialization
console.log("Sentry initialized for environment:", process.env.NODE_ENV);
