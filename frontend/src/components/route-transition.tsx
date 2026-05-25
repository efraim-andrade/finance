import { useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type RouteTransitionProps = {
  children: ReactNode;
};

export function RouteTransition({ children }: RouteTransitionProps) {
  const location = useLocation();
  const prevPathnameRef = useRef(location.pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [anim, setAnim] = useState<"none" | "enter">("none");

  useEffect(() => {
    if (location.pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = location.pathname;
      setAnim("enter");

      timerRef.current = setTimeout(() => setAnim("none"), 400);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [location.pathname]);

  const style =
    anim === "enter"
      ? {
          animation:
            "impeccable-route-enter 350ms cubic-bezier(0.16, 1, 0.3, 1) both",
        }
      : undefined;

  return (
    <div style={{ position: "relative", flex: 1 }}>
      <div className="anim-page" style={style}>
        {children}
      </div>
    </div>
  );
}
