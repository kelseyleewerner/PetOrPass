import {useAuth} from "../services/AuthService";
import React from "react";
import catImage from "../assets/nicecate.jpg";

export function Login() {
    const { logIn } = useAuth();

    return (
        <main className="below-navbar container">
            <div className="row justify-content-center align-items-center">
                <div className="top col-12 col-md-9 col-lg-6 col-xl-5">
                    <img src={catImage}
                         className="img-fluid"
                         alt="Photo of a white cat"
                    />
                </div>
                <div className="col col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                    <div className="row align-items-center justify-content-center mt-4">
                        <h1 className="display-4 lead fw-normal text-center">Pet or Pass</h1>
                    </div>
                    <div className="row align-items-center justify-content-center mt-4">
                        <p className="text-center fw-bold">Create an account and login to view and rate pets! Will you pet them or will you take a pass?</p>
                    </div>
                    <div className="row align-items-center justify-content-center mb-2">
                        <p className="text-center">Reminder: You must sign up with a functional email address to allow password reset if you forget your password</p>
                    </div>
                    <div className="row justify-content-center align-items-center my-4">
                        <button className="btn btn-lg button-color w-100" onClick={() => logIn()}>Enter Site!</button>
                    </div>
                </div>
            </div>
        </main>
    );
};

