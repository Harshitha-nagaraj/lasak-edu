import { Query, DocumentData } from 'firebase/firestore';

const CACHE_EXPIRATION_MS = 1000; // 1 second (Prevents immediate repeated requests but allows fast updates)

export const fetchWithCache = async (
    cacheKey: string,
    firestoreQuery: Query<DocumentData, DocumentData>,
    expirationMs: number = CACHE_EXPIRATION_MS,
    transformFn?: (data: any) => any
) => {
    try {
        // 1. Check local storage cache
        const cachedItem = localStorage.getItem(cacheKey);
        if (cachedItem) {
            const parsed = JSON.parse(cachedItem);

            if (parsed?.data && parsed?.timestamp) {
                const now = Date.now();

                // If cache hasn't expired, return it
                if (now - parsed.timestamp < expirationMs) {
                    return parsed.data; // returns array of documents
                }
            }
        }
    } catch (error) {
        console.warn(`Error reading/parsing from localStorage for key ${cacheKey}:`, error);
    }

    // 2. Fetch from Firestore if no valid cache
    try {
        const { getDocs } = await import('firebase/firestore');
        const querySnapshot = await getDocs(firestoreQuery);
        const results = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const document = { id: doc.id, ...data };
            return transformFn ? transformFn(document) : document;
        });

        // 3. Save to local storage cache
        try {
            localStorage.setItem(cacheKey, JSON.stringify({
                data: results,
                timestamp: new Date().getTime()
            }));
        } catch (storageError) {
            console.warn(`Error writing to localStorage for key ${cacheKey}. Storage might be full:`, storageError);
        }

        return results;
    } catch (error) {
        console.error(`Error fetching from Firestore for query associated with cacheKey ${cacheKey}:`, error);
        throw error;
    }
};

export const clearCache = (cacheKey: string) => {
    try {
        localStorage.removeItem(cacheKey);
    } catch (error) {
        console.warn(`Error clearing cache for key ${cacheKey}:`, error);
    }
};

export const invalidateAllCache = () => {
    try {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('cache_')) {
                localStorage.removeItem(key);
            }
        });
    } catch (error) {
        console.warn('Error invalidating all caches:', error);
    }
};
