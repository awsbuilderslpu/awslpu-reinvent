"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useCallback,
} from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          action?: string;
          cData?: string;
          callback?: (token: string) => void;
          "error-callback"?: (error?: string | number) => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "flexible" | "compact";
          tabindex?: number;
          [key: string]: unknown;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
      ready: (callback: () => void) => void;
    };
  }
}

export interface TurnstileRef {
  reset: () => void;
}

export interface TurnstileProps {
  siteKey?: string;
  action?: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "flexible" | "compact";
  className?: string;
  onSuccess: (token: string) => void;
  onExpire?: () => void;
  onError?: (error?: string | number) => void;
}

const CLOUDFLARE_SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(
  function Turnstile(
    {
      siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      action,
      theme = "dark",
      size = "normal",
      className,
      onSuccess,
      onExpire,
      onError,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    const onSuccessRef = useRef(onSuccess);
    const onExpireRef = useRef(onExpire);
    const onErrorRef = useRef(onError);

    useEffect(() => {
      onSuccessRef.current = onSuccess;
    }, [onSuccess]);

    useEffect(() => {
      onExpireRef.current = onExpire;
    }, [onExpire]);

    useEffect(() => {
      onErrorRef.current = onError;
    }, [onError]);

    const reset = useCallback(() => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch (err) {
          console.error("Failed to reset Turnstile widget:", err);
        }
      }
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        reset,
      }),
      [reset]
    );

    useEffect(() => {
      let isMounted = true;

      // Fallback to official Cloudflare test site key (always passes) if placeholder or unset
      const resolvedSiteKey =
        siteKey && siteKey !== "your_public_site_key"
          ? siteKey
          : "1x00000000000000000000AA";

      const renderWidget = () => {
        if (!containerRef.current || !window.turnstile || !isMounted) return;

        // Prevent duplicate rendering in the same container
        if (widgetIdRef.current) return;

        try {
          // Clear any leftover elements from previous renders
          containerRef.current.innerHTML = "";

          const id = window.turnstile.render(containerRef.current, {
            sitekey: resolvedSiteKey,
            action,
            theme,
            size,
            callback: (token: string) => {
              if (isMounted) onSuccessRef.current(token);
            },
            "expired-callback": () => {
              if (isMounted) onExpireRef.current?.();
            },
            "error-callback": (error?: string | number) => {
              console.error("Turnstile widget error code:", error);
              if (isMounted) onErrorRef.current?.(error);
            },
          });

          widgetIdRef.current = id;
        } catch (err) {
          console.error("Failed to render Turnstile widget:", err);
          if (isMounted) onErrorRef.current?.("RenderError");
        }
      };

      // Ensure script tag is in document
      let scriptTag = document.querySelector<HTMLScriptElement>(
        'script[src*="challenges.cloudflare.com/turnstile"]'
      );

      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.src = CLOUDFLARE_SCRIPT_URL;
        document.head.appendChild(scriptTag);
      }

      // Check if turnstile is already available on window
      if (window.turnstile && typeof window.turnstile.render === "function") {
        renderWidget();
      } else {
        // Poll for window.turnstile to become available
        const intervalId = setInterval(() => {
          if (
            window.turnstile &&
            typeof window.turnstile.render === "function" &&
            isMounted
          ) {
            clearInterval(intervalId);
            renderWidget();
          }
        }, 50);

        const timeoutId = setTimeout(() => {
          clearInterval(intervalId);
          if (!window.turnstile && isMounted) {
            console.error("Cloudflare Turnstile failed to load after 10s");
            onErrorRef.current?.("ScriptLoadError");
          }
        }, 10000);

        return () => {
          isMounted = false;
          clearInterval(intervalId);
          clearTimeout(timeoutId);

          if (widgetIdRef.current && window.turnstile) {
            try {
              window.turnstile.remove(widgetIdRef.current);
            } catch (err) {
              // Widget might have already been removed
            }
            widgetIdRef.current = null;
          }
        };
      }

      return () => {
        isMounted = false;

        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch (err) {
            // Widget might have already been removed
          }
          widgetIdRef.current = null;
        }
      };
    }, [siteKey, action, theme, size]);

    return (
      <div
        ref={containerRef}
        className={className}
        data-testid="turnstile-container"
        style={{ minHeight: "65px" }}
      />
    );
  }
);

Turnstile.displayName = "Turnstile";

export default Turnstile;
