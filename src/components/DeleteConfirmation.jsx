import { useEffect, useState } from "react";

const TIMER = 3000;

export default function DeleteConfirmation({ onConfirm, onCancel }) {
const [ remainingTime, setRemainingTime ] = useState(TIMER);

// using useEffect to show progress on the timer bar
useEffect(() => {
  const interval = setInterval(() => {
    setRemainingTime(prevTime => prevTime - 10)
  }, 10);
  // the blank dependency means the interval will be stopped when the component
  // is removed from the DOM
  return () => {
    clearInterval(interval)
  }
}, [])

useEffect(() => {
  const timer = setTimeout(() => {
    onConfirm();
  }, TIMER);
  // this return statement will stop the timer when the element is removed from
  // the DOM, this stops the timer running after a no was clicked and it still
  // removing the place
  return () => {
    clearTimeout(timer);
  }
}, [onConfirm]);

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <progress value={remainingTime} max={TIMER} />
    </div>
  );
}
