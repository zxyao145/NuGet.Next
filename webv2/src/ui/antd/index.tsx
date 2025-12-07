"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect, @next/next/no-img-element, jsx-a11y/alt-text */

import Link from "next/link";
import {
  HTMLAttributes,
  MouseEvent,
  ReactElement,
  ReactNode,
  isValidElement,
  Children,
  cloneElement,
  forwardRef,
  useEffect,
  useState,
} from "react";
import type {
  ButtonHTMLAttributes,
  CSSProperties,
  InputHTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  JSX as ReactJSX,
} from "react";
import {
  Controller,
  FormProvider,
  useForm as useReactHookForm,
  useFormContext,
  type DefaultValues,
} from "react-hook-form";
import { toast } from "sonner";

import { Button as ShadButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input as ShadInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Popover as ShadPopover,
  PopoverContent as ShadPopoverContent,
  PopoverTrigger as ShadPopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs as ShadTabs,
  TabsContent as ShadTabsContent,
  TabsList as ShadTabsList,
  TabsTrigger as ShadTabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip as ShadTooltip,
  TooltipContent as ShadTooltipContent,
  TooltipProvider as ShadTooltipProvider,
  TooltipTrigger as ShadTooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const message = {
  success: (content: string | { content: string }) =>
    toast.success(typeof content === "string" ? content : content.content),
  error: (content: string | { content: string }) =>
    toast.error(typeof content === "string" ? content : content.content),
  info: (content: string | { content: string }) =>
    toast(typeof content === "string" ? content : content.content),
};

type ButtonType = "primary" | "default" | "dashed" | "text";

export interface AntButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  block?: boolean;
  danger?: boolean;
  loading?: boolean;
  type?: ButtonType;
  htmlType?: "button" | "submit" | "reset";
  size?: "large" | "middle" | "small";
}

export const Button = forwardRef<HTMLButtonElement, AntButtonProps>(
  (
    { block, className, danger, loading, type = "default", htmlType, size, children, ...rest },
    ref,
  ) => {
    const variant =
      type === "text" ? "ghost" : type === "dashed" || type === "default" ? "outline" : "default";
    const resolvedSize = size === "large" ? "lg" : size === "small" ? "sm" : "default";
    return (
      <ShadButton
        className={cn(block && "w-full", className)}
        ref={ref}
        variant={danger ? "destructive" : variant}
        size={resolvedSize}
        type={htmlType ?? "button"}
        {...rest}
        disabled={loading || rest.disabled}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </ShadButton>
    );
  },
);
Button.displayName = "Button";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "prefix" | "size"> & {
  size?: "large" | "middle" | "small";
  suffix?: ReactNode;
  prefix?: ReactNode;
  onPressEnter?: (e: ReactKeyboardEvent<HTMLInputElement>) => void;
};

const BaseInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, suffix, prefix, type, onPressEnter, onKeyDown, size, ...props }, ref) => {
    const sizePadding = size === "large" ? "py-3" : size === "small" ? "py-1" : "py-2";
    const inputHeight = size === "large" ? "h-11" : size === "small" ? "h-8" : "h-10";
    return (
      <div
        className={cn(
          "flex items-center rounded-md border border-input px-3",
          sizePadding,
          className,
        )}
      >
        {prefix && (
          <span className="mr-2 inline-flex items-center text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <ShadInput
          ref={ref}
          className={cn("border-0 px-0 shadow-none focus-visible:ring-0", inputHeight)}
          type={type}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (e.key === "Enter") {
              onPressEnter?.(e);
            }
          }}
          {...props}
        />
        {suffix && (
          <span className="ml-2 inline-flex items-center text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    );
  },
);
BaseInput.displayName = "BaseInput";

const PasswordInput = forwardRef<
  HTMLInputElement,
  InputProps & { iconRender?: (visible: boolean) => ReactNode }
>(({ iconRender, ...props }, ref) => {
  const [visible, setVisible] = useState(false);
  return (
    <BaseInput
      ref={ref}
      type={visible ? "text" : "password"}
      suffix={
        iconRender ? (
          <button
            aria-label="toggle password visibility"
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="inline-flex items-center"
          >
            {iconRender(visible)}
          </button>
        ) : undefined
      }
      {...props}
    />
  );
});
PasswordInput.displayName = "PasswordInput";

export const Input = Object.assign(BaseInput, {
  Password: PasswordInput,
  TextArea: Textarea,
});

type TabsProps = {
  defaultActiveKey?: string;
  activeKey?: string;
  onChange?: (key: string) => void;
  children?: ReactNode;
  items?: { key: string; label: ReactNode; children?: ReactNode }[];
  style?: CSSProperties;
};

type TabPaneProps = {
  tab: ReactNode;
  children: ReactNode;
  key: string;
};

const TabPane = ({ children }: TabPaneProps) => <>{children}</>;

export const Tabs = ({
  activeKey,
  defaultActiveKey,
  onChange,
  children,
  items,
  style,
}: TabsProps) => {
  const tabItems =
    items ??
    (children
      ? Children.toArray(children).map((child) => {
          const element = child as ReactElement<TabPaneProps>;
          return {
            key: (element.key as string) ?? element.props.key,
            label: element.props.tab,
            children: element.props.children,
          };
        })
      : []);

  const initialKey = activeKey ?? defaultActiveKey ?? tabItems[0]?.key;
  const [internalKey, setInternalKey] = useState(initialKey);

  useEffect(() => {
    if (initialKey) setInternalKey(initialKey);
  }, [initialKey]);

  const currentKey = activeKey ?? internalKey;

  return (
    <ShadTabs
      className="gap-0"
      value={currentKey}
      defaultValue={initialKey}
      onValueChange={(val) => {
        setInternalKey(val);
        onChange?.(val);
      }}
      style={style}
    >
      <ShadTabsList className="gap-4">
        {tabItems.map((tab) => (
          <ShadTabsTrigger key={tab.key} value={tab.key}>
            {tab.label}
          </ShadTabsTrigger>
        ))}
      </ShadTabsList>
      {tabItems.map((tab) => (
        <ShadTabsContent key={tab.key} value={tab.key}>
          {tab.children}
        </ShadTabsContent>
      ))}
    </ShadTabs>
  );
};

Tabs.TabPane = TabPane;

export const Divider = (props: HTMLAttributes<HTMLHRElement>) => <Separator {...props} />;

type TagProps = {
  color?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export const Tag = ({ children, style }: TagProps) => (
  <Badge style={style} variant="secondary">
    {children}
  </Badge>
);

type TooltipProps = {
  color?: string;
  open?: boolean;
  placement?: string;
  prefixCls?: string;
  title: ReactNode;
  children: ReactElement;
};

export const Tooltip = ({ title, children }: TooltipProps) => (
  <ShadTooltipProvider>
    <ShadTooltip>
      <ShadTooltipTrigger asChild>{children}</ShadTooltipTrigger>
      <ShadTooltipContent>{title}</ShadTooltipContent>
    </ShadTooltip>
  </ShadTooltipProvider>
);

type PopoverProps = {
  children: ReactNode;
  content: ReactNode;
  placement?: "bottomRight" | "bottom";
  trigger?: ("click" | "hover")[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  overlayInnerStyle?: CSSProperties;
  rootClassName?: string;
  arrow?: boolean;
};

export const PopoverWrapper = ({
  children,
  content,
  onOpenChange,
  open,
  overlayInnerStyle,
  rootClassName,
}: PopoverProps) => {
  const trigger = isValidElement(children) ? children : <span>{children}</span>;
  return (
    <ShadPopover open={open} onOpenChange={onOpenChange}>
      <ShadPopoverTrigger asChild>{trigger}</ShadPopoverTrigger>
      <ShadPopoverContent className={rootClassName} style={overlayInnerStyle}>
        {content}
      </ShadPopoverContent>
    </ShadPopover>
  );
};

export const Popover = PopoverWrapper;

type EmptyProps = {
  description?: ReactNode;
};

export const Empty = ({ description }: EmptyProps) => (
  <div className="flex w-full flex-col items-center justify-center py-8 text-sm text-muted-foreground">
    {description ?? "No Data"}
  </div>
);

type ListProps<T> = {
  dataSource?: T[];
  renderItem?: (item: T) => ReactNode;
  loading?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
  className?: string;
};

const ListComponent = <T,>({
  dataSource,
  renderItem,
  loading,
  style,
  children,
  className,
}: ListProps<T>) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if ((!dataSource || !renderItem) && children) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const items = dataSource ?? [];
  return (
    <div className={className} style={style}>
      {items.map((item, index) => (
        <div key={index}>{renderItem ? renderItem(item) : null}</div>
      ))}
    </div>
  );
};

const ListItem = ({
  children,
  className,
  style,
}: {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) => (
  <div className={cn("flex items-center gap-2 py-1", className)} style={style}>
    {children}
  </div>
);

export const List = Object.assign(ListComponent, { Item: ListItem });

type PaginationProps = {
  current?: number;
  defaultCurrent?: number;
  onChange?: (page: number, pageSize: number) => void;
  total?: number;
  pageSize?: number;
  showTotal?: (total: number, range: [number, number]) => ReactNode;
  showTitle?: boolean;
};

export const Pagination = ({
  current,
  defaultCurrent = 1,
  onChange,
  total = 0,
  pageSize = 10,
  showTotal,
}: PaginationProps) => {
  const [page, setPage] = useState(current ?? defaultCurrent);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (current !== undefined) setPage(current);
  }, [current]);

  const handleChange = (next: number) => {
    const value = Math.min(Math.max(1, next), totalPages);
    setPage(value);
    onChange?.(value, pageSize);
  };

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button type="default" onClick={() => handleChange(page - 1)} disabled={page <= 1}>
          上一页
        </Button>
        <span>
          {page} / {totalPages}
        </span>
        <Button type="default" onClick={() => handleChange(page + 1)} disabled={page >= totalPages}>
          下一页
        </Button>
      </div>
      {showTotal && (
        <div className="text-sm text-muted-foreground">{showTotal(total, [start, end])}</div>
      )}
    </div>
  );
};

type RowProps = {
  children?: ReactNode;
  className?: string;
  gutter?: number | [number, number];
  style?: CSSProperties;
};

export const Row = ({ children, className, gutter = 0, style }: RowProps) => {
  const gapX = Array.isArray(gutter) ? (gutter[0] ?? 0) : gutter;
  const gapY = Array.isArray(gutter) ? (gutter[1] ?? 0) : 0;
  return (
    <div
      className={cn("flex flex-wrap", className)}
      style={{ columnGap: gapX, rowGap: gapY, ...style }}
    >
      {children}
    </div>
  );
};

type ColProps = {
  children?: ReactNode;
  className?: string;
  md?: number;
  sm?: number;
  span?: number;
  style?: CSSProperties;
  xs?: number;
};

export const Col = ({ children, className, md, sm, span = 24, style, xs }: ColProps) => {
  const value = span ?? md ?? sm ?? xs ?? 24;
  const width = `${(value / 24) * 100}%`;
  return (
    <div
      className={cn("min-h-[1px]", className)}
      style={{ flex: `0 0 ${width}`, maxWidth: width, ...style }}
    >
      {children}
    </div>
  );
};

type TitleProps = {
  children?: ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5;
  style?: CSSProperties;
};

const Title = ({ children, className, level = 4, style }: TitleProps) => {
  const Tag = `h${level}` as unknown as keyof ReactJSX.IntrinsicElements;
  return (
    <Tag className={cn("font-semibold leading-tight", className)} style={style}>
      {children}
    </Tag>
  );
};

type TextProps = {
  children?: ReactNode;
  className?: string;
  strong?: boolean;
  style?: CSSProperties;
};

const Text = ({ children, className, strong, style }: TextProps) => (
  <span className={cn(strong && "font-semibold", className)} style={style}>
    {children}
  </span>
);

const Paragraph = ({ children, className, style }: TextProps) => (
  <p className={cn("text-base leading-relaxed", className)} style={style}>
    {children}
  </p>
);

export const Typography = { Title, Text, Paragraph };

type ImageProps = {
  alt?: string;
  className?: string;
  fallback?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  preview?: boolean;
  src: string;
  style?: CSSProperties;
};

export const Image = ({ fallback, onError, src, ...rest }: ImageProps) => {
  const [failed, setFailed] = useState(false);
  return (
    <img
      {...rest}
      src={failed && fallback ? fallback : src}
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

type StatisticProps = {
  prefix?: ReactNode;
  styles?: { content?: CSSProperties };
  suffix?: ReactNode;
  title?: ReactNode;
  value: number;
};

export const Statistic = ({ prefix, styles, suffix, title, value }: StatisticProps) => (
  <Card className="rounded-md" style={{ height: "100%" }}>
    <CardHeader>
      <CardDescription>{title}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center gap-2 text-2xl font-semibold" style={styles?.content}>
        {prefix}
        <span>{value}</span>
        {suffix && <span className="font-normal">{suffix}</span>}
      </div>
    </CardContent>
  </Card>

  // <div className="space-y-1">
  //   <div className="text-sm text-muted-foreground">{title}</div>
  //   <div className="flex items-center gap-2 text-2xl font-semibold" style={styles?.content}>
  //     {prefix}
  //     <span>{value}</span>
  //     {suffix && <span className="text-base font-normal">{suffix}</span>}
  //   </div>
  // </div>
);

type SpinProps = {
  tip?: string;
};

export const Spin = ({ tip }: SpinProps) => (
  <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
    <Loader2 className="h-5 w-5 animate-spin" />
    {tip}
  </div>
);

type ResultProps = {
  status?: "404" | "500";
  title?: ReactNode;
  subTitle?: ReactNode;
  extra?: ReactNode;
};

export const Result = ({ status, title, subTitle, extra }: ResultProps) => (
  <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
    <div className="text-4xl font-semibold">{status}</div>
    <div className="text-2xl font-semibold">{title}</div>
    <div className="text-muted-foreground">{subTitle}</div>
    {extra}
  </div>
);

type ColumnType<T> = {
  key?: string;
  dataIndex?: keyof T;
  title: ReactNode;
  render?: (value: any, record: T, index: number) => ReactNode;
  width?: number | string;
};

export type TableProps<T> = {
  columns: ColumnType<T>[];
  dataSource: T[];
  loading?: boolean;
  pagination?:
    | false
    | {
        current?: number;
        pageSize?: number;
        total?: number;
        onChange?: (page: number, pageSize: number) => void;
      };
  rowKey?: keyof T | ((record: T) => string);
  style?: CSSProperties;
};

export const Table = <T extends Record<string, any>>({
  columns,
  dataSource,
  loading,
  pagination,
  rowKey,
  style,
}: TableProps<T>) => {
  const resolveKey = (record: T, index: number) => {
    if (typeof rowKey === "function") return rowKey(record);
    if (typeof rowKey === "string") return String(record[rowKey]);
    return record.id ?? index;
  };

  if (loading) return <Spin />;

  const paginationConfig = pagination === false ? undefined : pagination;

  return (
    <div className="w-full" style={style}>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key ?? (col.dataIndex as string)}
                className="border-b px-3 py-2 text-left"
                style={
                  col.width
                    ? { verticalAlign: "middle", width: col.width }
                    : { verticalAlign: "middle" }
                }
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataSource.map((record, index) => (
            <tr key={resolveKey(record, index)} className="odd:bg-muted/30">
              {columns.map((col) => {
                const value = col.dataIndex ? record[col.dataIndex] : undefined;
                return (
                  <td
                    key={col.key ?? (col.dataIndex as string)}
                    className="px-3 py-2 align-top"
                    style={{ verticalAlign: "middle" }}
                  >
                    {col.render ? col.render(value, record, index) : (value as ReactNode)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {paginationConfig && (
        <Pagination
          current={paginationConfig.current}
          total={paginationConfig.total}
          pageSize={paginationConfig.pageSize}
          onChange={paginationConfig.onChange}
        />
      )}
    </div>
  );
};

type PopconfirmProps = {
  children: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  okText?: ReactNode;
  cancelText?: ReactNode;
  onConfirm?: (e: MouseEvent<HTMLButtonElement>) => void;
  icon?: ReactNode;
};

export const Popconfirm = ({
  children,
  title,
  description,
  okText,
  cancelText,
  onConfirm,
}: PopconfirmProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {description && <div className="text-sm text-muted-foreground">{description}</div>}
        <DialogFooter>
          <Button type="default" onClick={() => setOpen(false)}>
            {cancelText ?? "取消"}
          </Button>
          <Button
            type="primary"
            onClick={(e) => {
              onConfirm?.(e);
              setOpen(false);
            }}
          >
            {okText ?? "确定"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type UploadProps = {
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  children?: ReactNode;
  multiple?: boolean;
  name?: string;
  style?: CSSProperties;
};

const Dragger = ({ beforeUpload, children, multiple, style }: UploadProps) => {
  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files);
    for (const file of list) {
      const allow = (await beforeUpload?.(file)) ?? true;
      if (!allow) break;
    }
  };

  return (
    <label
      className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/50 p-6 text-center"
      style={style}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        void handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        type="file"
        className="hidden"
        multiple={multiple}
        onChange={(e) => {
          void handleFiles(e.target.files);
        }}
      />
      {children}
    </label>
  );
};

export const Upload = Object.assign(
  ({ children, ...props }: UploadProps) => <Dragger {...props}>{children}</Dragger>,
  { Dragger },
);

type DescriptionsProps = {
  bordered?: boolean;
  column?: number;
  children?: ReactNode;
};

type DescriptionItemProps = {
  label: ReactNode;
  children?: ReactNode;
};

const DescriptionItem = ({ label, children }: DescriptionItemProps) => (
  <div className="grid grid-cols-[160px_1fr] border-b border-border last:border-b-0">
    <div className="text-muted-foreground bg-gray-50 px-3 py-2">{label}</div>
    <div className="px-3 py-2">{children}</div>
  </div>
);

export const Descriptions = Object.assign(
  ({ children, bordered = true }: DescriptionsProps) => (
    <div className={cn("w-full overflow-hidden", bordered && "rounded-md border border-border")}>
      {children}
    </div>
  ),
  { Item: DescriptionItem },
);

export type MenuItem = {
  key?: string;
  label?: ReactNode;
  icon?: ReactNode;
  children?: MenuItem[];
  onClick?: () => void;
  type?: "divider";
};

export type MenuProps = {
  items: MenuItem[];
  defaultSelectedKeys?: string[];
  selectedKeys?: string[];
  onSelect?: (info: { key: string }) => void;
  onClick?: (info: { key: string }) => void;
  mode?: "inline" | "horizontal" | "vertical";
  style?: CSSProperties;
  className?: string;
  selectable?: boolean;
  activeable?: boolean;
};

export const Menu = ({
  items,
  defaultSelectedKeys,
  selectedKeys,
  onClick,
  onSelect,
  style,
  className,
  activeable,
}: MenuProps) => {
  const initialKey =
    selectedKeys?.[0] ??
    defaultSelectedKeys?.[0] ??
    items.find((item) => item.type !== "divider")?.key;
  const [active, setActive] = useState(initialKey);

  const renderItems = (menuItems: MenuItem[]) =>
    menuItems.map((item, index) => {
      if (item.type === "divider") {
        return <Separator key={`divider-${index}`} className="my-2" />;
      }
      if (item.children?.length) {
        return (
          <div key={item.key} className="flex flex-col gap-1">
            {item.label && (
              <div className="px-3 py-1 text-xs text-muted-foreground">{item.label}</div>
            )}
            {renderItems(item.children)}
          </div>
        );
      }
      return (
        <button
          key={item.key}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-accent",
            activeable &&
              active === item.key &&
              "bg-primary text-primary-foreground hover:bg-primary",
          )}
          onClick={() => {
            setActive(item.key);
            onSelect?.({ key: item.key ?? "" });
            item.onClick?.();
            onClick?.({ key: item.key ?? "" });
          }}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      );
    });

  return (
    <div className={cn("flex flex-col gap-1", className)} style={style}>
      {renderItems(items)}
    </div>
  );
};

type LayoutProps = {
  children?: ReactNode;
  className?: string;
  footer?: ReactNode;
  header?: ReactNode;
  style?: CSSProperties;
  collapsedWidth?: string | number;
  onBreakpoint?: (broken: any) => void;
  onCollapse?: (collapsed: any, type: any) => void;
};

const LayoutRoot = ({ children, className, footer, header, style }: LayoutProps) => (
  <div className={cn("flex min-h-screen flex-col", className)} style={style}>
    {header}
    {children}
    {footer}
  </div>
);

const LayoutHeader = ({ children, className, style }: LayoutProps) => (
  <header className={cn("border-b border-border bg-background px-4 py-3", className)} style={style}>
    {children}
  </header>
);

const LayoutContent = ({ children, className, style }: LayoutProps) => (
  <main className={cn("flex-1 px-4", className)} style={style}>
    {children}
  </main>
);

const LayoutSider = ({ children, className, style }: LayoutProps) => (
  <aside
    className={cn("w-60 border-r border-border bg-background px-3 py-4", className)}
    style={style}
  >
    {children}
  </aside>
);

const LayoutFooter = ({ children, className, style }: LayoutProps) => (
  <footer
    className={cn("border-t border-border bg-background px-4 py-3 text-center text-sm", className)}
    style={style}
  >
    {children}
  </footer>
);

export const Layout = Object.assign(LayoutRoot, {
  Header: LayoutHeader,
  Content: LayoutContent,
  Sider: LayoutSider,
  Footer: LayoutFooter,
});

export const Footer = LayoutFooter;
export const Header = LayoutHeader;

type FormProps<T extends Record<string, any>> = {
  form?: ReturnType<typeof useReactHookForm<T>>;
  onFinish?: (values: T) => void;
  children: ReactNode;
};

type Rule =
  | {
      required?: boolean;
      message?: string;
      min?: number;
      max?: number;
      pattern?: RegExp;
      type?: "email";
    }
  | {
      validator: (rule: unknown, value: any) => Promise<void> | void;
      message?: string;
    }
  | ((helpers: { getFieldValue: (name: string) => any }) => Rule);

type FormItemProps = {
  name?: string;
  label?: ReactNode;
  rules?: Rule[];
  children: ReactElement;
  initialValue?: any;
  required?: boolean;
  dependencies?: string[];
};

const useAntdForm = <T extends Record<string, any>>() => {
  const methods = useReactHookForm<T>({ defaultValues: {} as DefaultValues<T>, mode: "onSubmit" });
  return [methods] as const;
};

const FormComponent = <T extends Record<string, any>>({
  children,
  form,
  onFinish,
}: FormProps<T>) => {
  const fallbackMethods = useReactHookForm<T>({
    defaultValues: {} as DefaultValues<T>,
    mode: "onSubmit",
  });
  const methods = form ?? fallbackMethods;

  return (
    <FormProvider {...methods}>
      <form
        className="space-y-3"
        onSubmit={methods.handleSubmit((values) => {
          onFinish?.(values);
        })}
      >
        {children}
      </form>
    </FormProvider>
  );
};

const FormItem = ({ children, label, name, rules, required, initialValue }: FormItemProps) => {
  const methods = useFormContext();
  const fieldRules = rules ?? [];
  const mergedRules = required
    ? [{ required: true, message: "必填项" } as Rule, ...fieldRules]
    : [...fieldRules];

  if (!name) {
    return (
      <div className="flex flex-col gap-1">
        {label && <Label className="text-sm font-medium">{label}</Label>}
        {children}
      </div>
    );
  }

  const normalizedRules = mergedRules.map((rule) =>
    typeof rule === "function"
      ? rule({
          getFieldValue: methods?.getValues,
        })
      : rule,
  );

  return (
    <Controller
      name={name ?? ""}
      defaultValue={initialValue}
      rules={{
        required: normalizedRules.some(
          (rule) => typeof rule === "object" && (rule as any).required,
        ),
        minLength: normalizedRules.find(
          (rule) => typeof rule === "object" && "min" in rule && rule.min,
        ) as any,
        maxLength: normalizedRules.find(
          (rule) => typeof rule === "object" && "max" in rule && rule.max,
        ) as any,
        pattern: normalizedRules.find(
          (rule) => typeof rule === "object" && "pattern" in rule && rule.pattern,
        ) as any,
        validate: async (value) => {
          for (const rule of normalizedRules) {
            if (typeof rule !== "object") continue;
            if ("validator" in rule) {
              try {
                await rule.validator(rule, value);
              } catch (error: any) {
                return error?.message ?? "校验失败";
              }
            }
            if ("type" in rule && rule.type === "email" && value) {
              const emailRegex = /\S+@\S+\.\S+/;
              if (!emailRegex.test(value)) return (rule as any).message ?? "邮箱格式错误";
            }
            if ("min" in rule && rule.min && typeof value === "string" && value.length < rule.min) {
              return rule.message ?? `至少${rule.min}个字符`;
            }
            if ("max" in rule && rule.max && typeof value === "string" && value.length > rule.max) {
              return rule.message ?? `最多${rule.max}个字符`;
            }
            if (
              "pattern" in rule &&
              rule.pattern &&
              value &&
              !(rule.pattern as RegExp).test(value)
            ) {
              return rule.message ?? "格式错误";
            }
          }
          return true;
        },
      }}
      render={({ field, fieldState }) => {
        const child = children as any;
        const props = {
          ...child.props,
          value: field.value,
          checked: child.props?.checked ?? undefined,
          onChange: (value: any) => {
            if (value?.target?.value !== undefined) {
              field.onChange(value.target.value);
            } else if (value?.target?.checked !== undefined) {
              field.onChange(value.target.checked);
            } else {
              field.onChange(value);
            }
            child.props?.onChange?.(value);
          },
          onBlur: field.onBlur,
        };

        return (
          <div className="flex flex-col gap-1">
            {label && <Label className="text-sm font-medium">{label}</Label>}
            {cloneElement(child, props)}
            {fieldState.error && (
              <div className="text-xs text-destructive">{fieldState.error.message}</div>
            )}
          </div>
        );
      }}
    />
  );
};

export const Form = Object.assign(FormComponent, {
  Item: FormItem,
  useForm: useAntdForm,
});

type MenuConfigProviderProps = {
  children: ReactNode;
};

export const ConfigProvider = ({ children }: MenuConfigProviderProps) => <>{children}</>;

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger as Trigger,
  Link,
};
