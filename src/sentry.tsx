import * as Sentry from "@sentry/browser";
import {
  Integrations as ApmIntegrations,
  Span,
  Transaction,
} from "@sentry/apm";
import { CaptureConsole as CaptureConsoleIntegration } from "@sentry/integrations";

const Tracing = ApmIntegrations.Tracing;

export const setupSentry = (options: { [key: string]: any }) => {
  console.log(`[sentry] Initialized with DSN: ${options.dsn}`);
  Sentry.init({
    tracesSampleRate: 1.0,
    ...options,
    integrations: [
      new CaptureConsoleIntegration({
        levels: ["error"],
      }),
      new ApmIntegrations.Tracing(),
    ],
  });
};

export const startSpan = (options: {
  description?: string;
  op?: string;
}): Span | undefined => {
  const tracingIntegration = Sentry.getCurrentHub().getIntegration(Tracing);
  if (!tracingIntegration) {
    console.warn("startSpan called without tracing integration");
    return undefined;
  }
  const transaction = (tracingIntegration as any).constructor.getTransaction();
  if (!transaction) {
    console.info("startSpan called without transaction");
    return undefined;
  }
  return transaction.startChild(options);
};

export const startTransaction = (options: {
  name: string;
  op?: string;
  description?: string;
}): Transaction | undefined => {
  const hub = Sentry.getCurrentHub();
  const tracingIntegration = hub.getIntegration(Tracing);
  if (!tracingIntegration) {
    console.warn("startTransaction called without tracing integration");
    return undefined;
  }
  return Tracing.startIdleTransaction(options);
};
