import { toaster } from "@components/ui/toaster";
import { useEffect } from "react";
import { useLocation } from "react-router"

const ToasterReseter = () => {
    const loc = useLocation().pathname;
    useEffect(() => {
        // Use a small delay or a microtask to avoid flushSync warning
        // during React's rendering phase
        const timeout = setTimeout(() => {
            toaster.dismiss();
        }, 0);
        return () => clearTimeout(timeout);
    }, [loc])
    return null;
}

export default ToasterReseter;