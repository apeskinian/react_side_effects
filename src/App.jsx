import { useRef, useState, useEffect } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js'

// retrieve stored data and map to places for initial state for pickedPlaces
// located outside the app component to run only once
const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
const storedPlaces = storedIds.map(id => AVAILABLE_PLACES.find((place) => place.id === id));

function App() {
  const modal = useRef();
  const selectedPlace = useRef();
  const [ availablePlaces, setAvailablePlaces ] = useState([]);
  const [ pickedPlaces, setPickedPlaces ] = useState(storedPlaces);

  // useEffect is only run once the App component has finished executing
  // the second argument array is used to stop an infinite loop, if the dependency
  // has changed the effect will run again. A blank one cannot change so it's only run
  // once.
  useEffect(() => {
    // this attempts to get users location
    // a side effect as not directly related to rendering the output
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
    // set state once location is found which triggers rerendering
    setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    modal.current.open();
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    modal.current.close();
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    // SIDE EFFECT - not related to rendered code
    // Storing selected places in browser localstorage
    // JSON.parse makes a string into a thing, getting previously stored items
    // with a blank array if none found
    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    // JSON.stringify makes things a string
    // updating new selections, checks to see if place is already stored first
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem(
        'selectedPlaces',
        JSON.stringify([id, ...storedIds])
        );
      }
    }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    modal.current.close();

    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    localStorage.setItem(
      'selectedPlaces',
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    );
  }

  return (
    <>
      <Modal ref={modal}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText='Sorting places by distance...'
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
