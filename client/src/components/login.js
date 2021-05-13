import React, { useState } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const Login = (props) => {
    const [data, setData] = useState({
        username: "",
        password: "",
        loading: false,
        message: ""
    });
    const [checkButton, setCheckButton] = useState(undefined);
    const [form, setForm] = useState(undefined);
    const handleLogin = (e) => {
        e.preventDefault();

        setData({
            ...data,
            message: "",
            loading: true
        });

        form.validateAll();

        if (checkButton.context._errors.length === 0) {
            AuthService.login(data.username, data.password).then(
                () => {
                    console.log('uqwiefhweuifh')
                    window.location.replace('./new');
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setData({
                        ...data,
                        loading: false,
                        message: resMessage
                    });
                }
            );
        } else {
            setData({
                ...data,
                loading: false
            });
        }
    };

    return (
        <div className="col-md-12">
            <div className="card card-container">
                <img
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    alt="profile-img"
                    className="profile-img-card"
                />

                <Form
                    onSubmit={handleLogin}
                    ref={c => {
                        setForm(c);
                    }}
                >
                    <div className="form-group">
                        <label htmlFor="username">Username or email</label>
                        <Input
                            type="text"
                            className="form-control"
                            name="username"
                            value={data.username}
                            onChange={e => setData({ ...data, username: e.target.value })}
                            validations={[required]}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <Input
                            type="password"
                            className="form-control"
                            name="password"
                            value={data.password}
                            onChange={e => setData({ ...data, password: e.target.value })}
                            validations={[required]}
                        />
                    </div>

                    <div className="form-group">
                        <button
                            className="btn btn-primary btn-block"
                            disabled={data.loading}
                        >
                            {data.loading && (
                                <span className="spinner-border spinner-border-sm"></span>
                            )}
                            <span>Login</span>
                        </button>
                    </div>

                    {data.message && (
                        <div className="form-group">
                            <div className="alert alert-danger" role="alert">
                                {data.message}
                            </div>
                        </div>
                    )}
                    <CheckButton
                        style={{ display: "none" }}
                        ref={c => {
                            setCheckButton(c);
                        }}
                    />
                </Form>
            </div>
        </div>
    );
}

export default Login;