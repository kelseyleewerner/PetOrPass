import { useAuth, User } from "../services/AuthService";
import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { AxiosResponse } from "axios";
import { ErrorMessage } from "./ErrorMessage";

type Pet = {
  petId: string | undefined;
  petName: string | undefined;
  imageUrl: string | undefined;
  avgScore: string | number | undefined;
};

// PetRecord type represents the expected shape of the data returned by the app's backend
// for an individual pet
type PetRecord = {
  pet_id: string;
  pet_name: string;
  image_name: string;
  total_score: number;
  total_votes: number;
  submitted_by: string;
};

// This component displays a gallery view of all of the pets submitted by the current
// user. If the user has not yet submitted any pets, then a helpful empty state
// message is displayed on the page
export function PetGallery(): JSX.Element {
  const { getUser, logOut } = useAuth();
  let [emptyGallery, setEmptyGallery] = useState(false);
  // I used the following reference to learn how to assign a type to the useState hook:
  // https://stackoverflow.com/questions/53650468/set-types-on-usestate-
  //  react-hook-with-typescript
  let [petList, setPetList] = useState<Pet[]>([]);

  useEffect(() => {
    const getPets: () => Promise<void> = async () => {
      // If user is authenticated, we can call a private back end route to retrieve a
      // list of pets, but if user is not authenticated, they are logged out and
      // redirected to the login page
      const user: User = await getUser();

      if (user.success) {
        // Another CS student at PSU, Robert Peterson, helped me to navigate the axios
        // source code to create the type signature for the result of making an API
        // call to this endpoint
        let result: AxiosResponse<PetRecord[], any>;
        try {
          result = await axios.get(
            `http://${import.meta.env.VITE_BACKEND_IP}:${
              import.meta.env.VITE_BACKEND_PORT
            }/pets/${user.email}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          // err has type of "any" because we explicitly want to catch
          // all possible errors
        } catch (err: any) {
          // Upon encountering an unidentified server error, the user will be logged
          // out and returned to login page
          if (err.response) {
            // If user has not yet submitted any pets, then their gallery
            // will display an empty state
            if (
              err.response.status === 404 &&
              Array.isArray(err.response.data) &&
              err.response.data[0].hasOwnProperty("error") &&
              err.response.data[0].error ===
                "No pets have been added to the Pets table by this user"
            ) {
              setEmptyGallery(true);
            } else {
              logOut();
            }
          } else {
            logOut();
          }

          return;
        }

        // Upon successful reply from server, display list of pets submitted by user
        let pets: Pet[] = [];
        result.data.forEach((item: PetRecord) => {
          pets.push({
            petId: item.pet_id,
            petName: item.pet_name,
            imageUrl: item.image_name,
            avgScore:
              item.total_votes === 0
                ? 0
                : (item.total_score / item.total_votes).toFixed(2),
          });
        });

        setPetList(pets);
        setEmptyGallery(false);
      }
    };

    getPets();
  }, []);

  return (
    <>
      {emptyGallery ? (
        <ErrorMessage errorMessage="uh-oh! Looks like you have not submitted any pets
        yet for rating! You can submit your first pet by visiting
        the Submit Pet tab." />
      ) : (
        <main className="container below-navbar">
          <div className="row text-center">
            <h1>Pet Gallery</h1>
          </div>
          <div className="row text-center mb-5">
            <legend>
              View all of the pets you submitted that were rated by other users
            </legend>
          </div>
          <div className="row align-items-center justify-content-center">
            {petList.map((pet: Pet) => (
              <PetProfile
                key={pet.petId}
                petName={pet.petName}
                avgScore={pet.avgScore}
                imageUrl={pet.imageUrl}
              />
            ))}
          </div>
        </main>
      )}
    </>
  );
}

type PetProfileProps = {
  petName: string | undefined;
  avgScore: string | number | undefined;
  imageUrl: string | undefined;
};

function PetProfile(props: PetProfileProps): JSX.Element {
  let { petName, avgScore, imageUrl } = props;

  return (
    <div className="col">
      <div className="card card-width mb-5 mx-auto">
        <img
          src={imageUrl}
          className="card-img-top"
          alt={`Photo of ${petName}`}
        />
        <div className="card-body">
          <h5 className="card-title">{petName}</h5>
          <p className="card-text">Pet or Pass Score: {avgScore}</p>
        </div>
      </div>
    </div>
  );
}
