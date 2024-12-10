import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

// Modal Background: Creates a dark overlay that covers the whole screen.
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: hidden;
`;

// Modal Container: The content area of the modal, with a max size and scrollable area.
const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 70vw;
  max-height: 80vh;
  overflow: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
`;

// Modal Image: Displays the image inside the modal with a fixed size and shadow.
const ModalImage = styled.img`
  width: 600px;
  height: 600px;
  margin: 0 auto;
  display: block;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
`;

// Close Button: A circular red button at the top-right of the modal.
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  font-size: 18px;
  outline: none;
`;

/**
 * Modal component to display an image along with additional data.
 * Provides focus management for accessibility and allows closing the modal.
 * 
 * @param {Object} props - The component's props.
 * @param {Object} props.imageData - The image data object containing the image details.
 * @param {string} props.imageData.previewURL - The URL of the image to display.
 * @param {number} props.imageData.views - Number of views of the image.
 * @param {number} props.imageData.downloads - Number of downloads of the image.
 * @param {string} props.imageData.collections - The collections the image belongs to.
 * @param {function} props.closeModal - The function to close the modal when the close button is clicked.
 * 
 * @returns {JSX.Element|null} - Returns the modal UI or null if no image data is provided.
 */
const Modal = ({ imageData, closeModal }) => {
  const modalRef = useRef(null);

  /**
   * Traps focus inside the modal, ensuring that keyboard navigation stays within the modal.
   */
  useEffect(() => {
    const focusableElements = modalRef.current?.querySelectorAll('button, a, input, select, textarea');
    const firstFocusableElement = focusableElements ? focusableElements[0] : null;
    const lastFocusableElement = focusableElements ? focusableElements[focusableElements.length - 1] : null;

    const handleTab = (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // Handle Shift + Tab for backward navigation
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement?.focus();
            event.preventDefault();
          }
        } else {
          // Handle Tab for forward navigation
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement?.focus();
            event.preventDefault();
          }
        }
      }
    };

    if (modalRef.current) {
      modalRef.current.addEventListener('keydown', handleTab);
    }

    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('keydown', handleTab);
      }
    };
  }, []);

  // If no image data is provided, do not render the modal.
  if (!imageData) return null;

  return (
    <ModalBackground>
      <ModalContainer ref={modalRef} tabIndex="-1">
        <CloseButton onClick={closeModal} tabIndex="0">
          X
        </CloseButton>
        <ModalImage
          src={imageData.previewURL}
          alt="Large Image"
          tabIndex="-1"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'fallback-image-url.jpg'; // Fallback image if the source fails
          }}
        />
        <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <p><strong>Views:</strong> {imageData.views}</p>
          <p><strong>Downloads:</strong> {imageData.downloads}</p>
          <p><strong>Collections:</strong> {imageData.collections || 'N/A'}</p>
        </div>
      </ModalContainer>
    </ModalBackground>
  );
};

export default Modal;
