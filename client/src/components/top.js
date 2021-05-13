import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const Top = () => {
    const [data, setData] = useState([]);
    const [level, setLevel] = useState('medium');

    const getData = async () => {
        const { data } = await axios.get(`http://localhost:8080/api/top?level=${level}`);
        setData(data);
    };

    useEffect(() => {
        getData();
    }, [level]);

    const getDataAsReactElement = () => {
        return (
            (!data.data) ? null : (
                <tbody>
                    <tr>
                        <th>Username</th>
                        <th>Seconds</th>
                        <th>Level</th>
                        <th>Time</th>
                    </tr>
                    {data.data.map(el => {
                        return (
                            <tr key={uuidv4()}>
                                {Object.entries(el).map((field) => {
                                    return <td key={uuidv4()}>{field[1]}</td>
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            )
        );
    }
    return (
        <div>
            <select className="form-select" onChange={e => {
                console.log(level)
                setLevel(e.target.value)
            }} defaultValue="medium">
                <option value="easy">Easy</option>
                <option value="medium">Meduim</option>
                <option value="hard">Hard</option>
            </select>
            <table className="table">{getDataAsReactElement()}</table>
        </div>
    )

}

export default Top;