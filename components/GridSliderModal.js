import React, { useEffect, useState } from "react";
import DesktopModal from "./DesktopModal";
import MobileModal from "./MobileModal";

const GridSliderModal = ({ post, onClose }) => {
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 768);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            {isLargeScreen ? (
                <DesktopModal post={post} onClose={onClose} />
            ) : (
                <MobileModal post={post} onClose={onClose} />
            )}
        </>
    );
};

export default GridSliderModal;
