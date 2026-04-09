import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,

  // Custom error handler that logs but doesn't crash
  onUncaughtException: (error) => {
    console.error("Uncaught exception:", error);
    Sentry.captureException(error);
  },

  onUnhandledRejection: (reason) => {
    console.error("Unhandled rejection:", reason);
    Sentry.captureException(reason);
  },
});

export default Sentry;
