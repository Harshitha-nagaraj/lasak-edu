/**
 * Normalizes an image source path to ensure it works correctly across all routes.
 * Handles absolute URLs, root-relative paths, and relative paths.
 */
export const normalizeImagePath = (src: string | undefined | null): string => {
    if (!src || typeof src !== 'string') return '';

    const trimmedSrc = src.trim();
    if (!trimmedSrc) return '';

    // 1. If it's an absolute URL (http/https) or data URI, return as is
    if (
        trimmedSrc.startsWith('http') ||
        trimmedSrc.startsWith('https://') ||
        trimmedSrc.startsWith('data:') ||
        trimmedSrc.startsWith('blob:')
    ) {
        return trimmedSrc;
    }

    // 2. Ensure it starts with /
    let path = trimmedSrc.startsWith('/') ? trimmedSrc : `/${trimmedSrc}`;

    // 3. Match strict filesystem normalization if it's a local /img path
    if (path.startsWith('/img/')) {
        const parts = path.split('/');
        const filename = parts.pop() || '';
        const directory = parts.join('/');

        const dotIndex = filename.lastIndexOf('.');
        if (dotIndex > 0) {
            const name = filename.substring(0, dotIndex);
            const ext = filename.substring(dotIndex).toLowerCase();

            // Replicate strict_normalize.ps1 logic
            const normalizedName = name.toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');

            return `${directory}/${normalizedName}${ext}`;
        }
    }

    return encodeURI(path);
};
