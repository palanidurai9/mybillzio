import React from 'react';
import { Loader2 } from 'lucide-react';
import styles from './ui.module.css';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={clsx(
                    styles.button,
                    variant === 'primary' ? styles.buttonPrimary : styles.buttonSecondary,
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="animate-spin mr-2" size={18} />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";
