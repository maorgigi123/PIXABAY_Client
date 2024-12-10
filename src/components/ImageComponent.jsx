import React from 'react';
import styled from 'styled-components';

// Container for the image component
const ImageContainer = styled.div`
  position: relative; // למיקום overlay מעל התמונה
  width: 30%; // רוחב המיכל יהיה 30% מהרוחב הכולל
  margin: 10px; // מרווח בין תמונות
  cursor: pointer; // המצביע משתנה ליד כאשר העכבר על התמונה

  // כאשר העכבר עובר מעל התמונה, ה-overlay יחשף
  &:hover div {
    opacity: 1; // ברגע שהעכבר עובר מעל התמונה, opacity של ה-overlay משתנה ל-1
  }
`;

// תמונה שנמצאת בתוך ה-container
const Image = styled.img`
  width: 100%; // התמונה תתפוס 100% מרוחב ה-container
  height: 250px; // גובה קבוע לתמונה
  object-fit: cover; // לשמור על יחסי גובה ורוחב של התמונה
`;

// Overlay שמופיע מעל התמונה
const Overlay = styled.div`
  position: absolute; // overlay שממוקם על התמונה
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); // צבע שחור עם שקיפות
  opacity: 0; // התחל עם opacity 0 (לא נראה)
  transition: opacity 0.3s ease; // מעבר חלק כאשר אנחנו משנה את ה-opacity
`;

/**
 * ImageComponent displays an image with an overlay that becomes visible when hovering.
 * Clicking the image triggers the opening of a modal with additional data.
 * 
 * @param {Object} props - The component's props.
 * @param {Object} props.data - The image data object containing previewURL, views, downloads, and collections.
 * @param {string} props.data.previewURL - The URL of the image to display.
 * @param {function} props.openModal - The function to open the modal when the image is clicked.
 * 
 * @returns {JSX.Element} - The rendered ImageComponent.
 */
const ImageComponent = ({ data, openModal }) => {
  const { previewURL } = data;

  return (
    <ImageContainer onClick={() => openModal(data)}>
      <Image src={previewURL} alt="image" loading="lazy" />
      {/* ה-overlay יהפוך לגלוי רק כאשר העכבר על התמונה */}
      <Overlay />
    </ImageContainer>
  );
};

export default ImageComponent;
