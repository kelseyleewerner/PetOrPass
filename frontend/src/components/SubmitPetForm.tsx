import {ChangeEvent, MouseEvent, useRef, useState} from 'react';
import React from "react";
import axios from 'axios';
import {useAuth, User} from "../services/AuthService";

export function SubmitPetForm() {
    const {getUser} = useAuth();
    let [petName, setPetName] = useState('');
    let [petImage, setPetImage] = useState(null);
    let [submitSuccess, setSubmitSuccess] = useState(false);
    let [submitError, setSubmitError] = useState(false);
    let [disableButton, setDisableButton] = useState(false);
    const imageInputField = useRef(null);

    const onChangePetName = (event: ChangeEvent<HTMLInputElement>) => {
        setPetName(event.target.value);
        setSubmitError(false);
    }

    const onChangePetImage = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files ===  null) {
            setSubmitError(true);
        } else {
            setPetImage(event.target.files[0]);
            setSubmitError(false);
        }
    }

    const onSubmitPet = async(event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setDisableButton(true);

        // If user is authenticated, we can call protected backend route to submit pet form
        // If user is not authenticated, log out and redirect to login page
        const user: User = await getUser();

        if (user.success) {
            const formData = new FormData();
            formData.append("petName", petName);
            formData.append("submittedBy", user.email);
            formData.append("petImageFile", petImage);

            const uri = `http://${import.meta.env.VITE_BACKEND_IP}:${import.meta.env.VITE_BACKEND_PORT}/pet`;
            let success = true;
            try {
                await axios({
                    method: "post",
                    url: uri,
                    data: formData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${user.token}`
                    }
                })
                // TODO: need comment explaining why this has an any type
            } catch(err: any) {
                // If backend route returns an error, display error message to user
                setSubmitError(true);
                success = false;
            }

            // If form is submitted successfully, clear form data and display success message to user
            setSubmitSuccess(success);
            setPetName('');
            setPetImage(null);
            imageInputField.current.value = '';
            setDisableButton(false);
        }
    }

    return (
        <form className="container below-navbar">
            <div className="row text-center">
                <h1>Submit Your Pet!</h1>
            </div>
            <div className="row text-center">
                <legend>Submit an image of your pet to be rated by other users</legend>
            </div>
            {submitSuccess ? <SubmitSuccessMessage/> : null}
            {submitError ? <SubmitErrorMessage/> : null}
            <div className="row mt-3 justify-content-center">
                <div className="col-xl-4 col-md-6 col-sm-8 col-10">
                    <label className="form-label" htmlFor="petNameInput">Pet Name</label>
                    <input className="form-control"
                           onChange={pn => onChangePetName(pn)}
                           value={petName}
                           type="text"
                           id="petNameInput"
                           name="petNameInput"
                    />
                </div>
            </div>
            <div className="row mt-3 justify-content-center">
                <div className="col-xl-4 col-md-6 col-sm-8 col-10">
                    <label className="form-label" htmlFor="petImageInput">Upload Pet Image</label>
                    <input className="form-control"
                           type="file"
                           id="petImageInput"
                           name="petImageInput"
                           accept="image/*"
                           ref={imageInputField}
                           onChange={pi => onChangePetImage(pi)}
                    />
                </div>
            </div>
            <div className="row mt-5 justify-content-center">
                <div className="col-xl-4 col-md-6 col-sm-8 col-10">
                    <button className="btn btn-lg button-color w-100"
                            onClick={sp => onSubmitPet(sp)}
                            type="submit"
                            disabled={disableButton || petName === '' || petImage === null || imageInputField.current.value === ''}>
                        Submit!
                    </button>
                </div>
            </div>
        </form>
    );
}

function SubmitSuccessMessage() {
    return (
      <div className="row text-center mt-3 success-text">
          <p><strong>Success! Thanks for submitting your pet &#60;3</strong></p>
      </div>
    );
}

function SubmitErrorMessage() {
    return (
        <div className="row text-center mt-3 error-text">
            <p><strong>uh oh! Looks like something went wrong! Try re-submitting with a different pet name and/or image</strong></p>
        </div>
    );
}
