"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element, jsx-a11y/alt-text */

import { ReactElement, ReactNode, forwardRef, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import { Avatar as ShadAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, Button as ShadButton } from "@/components/ui/button";
import { Form, Input as AntdInput, Popover, Tabs, Tag, Tooltip } from "@/ui/antd";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Copy, Laptop, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ThemeProvider = ({
  children,
  onThemeModeChange,
  themeMode,
}: {
  children: ReactNode;
  themeMode?: "light" | "dark" | "auto";
  onThemeModeChange?: (mode: "light" | "dark" | "auto") => void;
}) => {
  useEffect(() => {
    if (themeMode) onThemeModeChange?.(themeMode);
  }, [onThemeModeChange, themeMode]);
  return <>{children}</>;
};

type ThemeSwitchProps = {
  onThemeSwitch?: (mode: "light" | "dark" | "auto") => void;
  themeMode?: "light" | "dark" | "auto";
  style?: CSSProperties;
};

const themeData = [
  { key: "auto", icon: <Laptop className="h-4 w-4" /> },
  { key: "light", icon: <Sun className="h-4 w-4" /> },
  { key: "dark", icon: <Moon className="h-4 w-4" /> },
];

export const ThemeSwitch = ({ onThemeSwitch, themeMode = "auto", style }: ThemeSwitchProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild className="border-none shadow-none" style={{ ...style }}>
      <Button variant="outline">{themeData.filter((x) => x.key === themeMode)[0].icon}</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="start">
      <DropdownMenuLabel>主题</DropdownMenuLabel>
      <DropdownMenuGroup>
        {themeData.map((item) => (
          <DropdownMenuItem
            key={item.key}
            onClick={() => onThemeSwitch?.(item.key as "light" | "dark" | "auto")}
          >
            {item.icon} {item.key}
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);

export type AvatarProps = {
  alt?: string;
  avatar?: ReactNode;
  src?: string;
  background?: string;
  shape?: "circle" | "square";
  size?: number;
  animation?: boolean;
  unoptimized?: boolean;
  className?: string;
  style?: CSSProperties;
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      alt = "avatar",
      avatar,
      src,
      background,
      shape = "circle",
      size = 32,
      className,
      style,
    }: AvatarProps,
    ref,
  ) => (
    <ShadAvatar
      ref={ref}
      className={cn(shape === "square" && "rounded-md", className)}
      style={{ width: size, height: size, background, ...style }}
    >
      {typeof (avatar ?? src) === "string" ? (
        <AvatarImage src={(avatar ?? src) as string} alt={alt} />
      ) : (
        avatar
      )}
      <AvatarFallback>{alt?.[0] ?? "U"}</AvatarFallback>
    </ShadAvatar>
  ),
);
Avatar.displayName = "Avatar";

export const Input = AntdInput;

export const Markdown = ({
  allowHtml = true,
  children,
  className,
  componentProps,
  lineHeight,
  // compatibility props
  fullFeaturedCodeBlock,
  variant,
}: {
  allowHtml?: boolean;
  children: string;
  className?: string;
  componentProps?: Record<string, any>;
  lineHeight?: number;
  fullFeaturedCodeBlock?: boolean;
  variant?: string;
}) => (
  <>
    {void fullFeaturedCodeBlock}
    {void variant}
    <ReactMarkdown
      // className={cn("prose max-w-none", className)}
      // style={lineHeight ? { lineHeight } : undefined}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={allowHtml ? [rehypeRaw, rehypeSanitize] : undefined}
      components={componentProps}
    >
      {children}
    </ReactMarkdown>
  </>
);

export const Snippet = ({
  children,
  prefix,
  copyable = true,
  lang,
  language,
  spotlight,
}: {
  children: string;
  prefix?: string;
  copyable?: boolean;
  lang?: string;
  language?: string;
  spotlight?: boolean;
}) => {
  void lang;
  void language;
  void spotlight;
  return (
    <div className="rounded-md flex items-center" style={{ backgroundColor: "#f8f8f8" }}>
      <pre className="overflow-x-auto whitespace-pre-wrap px-4 py-3 text-sm flex-1">
        {prefix ? `${prefix} ${children}` : children}
      </pre>
      {copyable && (
        <ShadButton
          aria-label="复制"
          className="right-3 h-8 w-8 p-0"
          size="icon"
          variant="ghost"
          onClick={() => {
            if (typeof navigator !== "undefined" && navigator.clipboard) {
              navigator.clipboard.writeText(children);
              toast.success("已复制");
            }
          }}
        >
          <Copy className="h-4 w-4" />
        </ShadButton>
      )}
    </div>
  );
};

type LayoutProps = {
  children?: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
  style?: CSSProperties;
};

export const Layout = ({ children, footer, header, style }: LayoutProps) => (
  <div className="flex min-h-screen flex-col bg-background" style={style}>
    {header}
    <main className="flex-1 w-full">{children}</main>
    {footer}
  </div>
);

export const Header = ({
  actions,
  logo,
  nav,
  style,
  title,
}: {
  actions?: ReactNode;
  logo?: ReactNode;
  nav?: ReactNode;
  style?: CSSProperties;
  title?: ReactNode;
}) => (
  <header
    className="flex items-center gap-4 border-b border-border bg-background px-4 py-3"
    style={style}
  >
    <div className="flex items-center gap-2 text-lg font-semibold">
      {logo}
      {title}
    </div>
    <div className="flex-1">{nav}</div>
    <div className="flex items-center gap-3">{actions}</div>
  </header>
);

type FooterColumn = {
  items: { openExternal?: boolean; title: string; url: string }[];
  title: string;
};

export const Footer = ({ columns }: { columns?: FooterColumn[] }) => (
  <footer className="border-t border-border bg-background px-6 py-8">
    <div className="grid gap-6 sm:grid-cols-3">
      {columns?.map((column) => (
        <div key={column.title} className="space-y-2">
          <div className="text-sm font-semibold">{column.title}</div>
          <div className="flex flex-col gap-1 text-sm">
            {column.items.map((item) => (
              <a
                key={item.title}
                href={item.url}
                target={item.openExternal === false ? "_self" : "_blank"}
                rel="noreferrer"
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  </footer>
);

export { Tag, Tabs, Tooltip, Popover, Form };

export const Icon = ({ icon: IconComponent, size = 16 }: { icon: any; size?: number }) => (
  <IconComponent size={size} />
);

export const ActionIcon = ({
  children,
  icon: IconComponent,
  onClick,
  className,
  size = "default",
  role,
  style,
}: {
  children?: ReactNode;
  icon?: any;
  onClick?: () => void;
  className?: string;
  size?: "small" | "default";
  role?: string;
  style?: CSSProperties;
}) => {
  const content =
    children ?? (IconComponent ? <IconComponent size={size === "small" ? 14 : 16} /> : null);
  return (
    <ShadButton
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      role={role}
      style={style}
    >
      {content}
    </ShadButton>
  );
};

type ModalProps = {
  open?: boolean;
  onCancel?: () => void;
  footer?: ReactNode;
  children?: ReactNode;
};

export const Modal = ({ children, footer, onCancel, open }: ModalProps) => (
  <Dialog open={open} onOpenChange={(val) => !val && onCancel?.()}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle />
      </DialogHeader>
      <div className="py-2">{children}</div>
      {footer !== undefined ? <DialogFooter>{footer}</DialogFooter> : null}
    </DialogContent>
  </Dialog>
);

type EmojiPickerProps = {
  value?: string;
  onChange?: (value: string) => void;
  customEmojis?: unknown;
};

export const EmojiPicker = ({ onChange, value }: EmojiPickerProps) => (
  <AntdInput
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
    placeholder="输入头像/Emoji"
  />
);

type ImageProps = {
  alt?: string;
  className?: string;
  fallback?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  preview?: boolean;
  src?: string;
  style?: CSSProperties;
};

export const Image = ({ fallback, onError, src, ...rest }: ImageProps) => {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = src ?? fallback ?? "";
  return (
    <img
      {...rest}
      src={failed && fallback ? fallback : resolvedSrc}
      onError={(e) => {
        if (fallback && !failed) {
          setFailed(true);
          e.currentTarget.src = fallback;
        }
        onError?.(e);
      }}
    />
  );
};
