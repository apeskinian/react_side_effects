import { useEffect, useState } from "react";

export default function ProgressBar({ timer }) {
    const [remainingTime, setRemainingTime] = useState(timer);

    // using useEffect to show progress on the timer bar
    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime(prevTime => prevTime - 10)
        }, 10);
        // the blank dependency means the interval will be stopped when the component
        // is removed from the DOM
        return () => {
            clearInterval(interval)
        }
    }, []);

    return <progress value={remainingTime} max={timer} />
}