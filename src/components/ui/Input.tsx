import React from 'react';
import styles from './ui.module.css';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, id, ...props }, ref) => {
        return (
            <div className={styles.inputWrapper}>
                {label && <label htmlFor={id} className={styles.label}>{label}</label>}
                <input
                    ref={ref}
                    id={id}
                    className={clsx(styles.input, className)}
                    {...props}
                />
            </div>
        );
    }
);
Input.displayName = "Input";
