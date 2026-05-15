"use client";

import { PanelLeftIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3.5rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextValue = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const handleChange = () => setIsMobile(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}

function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar deve ser usado dentro de SidebarProvider.");
  }

  return context;
}

type SidebarProviderProps = React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (onOpenChange) {
        onOpenChange(value);
        return;
      }

      _setOpen(value);
    },
    [onOpenChange],
  );

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((value) => !value);
      return;
    }

    setOpen(!open);
  }, [isMobile, open, setOpen]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== SIDEBAR_KEYBOARD_SHORTCUT ||
        (!event.metaKey && !event.ctrlKey)
      ) {
        return;
      }

      event.preventDefault();
      toggleSidebar();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";
  const value = React.useMemo<SidebarContextValue>(
    () => ({
      state,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, openMobile, isMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
            ...style,
          } as React.CSSProperties
        }
        className={cn([
          "group/sidebar-wrapper flex h-svh w-full overflow-hidden bg-background",
          className,
        ])}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

type SidebarProps = React.ComponentProps<"aside"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
};

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    return (
      <Sheet
        open={openMobile}
        onOpenChange={(nextOpen) => setOpenMobile(nextOpen)}
      >
        <SheetContent
          side={side}
          showCloseButton={false}
          className={cn([
            "w-[var(--sidebar-width-mobile)] max-w-[calc(100vw-2rem)] gap-0 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground",
            className,
          ])}
        >
          <SheetTitle className={cn(["sr-only"])}>Menu do CMS</SheetTitle>
          <SheetDescription className={cn(["sr-only"])}>
            Navegação principal da área administrativa.
          </SheetDescription>
          <aside
            data-slot="sidebar"
            data-mobile="true"
            className={cn(["flex h-full w-full flex-col"])}
            {...props}
          >
            {children}
          </aside>
        </SheetContent>
      </Sheet>
    );
  }

  if (collapsible === "none") {
    return (
      <aside
        data-slot="sidebar"
        data-state={state}
        data-variant={variant}
        data-side={side}
        className={cn([
          "group/sidebar hidden h-svh w-[var(--sidebar-width)] shrink-0 flex-col overflow-hidden border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex",
          side === "left" ? "border-r" : "border-l",
          className,
        ])}
        {...props}
      >
        {children}
      </aside>
    );
  }

  return (
    <aside
      data-slot="sidebar"
      data-state={state}
      data-variant={variant}
      data-side={side}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      className={cn([
        "group/sidebar hidden h-svh shrink-0 flex-col overflow-hidden border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-linear lg:flex",
        side === "left" ? "border-r" : "border-l",
        state === "collapsed" && collapsible === "icon"
          ? "w-[var(--sidebar-width-icon)]"
          : "w-[var(--sidebar-width)]",
        variant === "floating" &&
          "m-2 h-[calc(100svh-1rem)] rounded-xl border shadow-sm",
        className,
      ])}
      {...props}
    >
      {children}
    </aside>
  );
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      className={cn(["text-muted-foreground", className])}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon className={cn(["size-5"])} />
      <span className={cn(["sr-only"])}>Alternar menu lateral</span>
    </Button>
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn([
        "relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background",
        className,
      ])}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn(["flex min-h-14 flex-col gap-2 p-2", className])}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn(["mt-auto flex flex-col gap-2 p-2", className])}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn([
        "nexora-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden p-2 group-data-[state=collapsed]/sidebar:items-center group-data-[state=collapsed]/sidebar:px-2",
        className,
      ])}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn([
        "relative flex w-full min-w-0 flex-col p-2 group-data-[state=collapsed]/sidebar:w-auto group-data-[state=collapsed]/sidebar:p-0",
        className,
      ])}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn([
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none transition-[margin,opacity] duration-200 ease-linear group-data-[state=collapsed]/sidebar:hidden",
        className,
      ])}
      {...props}
    />
  );
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      className={cn([
        "w-full text-sm group-data-[state=collapsed]/sidebar:w-auto",
        className,
      ])}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn([
        "flex w-full min-w-0 flex-col gap-1 group-data-[state=collapsed]/sidebar:w-auto group-data-[state=collapsed]/sidebar:items-center",
        className,
      ])}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn(["group/menu-item relative", className])}
      {...props}
    />
  );
}

type SidebarMenuButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
};

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  className,
  children,
  type = "button",
  ...props
}: SidebarMenuButtonProps) {
  const classes = cn([
    "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-data-[state=collapsed]/sidebar:size-9 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:gap-0 group-data-[state=collapsed]/sidebar:px-0 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
    isActive && "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
    className,
  ]);

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      className?: string;
      "data-active"?: boolean;
    }>;

    return React.cloneElement(child, {
      className: cn([classes, child.props.className]),
      "data-active": isActive,
      ...props,
    });
  }

  return (
    <button
      data-slot="sidebar-menu-button"
      data-active={isActive}
      type={type}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-separator"
      className={cn(["mx-2 h-px bg-sidebar-border", className])}
      {...props}
    />
  );
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-slot="sidebar-rail"
      type="button"
      aria-label="Alternar menu lateral"
      tabIndex={-1}
      onClick={toggleSidebar}
      className={cn([
        "absolute inset-y-0 right-0 z-20 hidden w-2 cursor-ew-resize transition-all after:absolute after:inset-y-0 after:left-1/2 after:w-px hover:after:bg-sidebar-border sm:flex",
        className,
      ])}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
