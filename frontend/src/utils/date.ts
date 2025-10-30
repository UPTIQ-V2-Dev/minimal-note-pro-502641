import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';

export const formatRelativeDate = (dateString: string): string => {
    const date = new Date(dateString);

    if (isToday(date)) {
        return `Today at ${format(date, 'h:mm a')}`;
    }

    if (isYesterday(date)) {
        return `Yesterday at ${format(date, 'h:mm a')}`;
    }

    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 7) {
        return `${formatDistanceToNow(date, { addSuffix: true })}`;
    }

    return format(date, 'MMM d, yyyy');
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
};

export const formatShortDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, 'MMM d');
};
