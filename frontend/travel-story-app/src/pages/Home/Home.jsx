import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../utils/axiosInstance";
import {MdAdd} from "react-icons/md";
import Modal from "react-modal";
import TravelStoryCard from '../../components/Cards/TravelStoryCard';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';
import EmptyCard from '../../components/Cards/EmptyCard';

import EmptyImg from '../../assets/images/Add-Story.png'
import { DayPicker } from 'react-day-picker';
import moment from 'moment';

const Home = () => {

  const navigate = useNavigate()

  const [userInfo, setuserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState("");

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShow: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShow: false,
    data: null,
  });

  // Get user info
  const getUserInfo = async () => {
    try {

      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setuserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        // Clear storage if unauthorized
        localStorage.clear();
        navigate("/login") // Redirect to login
      }
    }
  };

  // Get all travel stories
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
        console.log("An unexpected error occurred. Please try again.");
    }
  }

  // Handle edit story click
  const handleEdit = (data) => {
    setOpenAddEditModal({ isShow: true, type: "edit", data: data });
  }

  // Handle Travel story click
  const handleViewStory = (data) => {
    setOpenViewModal({ isShow: true, data });
  };

  // handel update favourite
  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;

    try {
      const response = await axiosInstance.put("/update-is-favourite/" + storyId,
        {
          isFavourite: !storyData.isFavourite,
        }
      );

      if (response.data && response.data.story) {
        toast.success("Story updated Successfully");
        getAllTravelStories();
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
  }
  }

  // delete story
  const deleteTravelStory = async (data) => {
    const storyId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-story/" + storyId);

      if (response.data && !response.data.error) {
        toast.error("Story deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShow: false }));
        getAllTravelStories();
      } 
    } catch (error) {
          // Handle Unexpected Errors
          console.log("An Unexpected Error Occurred. Please Try Again.");
    }
  }

  // search story 
  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: {
          query,
        }
      });
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }    
    } catch (error) {
          // Handle Unexpected Errors
          toast.error("An Unexpected Error Occurred. Please Try Again.");
    }
  }

  const handleClearSearch = () => {
    setFilterType("");
    getAllTravelStories();
  }

  useEffect(() => {
    getAllTravelStories()
    getUserInfo();

    return () => {};
  }, []);
  

  return (
    <>
    <Navbar 
    userInfo={userInfo} 
    searchQuery={searchQuery} 
    setSearchQuery={setSearchQuery}
    onSearchNote={onSearchStory} 
    handleClearSearch={handleClearSearch}
    />

    <div className="container mx-auto py-10 px-4">
      <div className="flex gap-7">
        <div className="flex-1">
          {allStories.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {allStories.map((item) => {
                return (
                  <TravelStoryCard
                  key={item._id}
                  imgUrl={item.imageUrl}
                  title={item.title}
                  story={item.story}
                  date={item.visitedDate}
                  visitedLocation={item.visitedLocation}
                  isFavourite={item.isFavourite}
                  onClick={() => handleViewStory(item)}
                  onFavouriteClick={() => updateIsFavourite(item)}
                  />
                );
              })}
              </div>
          ) : (
            <EmptyCard imgSrc={EmptyImg} message={`Start creating your first Travel Story ! Click the 'Add' button to note 
              down your thoughts, ideas and memories. Let's get started!`}/>
          )}
        </div>
      </div>
    </div>

      {/* Add & Edit Travel Story Model */}
      <Modal 
      isOpen={openAddEditModal.isShow}
      onRequestClose={() => {}}
      style={{
        overlay: {
          backgroundColor: "rgba(169, 169, 169, 0.2)",
          zIndex: 999,
        },
      }}
      appElement={document.getElementById("root")}
      className="modal-box"
      >
        <AddEditTravelStory 
        type={openAddEditModal.type}
        storyInfo={openAddEditModal.data}
        onClose={() => {
          setOpenAddEditModal({ isShow: false, type: "add", data: null });
        }}
        getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      {/* View Travel Story Model */}
      <Modal 
      isOpen={openViewModal.isShow}
      onRequestClose={() => {}}
      style={{
        overlay: {
          backgroundColor: "rgba(169, 169, 169, 0.2)",
          zIndex: 999,
        },
      }}
      appElement={document.getElementById("root")}
      className="modal-box"
      >
        <ViewTravelStory 
          storyInfo={openViewModal.data || null} 
          onClose={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShow: false}));
          }}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShow: false}));
            handleEdit(openViewModal.data || null)
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null);
          }}
        />
      </Modal>

    <button className="w-16 h-16 flex items-center justify-center rounded-full bg-cyan-500 hover:bg-cyan-400 fixed right-10 bottom-10" 
          onClick={() => {
            setOpenAddEditModal({ isShow: true, type: "add", data: null });
          }}
          >
            <MdAdd className="text-[32px] text-white" />
     </button>
    <ToastContainer />
    </>
  );
};

export default Home
