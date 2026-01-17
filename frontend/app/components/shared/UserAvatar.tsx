import { User } from 'lucide-react';

interface UserAvatarProps {
    src?: string | null;
    name: string;
    className?: string;
}

export function UserAvatar({ src, name, className = '' }: UserAvatarProps) {
    const initials = name
        ? name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : '';

    // Filter out pravatar and other placeholders if needed
    const validSrc = src && !src.includes('pravatar.cc') ? src : null;

    if (validSrc) {
        return (
            <img
                src={validSrc}
                alt={name}
                className={`object-cover ${className}`}
            />
        );
    }

    return (
        <div className={`flex items-center justify-center bg-emerald-100 text-emerald-700 font-medium ${className}`}>
            {initials || <User className="w-1/2 h-1/2" />}
        </div>
    );
}
