import React, { useState } from "react";

import AuthService from "../services/auth.service";


const Home = (props) => {
    const [user, setUser] = useState(AuthService.getCurrentUser());
    return (
        <div className="container">
            <header className="jumbotron">
                <h3>{user ? `Hello, general ${user['username']}!` : <>
                    <p>Hi, hi, hi, there!</p>
                    <p>Welly, welly, welly, welly, welly, welly, well!</p>
                    <p>To what do I owe the extreme pleasure of this surprising visit?</p>
                </>} </h3>
            </header>
        </div>
    )
}


export default Home;