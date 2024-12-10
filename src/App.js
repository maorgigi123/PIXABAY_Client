import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImageComponent from './components/ImageComponent';
import Modal from './components/Modal'; // Import the Modal component
import styled from 'styled-components';
import { selectCategory, selectDataByCategory, selectPage } from './store/images/images.selector';
import { setCategory, setData, setPage } from './store/images/images.action';
import SortOptions from './components/SortOptions';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

// Styled Components
const Container = styled.div`
  width: 80vw;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ContainerImages = styled.div`
  width: 100%;
  height: 840px; // הגובה של התמונה + המרווחים ביניהם
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
`;

const Input = styled.input`
  width: 300px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  text-align: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

function App() {
  const dispatch = useDispatch();
  const dataByCategory = useSelector(selectDataByCategory);
  const page = useSelector(selectPage);
  const category = useSelector(selectCategory);

  // States for search input, sort criteria, and modal
  const [search, setSearch] = useState(category);
  const [sortCriteria, setSortCriteria] = useState('id');
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State for modal image
  const [loading, setLoading] = useState(true);
  const [finishAllPhotos, setFinishAllPhotos] = useState(false); // To show a message when no more images

  useEffect(() => {
    const fetchData = async () => {
      // Check if data already exists for the current category and page
      const dataExists = dataByCategory[category]?.[page];
      if (dataExists) {
        // If data exists, don't send a new request
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/images?category=${category}&page=${page}`);
        const result = response.data;
        console.log(result);

        if (result.total <= 0) {
          setFinishAllPhotos(true);
        } else {
          setFinishAllPhotos(false);
        }

        dispatch(setData({ category, data: result.hits, page }));
        setLoading(false);
      } catch (e) {
        console.error('Error fetching data:', e);  // Detailed error message
        setLoading(false);
        setFinishAllPhotos(true);
      }
    };

    fetchData();
  }, [category, page, dataByCategory]);
  

  // Pagination handlers to navigate between pages
  const handlePrev = () => {
    if (page > 1) {
      dispatch(setPage(page - 1)); // Go to the previous page
    }
  };

  const handleNext = () => {
    dispatch(setPage(page + 1)); // Go to the next page
  };

  // Debounced category change handler to update category
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    // Clear previous timeout if it exists
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout to delay the category change action
    setTypingTimeout(
      setTimeout(() => {
        setLoading(true);
        dispatch(setCategory(value));
        dispatch(setPage(1)); // Reset to page 1 when category changes
      }, 500) // .5-second delay for better performance
    );
  };

  // Sort change handler to update sort criteria
  const handleSortChange = (e) => {
    setSortCriteria(e.target.value); // Update sorting option
  };

  // Open the modal with the selected image
  const openModal = (imageData) => {
    setSelectedImage(imageData);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  // Sorting the data based on selected criteria
  const sortedData = [...(dataByCategory[category]?.[page] || [])].sort((a, b) => {
    try {
      // בדיקה אם שני הערכים הם מספריים
      if (typeof a[sortCriteria] === 'number' && typeof b[sortCriteria] === 'number') {
        return b[sortCriteria] - a[sortCriteria]; // ממיינים מהגדול לקטן (מיון יורד)
      }
  
      // בדיקה אם שני הערכים הם מחרוזות
      if (typeof a[sortCriteria] === 'string' && typeof b[sortCriteria] === 'string') {
        return b[sortCriteria].localeCompare(a[sortCriteria]); // ממיינים לפי סדר אלפביתי, מהגדול לקטן
      }
  
      // בדיקה אם שני הערכים הם תאריכים (Date)
      if (a[sortCriteria] instanceof Date && b[sortCriteria] instanceof Date) {
        return b[sortCriteria] - a[sortCriteria]; // ממיינים מהעתיק לחדש (מיון יורד)
      }
    } catch (e) {
      console.error('Error during sorting:', e);  // אם יש טעות במיון, זה ידפיס את הטעות
    }
  
    return 0;  // במקרה של חוסר התאמה בין סוגי הנתונים, לא משתנים
  });
  
  

  return (
    <Container>
      <TopBar>
        {/* Pagination buttons */}
        <Button onClick={handlePrev} disabled={page <= 1}>
          Prev
        </Button>
        {/* Search input */}
        <Input
          type="text"
          value={search}
          onChange={handleCategoryChange}
          placeholder="Enter category"
          style={{width:500}}
        />
        <Button onClick={handleNext} disabled={sortedData.length < 9}>
          Next
        </Button>
      </TopBar>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader size={80} color="#3498db" loading={loading} />
      </div>     
       ) : (
        <div style={{ display: 'flex', width: '80vw' }}>
          <SortOptions sortCriteria={sortCriteria} handleSortChange={handleSortChange} />

          <ContainerImages>
            {finishAllPhotos ? (
              <h1>No more images</h1> // Message when there are no more images
            ) : (
              sortedData.map((img) => (
                <ImageComponent key={img.id} data={img} openModal={openModal} />
              ))
            )}
          </ContainerImages>
        </div>
      )}

      {/* Render the Modal if an image is selected */}
      {selectedImage && <Modal imageData={selectedImage} closeModal={closeModal} />}
    </Container>
  );
}

export default App;
