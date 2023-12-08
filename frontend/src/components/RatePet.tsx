import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import React from "react";
import axios, {AxiosResponse} from "axios";
import { ErrorMessage } from "./ErrorMessage";
import { useAuth, User } from "../services/AuthService";

type PetRatingProfile = {
  petId: string,
  petName: string,
  imageUrl: string
}

// PetToRate type represents the expected shape of the data returned by the app's backend
// for a pet that is being presented for rating
type PetToRate = {
  pet_id: string,
  pet_name: string,
  image_name: string
}

// This component displays pets to the user and allows the user to rate each pet as "Pet" or "Pass"
export function RatePet() {
  const { getUser, logOut } = useAuth();
  let [retrieveNextPet, setRetrieveNextPet] = useState(false);
  let [emptyPets, setEmptyPets] = useState(false);
  // I used the following reference to learn how to assign a type to the useState hook:
  // https://stackoverflow.com/questions/53650468/set-types-on-usestate-react-hook-with-typescript
  // Typecasting the default value of petToRate as a PetRatingProfile is possible as long as petToRate is checked for keys
  // before trying to access a specific key
  let [petToRate, setPetToRate] = useState<PetRatingProfile>({} as PetRatingProfile);
  let [nextPet, setNextPet] = useState(false);
  let [disableRatingButtons, setDisableRatingButtons] = useState(false);
  let [disableNextButton, setDisableNextButton] = useState(false);
  // I used the following reference to learn how to assign a type to the useState hook:
  // https://stackoverflow.com/questions/53650468/set-types-on-usestate-react-hook-with-typescript
  let [newScore, setNewScore] = useState<number>(0);

  useEffect(() => {
    const getPet = async () => {
      // If user is authenticated, we can call a private back end route to retrieve a pet to rate, but
      // if user is not authenticated, they are logged out and redirected to the login page
      const user: User = await getUser();

      if (user.success) {
        // Another CS student at PSU, Robert Peterson, helped me to navigate the axios source code to create
        // the type signature for the result of making an API call to this endpoint
        let result: AxiosResponse<PetToRate, any>;
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
        // err has type of "any" because we explicitly want to catch all possible errors
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
        const pet: PetRatingProfile = {
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

type RatePetProps = {
  petName: string;
  imageUrl: string;
  setNextPet: Dispatch<SetStateAction<boolean>>;
  setRetrieveNextPet: Dispatch<SetStateAction<boolean>>;
  retrieveNextPet: boolean;
  nextPet: boolean;
  setDisableRatingButtons: Dispatch<SetStateAction<boolean>>;
  disableRatingButtons: boolean;
  setDisableNextButton: Dispatch<SetStateAction<boolean>>;
  disableNextButton: boolean;
  petId: string;
  newScore: number;
  setNewScore: Dispatch<SetStateAction<number>>;
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

type PetScoreRecord = {
  avgScore: number
}

type RatePetButtonsProps = {
  setNextPet: Dispatch<SetStateAction<boolean>>;
  setDisableRatingButtons: Dispatch<SetStateAction<boolean>>;
  disableRatingButtons: boolean;
  petId: string;
  setNewScore: Dispatch<SetStateAction<number>>;
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

  const onClickRatingButton = async (event:MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, rating: number) => {
    setDisableRatingButtons(true);

    // If user is authenticated, we can call a private back end route to update pet's score after being rated, but
    // if user is not authenticated, they are logged out and redirected to the login page
    const user: User = await getUser();
    if (user.success) {
      // Another CS student at PSU, Robert Peterson, helped me to navigate the axios source code to create
      // the type signature for the result of making an API call to this endpoint
      let result: AxiosResponse<PetScoreRecord, any>;
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
      // err has type of "any" because we explicitly want to catch all possible errors
      } catch (err: any) {
        // If backend route returns an error, the user will be logged out and returned to login page
        logOut();
        return;
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

type DisplayPetRatingProps = {
  setRetrieveNextPet: Dispatch<SetStateAction<boolean>>;
  retrieveNextPet: boolean;
  setDisableNextButton: Dispatch<SetStateAction<boolean>>;
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

  const onClickNextButton = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
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
            onClick={(e) => onClickNextButton(e)}
            disabled={disableNextButton}
          >
            Next!
          </button>
        </div>
      </div>
    </>
  );
}
