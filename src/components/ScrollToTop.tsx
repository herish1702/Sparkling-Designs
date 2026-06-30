import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * React Router doesn't reset scroll position on navigation by default.
 * Mounted once near the top of the app, this scrolls to the top of the
 * page every time the route (pathname) changes - e.g. clicking "Admin"
 * in the footer, or "View Details" on a product card.
 */
export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }, [pathname]);

    return null;
}
