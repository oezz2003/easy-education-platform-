'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

export default function Card({
    children,
    className,
    hover = true,
    padding = 'md',
    onClick,
}: CardProps) {
    const paddingSizes = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <motion.div
            whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className={cn(
                'bg-white dark:bg-gray-900',
                'rounded-[var(--radius-xl)]',
                'border border-gray-100 dark:border-gray-800',
                'shadow-[var(--shadow-md)]',
                hover && 'cursor-pointer hover:shadow-[var(--shadow-xl)]',
                'transition-shadow duration-200',
                paddingSizes[padding],
                className
            )}
        >
            {children}
        </motion.div>
    );
}

// Card Header
interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
    return (
        <div className={cn('mb-4', className)}>
            {children}
        </div>
    );
}

// Card Image
interface CardImageProps {
    src: string;
    alt: string;
    className?: string;
}

export function CardImage({ src, alt, className }: CardImageProps) {
    return (
        <div className={cn('relative overflow-hidden rounded-[var(--radius-lg)] -mx-6 -mt-6 mb-4', className)}>
            <img
                src={src}
                alt={alt}
                loading="lazy"
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            />
        </div>
    );
}

// Card Content
interface CardContentProps {
    children: ReactNode;
    className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
    return (
        <div className={cn('', className)}>
            {children}
        </div>
    );
}

// Card Footer
interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
    return (
        <div className={cn('mt-4 pt-4 border-t border-gray-100 dark:border-gray-800', className)}>
            {children}
        </div>
    );
}
