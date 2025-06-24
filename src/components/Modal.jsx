import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

function Modal({ open, children, onClose }) {
  const dialog = useRef();

// using the open prop as the dependency makes the side effect run
// every time the open prop is changed via state change in app.jsx
useEffect(() => {
  if (open) {
    dialog.current.showModal();
  } else {
    dialog.current.close();
  }
}, [open]);

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {/* only render the children if the prop open is set to true
      this means that the timeout will be stopped in the deleteConfirmation
      component */}
      {open ? children : null}
    </dialog>,
    document.getElementById('modal')
  );
};

export default Modal;
