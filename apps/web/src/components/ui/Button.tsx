import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full transition-all duration-150 ease-out font-medium active:scale-95 transform will-change-transform disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-nest-btn text-white hover:bg-neutral-800 shadow-md hover:shadow-lg",
        secondary:
          "bg-white text-nest-text hover:bg-gray-100 border border-transparent",
        icon: "bg-white text-nest-text hover:bg-gray-100 shadow-sm border border-transparent",
        outline:
          "border border-gray-300 text-nest-text hover:bg-gray-50 hover:text-black",
      },
      size: {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
        icon: "w-10 h-10 p-0 flex items-center justify-center",
      },
      active: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        active: true,
        variant: ["primary", "secondary", "outline"],
        className:
          "bg-nest-btn text-white shadow-md ring-2 ring-offset-2 ring-gray-200",
      },
      {
        active: true,
        variant: "icon",
        className: "!bg-nest-btn !text-white",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      active: false,
    },
  }
);

type BaseProps = VariantProps<typeof buttonVariants> & {
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
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

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(({ asChild = false, ...props }, ref) => {
  const { variant, size, active, className, ...restProps } = props;

  const buttonClasses = cn(
    buttonVariants({
      variant,
      size,
      active,
      className,
    })
  );

  // This is the key: we check for the 'href' discriminator
  if ("href" in props && props.href !== undefined) {
    // Destructure href out of restProps to avoid passing it as an attribute if necessary,
    // although react-router-dom Link handles props gracefully.
    // We cast to any to pull href out of the rest parameters which might be typed as ButtonAsLink
    const { href: _href, ...linkProps } = restProps as any;

    return (
      <Link
        to={props.href}
        className={buttonClasses}
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        {...linkProps}
      />
    );
  }

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={buttonClasses}
      ref={ref as React.ForwardedRef<HTMLButtonElement>}
      {...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
});
Button.displayName = "Button";

export default Button;
export { buttonVariants };
// import React from 'react';

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: 'primary' | 'secondary' | 'icon' | 'outline';
//   size?: 'sm' | 'md' | 'lg' | 'icon';
//   active?: boolean;
// }

// const Button: React.FC<ButtonProps> = ({
//   children,
//   variant = 'primary',
//   size = 'md',
//   active = false,
//   className = '',
//   ...props
// }) => {
//   // Use duration-150 for a snappier response, active:scale-95 for the bounce
//   const baseStyles = "inline-flex items-center justify-center rounded-full transition-all duration-150 ease-out font-medium active:scale-95 transform will-change-transform disabled:opacity-50 disabled:pointer-events-none";

//   const variants = {
//     primary: "bg-nest-btn text-white hover:bg-neutral-800 shadow-md hover:shadow-lg",
//     secondary: "bg-white text-nest-text hover:bg-gray-100 border border-transparent",
//     icon: "bg-white text-nest-text hover:bg-gray-100 shadow-sm border border-transparent",
//     outline: "border border-gray-300 text-nest-text hover:bg-gray-50"
//   };

//   const activeStyles = active ? "bg-nest-btn text-white shadow-md ring-2 ring-offset-2 ring-gray-200" : "";
//   const activeIconStyles = active && variant === 'icon' ? "!bg-nest-btn !text-white" : "";

//   const sizes = {
//     sm: "px-4 py-2 text-xs",
//     md: "px-6 py-3 text-sm",
//     lg: "px-8 py-4 text-base",
//     icon: "w-10 h-10 p-0 flex items-center justify-center" // Standardized icon size
//   };

//   return (
//     <button
//       className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${activeStyles} ${activeIconStyles} ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// export default Button;

// import { Slot } from "@radix-ui/react-slot";
// import { cn } from "@workspace/ui/lib/utils";
// import { cva, type VariantProps } from "class-variance-authority";
// import Link from "next/link";
// import * as React from "react";

// const buttonVariants = cva(
//   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
//   {
//     variants: {
//       variant: {
//         default: "bg-primary text-primary-foreground hover:bg-primary/90",
//         destructive:
//           "bg-destructive text-destructive-foreground hover:bg-destructive/90",
//         outline:
//           "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
//         secondary:
//           "bg-secondary text-secondary-foreground hover:bg-secondary/80",
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
//   }
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

// const Button = React.forwardRef<
//   HTMLButtonElement | HTMLAnchorElement,
//   ButtonProps
// >(({ asChild = false, ...props }, ref) => {
//   const buttonClasses = cn(
//     buttonVariants({
//       variant: "variant" in props ? props.variant : "default",
//       size: "size" in props ? props.size : "default",
//       className: "className" in props ? props.className : "",
//     })
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
// export default Button;
// export { buttonVariants };
