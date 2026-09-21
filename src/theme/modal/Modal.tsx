import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import cn from "../../utils/classnames";
import IconButton from "../button/IconButton";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  size?: "md" | "lg";
  children: ReactNode;
  className?: string;
}

const CLOSE_DURATION = 200;

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  actions,
  size = "lg",
  children,
  className = "",
}: ModalProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        setMounted(true);
        inner = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    const frame = requestAnimationFrame(() => setVisible(false));
    const timeout = setTimeout(() => setMounted(false), CLOSE_DURATION);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200",
        { "opacity-100": visible, "opacity-0": !visible }
      )}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "relative flex max-h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-frame transition-all duration-300 ease-out",
          {
            "max-w-2xl": size === "md",
            "max-w-4xl": size === "lg",
            "translate-y-0 scale-100 opacity-100": visible,
            "translate-y-4 scale-95 opacity-0": !visible,
          },
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink/5 px-6 py-5">
          <div className="min-w-0">
            {title && (
              <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
            )}
            {subtitle && <p className="mt-1 text-sm text-stone">{subtitle}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {actions}
            <IconButton
              icon={<X size={18} />}
              label="Close"
              tone="light"
              onClick={onClose}
            />
          </div>
        </div>
        <div className="scrollbar-thin min-h-0 overflow-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
}
