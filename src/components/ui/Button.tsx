'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import * as React from 'react';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { useHaptic } from '@/lib/hooks/useHaptic';
import { cn } from '@/lib/utils';

type HapticPreset = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'error' | 'warning';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90 btn-interactive',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 btn-interactive',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground btn-interactive',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 btn-interactive',
        ghost: 'hover:bg-accent hover:text-accent-foreground transition-colors',
        link: 'text-primary underline-offset-4 hover:underline transition-colors',
        hero: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:from-blue-500 hover:to-indigo-500 btn-interactive',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
        hero: 'h-14 px-10 py-4 rounded-xl text-lg font-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const defaultHapticByVariant: Record<string, HapticPreset> = {
  default: 'medium',
  destructive: 'medium',
  hero: 'medium',
  outline: 'light',
  secondary: 'light',
};

async function waitForCallback(
  callback: () => void | Promise<void>,
  timeoutMs: number
): Promise<void> {
  return Promise.race([
    Promise.resolve(callback()).catch(() => {}),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}

type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
  haptic?: HapticPreset | false;
};

type ButtonElementProps = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
    href?: undefined;
    external?: undefined;
    onNavigate?: undefined;
    onNavigateTimeout?: undefined;
  };

type InternalLinkProps = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string;
    external?: false;
    asChild?: undefined;
    onNavigate?: () => void | Promise<void>;
    onNavigateTimeout?: undefined;
  };

type ExternalLinkProps = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string;
    external: true;
    asChild?: undefined;
    onNavigate?: () => void | Promise<void>;
    onNavigateTimeout?: number;
  };

export type ButtonProps = ButtonElementProps | InternalLinkProps | ExternalLinkProps;

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const { haptic } = useHaptic();
    const [showLoader, setShowLoader] = React.useState(false);

    const { className, variant, size, haptic: hapticProp, ...rest } = props;

    const resolvedPreset =
      hapticProp === false
        ? undefined
        : (hapticProp ?? defaultHapticByVariant[variant ?? 'default']);

    const classes = cn(buttonVariants({ variant, size, className }));

    // --- Internal link mode ---
    if (rest.href != null && !rest.external) {
      const {
        href,
        external: _external,
        asChild: _asChild,
        onNavigate,
        onNavigateTimeout: _onNavigateTimeout,
        onClick,
        ...linkProps
      } = rest as InternalLinkProps & { onClick?: React.MouseEventHandler<HTMLAnchorElement> };

      const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (resolvedPreset) haptic(resolvedPreset);
        if (onNavigate) {
          // Fire-and-forget — don't block navigation
          Promise.resolve(onNavigate()).catch(() => {});
        }
        onClick?.(e);
      };

      return (
        <Link
          href={href}
          className={classes}
          ref={ref as React.Ref<HTMLAnchorElement>}
          onClick={handleClick}
          {...linkProps}
        />
      );
    }

    // --- External link mode ---
    if (rest.href != null && rest.external) {
      const {
        href,
        external: _external,
        asChild: _asChild,
        onNavigate,
        onNavigateTimeout = 2000,
        onClick,
        target,
        ...anchorProps
      } = rest as ExternalLinkProps & { onClick?: React.MouseEventHandler<HTMLAnchorElement> };

      const isSameTab = target === '_self';

      const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (resolvedPreset) haptic(resolvedPreset);

        if (isSameTab && onNavigate) {
          // Same-tab external: show loader, await callback with timeout, then navigate
          e.preventDefault();
          setShowLoader(true);
          waitForCallback(onNavigate, onNavigateTimeout).then(() => {
            window.location.href = href;
          });
        } else if (onNavigate) {
          // New-tab external: fire-and-forget
          Promise.resolve(onNavigate()).catch(() => {});
        }

        onClick?.(e);
      };

      return (
        <>
          <a
            href={href}
            className={classes}
            ref={ref as React.Ref<HTMLAnchorElement>}
            onClick={handleClick}
            target={isSameTab ? '_self' : '_blank'}
            rel={isSameTab ? undefined : 'noopener noreferrer'}
            {...anchorProps}
          />
          {showLoader && <FullScreenLoader show />}
        </>
      );
    }

    // --- Regular button mode ---
    const {
      asChild = false,
      external: _external,
      onNavigate: _onNavigate,
      onNavigateTimeout: _onNavigateTimeout,
      onClick,
      ...buttonProps
    } = rest as ButtonElementProps & { onClick?: React.MouseEventHandler<HTMLButtonElement> };

    const Comp = asChild ? Slot : 'button';

    const handleClick =
      !resolvedPreset && !onClick
        ? undefined
        : !resolvedPreset
          ? onClick
          : (e: React.MouseEvent<HTMLButtonElement>) => {
              haptic(resolvedPreset);
              onClick?.(e);
            };

    return (
      <Comp
        className={classes}
        ref={ref as React.Ref<HTMLButtonElement>}
        onClick={handleClick}
        {...buttonProps}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
