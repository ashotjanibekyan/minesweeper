import React, { useState, useEffect } from 'react';

let _time = 0;
const _timer = setInterval(() => {
    _time+=1;
}, 1000);
export default (props) => {
    const [time, setTime] = useState(0);
    useEffect(() => {
        if (!props.gameOver) {
            const timer = setInterval(() => {
                setTime(_time);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            props.submitResults(_time);
            clearInterval(_timer);
        }
    });
    return <h3 className="text-center">{_time} seconds</h3>;
}