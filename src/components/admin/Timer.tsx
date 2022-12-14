import { useEffect, useState } from 'react'
import { ClockLoader } from "react-spinners";
import "../../styles.css";

/**
 * Component for displaying countdown on admin result screen
 *
 * @ author Natali Munk-Jakobsen
 */

interface Props {
    count: number;
    setShowTimer: React.Dispatch<React.SetStateAction<boolean>>
    isQuestion: boolean
}

const Timer = ({ count, setShowTimer, isQuestion }: Props) => {
    const [counter, setCounter] = useState(count);

    useEffect(() => {
        if (counter > 0) {
            setTimeout(() => setCounter(counter - 1), 1000);
        } else {
            setCounter(0)
            setTimeout(() => setShowTimer(false), 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [counter]);

    return (
        <>
            {!isQuestion ? (<div className='waiting-container'>
                <ClockLoader color="var(--color-pink)" size={120} speedMultiplier={1} />
                <div className='waiting-container__text' style={{ "color": "var(--color-pink)", "fontSize": "80px" }}>{counter}</div>
            </div>) : (<div className='waiting-container-small'>
                <ClockLoader color="var(--color-pink)" size={120} speedMultiplier={1} />
                <div className='waiting-container__text' style={{ "color": "var(--color-pink)", "fontSize": "80px" }}>{counter}</div>
            </div>)}
        </>
    )
}

export default Timer