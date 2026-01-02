/** biome-ignore-all lint/nursery/noReactForwardRef: <explanation> */
import Link from "next/link";
import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@workspace/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

import { Spinner } from "./Spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full transition-all duration-300 font-medium",
  {
    variants: {
      variant: {
        default: "bg-nest-btn text-white hover:bg-neutral-800",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-gray-300 text-nest-text hover:bg-gray-50",
        secondary: "bg-white text-nest-text hover:bg-gray-100",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        icon: "bg-white text-nest-text hover:bg-gray-100 shadow-sm",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type BaseProps = VariantProps<typeof buttonVariants> & {
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
  active?: boolean;
  loadingText?: string;
  loading?: boolean;
};

// Props if the component is a BUTTON
type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: never;
  };

// Props if the component is a LINK
type ButtonAsLink = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
  };

// The final discriminated union
export type ButtonProps = ButtonAsButton | ButtonAsLink;

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ asChild = false, children, loadingText, active = false, loading = false, ...props }, ref) => {
    const variant = "variant" in props ? props.variant : "default";
    const size = "size" in props ? props.size : "default";
    const className = "className" in props ? props.className : "";

    const baseClasses = buttonVariants({
      variant,
      size,
      className,
    });

    // ✅ Active styles
    const activeStyles = active
      ? "bg-nest-btn text-white shadow-md ring-2 ring-offset-2 ring-gray-200"
      : "";

    const activeIconStyles = active && variant === "icon" ? "!bg-nest-btn !text-white" : "";
    const loadingStyles = loading ? "opacity-70 pointer-events-none cursor-not-allowed" : "";
    const finalClassName = cn(baseClasses, activeStyles, activeIconStyles, loadingStyles);

    const content = (
      <span className="inline-flex items-center justify-center">
        {loading ? (
          <span className="flex items-center gap-2">
            <Spinner />
            {loadingText ?? children}
          </span>
        ) : (
          children
        )}
      </span>
    );

    // This is the key: we check for the 'href' discriminator
    if ("href" in props && props.href !== undefined) {
      const { href, ...rest } = props;
      return (
        <Link
          href={loading ? "#" : href}
          className={finalClassName}
          aria-disabled={loading}
          onClick={loading ? (e) => e.preventDefault() : rest.onClick}
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          {...rest} // `rest` is now guaranteed to only have AnchorHTMLAttributes
        >
          {content}
        </Link>
      );
    }

    const Comp = asChild ? Slot : "button";
    const { ...rest } = props;
    return (
      <Comp
        className={finalClassName}
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        aria-busy={loading}
        disabled={rest.disabled || loading}
        {...rest} // `rest` is now guaranteed to only have ButtonHTMLAttributes
      >
        {content}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

// import Link from "next/link";
// import * as React from "react";

// import { Slot } from "@radix-ui/react-slot";
// import { cn } from "@workspace/ui/lib/utils";
// import { cva, type VariantProps } from "class-variance-authority";

// const buttonVariants = cva(
//   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
//   {
//     variants: {
//       variant: {
//         default: "bg-primary text-primary-foreground hover:bg-primary/90",
//         destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
//         outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
//         secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
//         ghost: "hover:bg-accent hover:text-accent-foreground",
//         link: "text-primary underline-offset-4 hover:underline",
//       },
//       size: {
//         default: "h-10 px-4 py-2",
//         sm: "h-9 rounded-md px-3",
//         lg: "h-11 rounded-md px-8",
//         icon: "h-10 w-10",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   },
// );

// type BaseProps = VariantProps<typeof buttonVariants> & {
//   asChild?: boolean;
//   children?: React.ReactNode;
//   className?: string;
// };

// // Props if the component is a BUTTON
// type ButtonAsButton = BaseProps &
//   Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
//     href?: never;
//   };

// // Props if the component is a LINK
// type ButtonAsLink = BaseProps &
//   Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
//     href: string;
//   };

// // The final discriminated union
// export type ButtonProps = ButtonAsButton | ButtonAsLink;

// const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(({ asChild = false, ...props }, ref) => {
//   const buttonClasses = cn(
//     buttonVariants({
//       variant: "variant" in props ? props.variant : "default",
//       size: "size" in props ? props.size : "default",
//       className: "className" in props ? props.className : "",
//     }),
//   );

//   // This is the key: we check for the 'href' discriminator
//   if ("href" in props && props.href !== undefined) {
//     const { href, ...rest } = props;
//     return (
//       <Link
//         href={{ pathname: href }}
//         className={buttonClasses}
//         ref={ref as React.ForwardedRef<HTMLAnchorElement>}
//         {...rest} // `rest` is now guaranteed to only have AnchorHTMLAttributes
//       />
//     );
//   }

//   const Comp = asChild ? Slot : "button";
//   const { ...rest } = props;
//   return (
//     <Comp
//       className={buttonClasses}
//       ref={ref as React.ForwardedRef<HTMLButtonElement>}
//       {...rest} // `rest` is now guaranteed to only have ButtonHTMLAttributes
//     />
//   );
// });
// Button.displayName = "Button";

// export { Button, buttonVariants };
