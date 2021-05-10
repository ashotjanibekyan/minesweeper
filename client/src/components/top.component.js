import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const Top = () => {
    const [data, setData] = useState([]);

    const getData = async () => {
        const { data } = await axios.get('http://localhost:8080/api/top');
        setData(data);
    };

    useEffect(() => {
        getData();
    }, []);

    const getDataAsReactElement = () => {
        return (!data.data) ? null : (
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
        );
    }
    return <table className="table">{getDataAsReactElement()}</table>
}

export default Top;