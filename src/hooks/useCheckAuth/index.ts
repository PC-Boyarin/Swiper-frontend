import {useEffect, useState} from "react";
import {checkAuthenticated} from "../../api/user.ts";

export default function useCheckAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await checkAuthenticated();
                setUserId(response?.data?.user?.id);
                setIsLoggedIn(response?.data?.authenticated ?? false);
            } catch (error) {
                console.error('Auth check failed', error);
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    return { isLoggedIn, isLoading, userId };
}