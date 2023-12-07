import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { ErrorMessage } from "./ErrorMessage";
import { useAuth, User } from "../services/AuthService";

export function RatePet() {
  const { getUser, logOut } = useAuth();
  let [retrieveNextPet, setRetrieveNextPet] = useState(false);
  let [emptyPets, setEmptyPets] = useState(false);
  let [petToRate, setPetToRate] = useState({});
  let [nextPet, setNextPet] = useState(false);
  let [disableRatingButtons, setDisableRatingButtons] = useState(false);
  let [disableNextButton, setDisableNextButton] = useState(false);
  let [newScore, setNewScore] = useState(0);

  useEffect(() => {
    // If user is authenticated, we can call protected backend route to retrieve a pet to rate
    // If user is not authenticated, log out and redirect to login page

    const getPet = async () => {
      const user: User = await getUser();

      if (user.success) {
        let result;
        try {
          result = await axios.get(
            `http://${import.meta.env.VITE_BACKEND_IP}:${
              import.meta.env.VITE_BACKEND_PORT
            }/pet`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          // Catching any type to ensure catching all possible errors
        } catch (err: any) {
          // Upon encountering an unidentified server error, the user will be logged out and returned to login page
          if (err.response) {
            // If no pets have been submitted by any users, then the page will display an empty state
            if (
              err.response.status === 404 &&
              err.response.data.hasOwnProperty("error") &&
              err.response.data.error ===
                "No pets have been added to the Pets table"
            ) {
              setEmptyPets(true);
            } else {
              logOut();
            }
          } else {
            logOut();
          }

          return;
        }

        // Upon successful reply from server, display pet to the user for rating
        const pet = {
          petId: result.data.pet_id,
          petName: result.data.pet_name,
          imageUrl: result.data.image_name,
        };

        setPetToRate(pet);
        setEmptyPets(false);
        setNextPet(false);
        setDisableRatingButtons(false);
        setDisableNextButton(false);
      }
    };

    getPet();
  }, [retrieveNextPet]);

  return (
    <>
      {emptyPets ? (
        <ErrorMessage errorMessage="uh-oh! Looks like no one has submitted any pets yet for rating! You can be the first by visiting the Submit Pet tab." />
      ) : (
        <main className="container below-navbar">
          <div className="row text-center">
            <h1>Rate This Pet!</h1>
          </div>
          <div className="row text-center mb-4">
            <legend>Would you pet it or will you take a pass?</legend>
          </div>
          {Object.keys(petToRate).length === 0 ? (
            <></>
          ) : (
            <RatePetView
              petName={petToRate.petName}
              imageUrl={petToRate.imageUrl}
              setNextPet={setNextPet}
              setRetrieveNextPet={setRetrieveNextPet}
              retrieveNextPet={retrieveNextPet}
              nextPet={nextPet}
              setDisableRatingButtons={setDisableRatingButtons}
              disableRatingButtons={disableRatingButtons}
              setDisableNextButton={setDisableNextButton}
              disableNextButton={disableNextButton}
              petId={petToRate.petId}
              newScore={newScore}
              setNewScore={setNewScore}
            />
          )}
        </main>
      )}
    </>
  );
}

export type RatePetProps = {
  petName: string;
  imageUrl: string;
  setNextPet: () => void;
  setRetrieveNextPet: () => void;
  retrieveNextPet: boolean;
  nextPet: boolean;
  setDisableRatingButtons: () => void;
  disableRatingButtons: boolean;
  setDisableNextButton: () => void;
  disableNextButton: boolean;
  petId: number;
  newScore: number;
  setNewScore: () => void;
};

function RatePetView(props: RatePetProps) {
  let {
    petName,
    imageUrl,
    setRetrieveNextPet,
    setNextPet,
    retrieveNextPet,
    nextPet,
    setDisableRatingButtons,
    disableRatingButtons,
    setDisableNextButton,
    disableNextButton,
    petId,
    newScore,
    setNewScore,
  } = props;

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6 col-md-8 col-12 text-center ">
        <img
          src={imageUrl}
          alt="Image of a pet to rate"
          className="img-fluid"
        />
      </div>
      <div className="row text-center mt-4">
        <legend>{petName}</legend>
      </div>
      <>
        {nextPet ? (
          <DisplayPetRating
            setRetrieveNextPet={setRetrieveNextPet}
            retrieveNextPet={retrieveNextPet}
            setDisableNextButton={setDisableNextButton}
            disableNextButton={disableNextButton}
            newScore={newScore}
          />
        ) : (
          <RatePetButtons
            setNextPet={setNextPet}
            setDisableRatingButtons={setDisableRatingButtons}
            disableRatingButtons={disableRatingButtons}
            petId={petId}
            setNewScore={setNewScore}
          />
        )}
      </>
    </div>
  );
}

export type RatePetButtonsProps = {
  setNextPet: () => void;
  setDisableRatingButtons: () => void;
  disableRatingButtons: boolean;
  petId: petId;
  setNewScore: () => void;
};

function RatePetButtons(props: RatePetButtonsProps) {
  let {
    setNextPet,
    setDisableRatingButtons,
    disableRatingButtons,
    petId,
    setNewScore,
  } = props;
  const { getUser, logOut } = useAuth();

  const onClickRatingButton = async (event, rating: number) => {
    setDisableRatingButtons(true);

    // If user is authenticated, we can call protected backend route to update pet's score after being rated
    // If user is not authenticated, log out and redirect to login page
    const user: User = await getUser();
    if (user.success) {
      let result;
      try {
        result = await axios.put(
          `http://${import.meta.env.VITE_BACKEND_IP}:${
            import.meta.env.VITE_BACKEND_PORT
          }/pet-score`,
          {
            petId: petId,
            petRating: rating,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
      } catch (err) {
        // If backend route returns an error, the user will be logged out and returned to login page
        logOut();
      }

      setNewScore(result.data.avgScore);
      setNextPet(true);
    }
  };

  return (
    <div className="row mt-4 mb-5 justify-content-center">
      <div className="col-6 col-md-4 col-lg-3 col-xl-2">
        <button
          className="btn btn-lg button-color w-100"
          type="submit"
          onClick={(e) => onClickRatingButton(e, 10)}
          disabled={disableRatingButtons}
        >
          Pet
        </button>
      </div>
      <div className="col-6 col-md-4 col-lg-3 col-xl-2">
        <button
          className="btn btn-lg button-color w-100"
          type="submit"
          onClick={(e) => onClickRatingButton(e, 0)}
          disabled={disableRatingButtons}
        >
          Pass
        </button>
      </div>
    </div>
  );
}

export type DisplayPetRatingProps = {
  setRetrieveNextPet: () => void;
  retrieveNextPet: boolean;
  setDisableNextButton: () => void;
  disableNextButton: boolean;
  newScore: number;
};

function DisplayPetRating(props: DisplayPetRatingProps) {
  let {
    setRetrieveNextPet,
    retrieveNextPet,
    setDisableNextButton,
    disableNextButton,
    newScore,
  } = props;

  const onClickNextButton = (event) => {
    setDisableNextButton(true);
    setRetrieveNextPet(!retrieveNextPet);
  };

  return (
    <>
      <div className="row text-center">
        <legend>Average Rating: {newScore}</legend>
      </div>
      <div className="row mt-4 mb-5 justify-content-center">
        <div className="col-6 col-md-4 col-lg-3 col-xl-2">
          <button
            className="btn btn-lg button-color w-100"
            type="submit"
            onClick={onClickNextButton}
            disabled={disableNextButton}
          >
            Next!
          </button>
        </div>
      </div>
    </>
  );
}
