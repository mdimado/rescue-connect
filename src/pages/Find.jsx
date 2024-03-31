import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase.config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase.config";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/home.css";
import pin from "../assets/images/pin.png";
import axios from "axios";
import animationData from "../assets/lottie/ani3.json";
import Helmet from "../components/Helmet/Helmet";


const Home = () => {
  const year = new Date().getFullYear();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [locationName, setLocationName] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [emergencySearch, setEmergencySearch] = useState('');
  const [emergencySuggestions, setEmergencySuggestions] = useState([])
  const [emergencySelected, setEmergencySelected] = useState(false);
  const [confirmButtonVisible, setConfirmButtonVisible] = useState(false);
  const [longTapLocation, setLongTapLocation] = useState(null);
  const mapRef = useRef(null);
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 13,
  });




  const emergencyList = [
    "Medical Emergencies",
    "Fire Incidents",
    "Natural Disasters",
    "Floods",
    "Earthquakes",
    "Cyclones and Hurricanes",
    "Road Accidents",
    "Child Abduction or Missing Persons",
    "Animal Rescues (Stray or Injured Animals)",
    "Environmental Hazards (e.g., Chemical Spills)",
    "Humanitarian Crises (e.g., Refugee Assistance)",
    "Terrorist Attacks and Security Threats",
    "Domestic Violence and Abuse",
    "Agricultural Emergencies (e.g., Crop Failure)",
    "Power Outages and Utility Failures",
    "Food and Water Scarcity",
    "Traffic Jams and Road Blockades",
    "Migrant Labor Issues",
  ];




  

  const customIcon = new L.Icon({
    iconUrl: pin,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const handleEmergencySearch = (input) => {
    setEmergencySearch(input);

    const filteredSuggestions = emergencyList.filter((suggestion) =>
      suggestion.toLowerCase().includes(input.toLowerCase())
    );

    setEmergencySuggestions(filteredSuggestions);
  };
  

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const userDataRef = collection(db, "userData");
      const userData = {
        name: user.displayName,
        email: user.email,
      };

      const userDataQuery = query(userDataRef, where("email", "==", userData.email));
      const snapshot = await getDocs(userDataQuery);
      const existingUserData = snapshot.docs.find((doc) => doc.data().email === userData.email);

      if (!existingUserData) {
        await addDoc(userDataRef, userData);
      }

      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getLocationName = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=6d2b65dca8274b7ab6e21e3e9d9d47a2`);
      if (response && response.data && response.data.results.length > 0) {
        const location = response.data.results[0].formatted;
        return location;
      }
    } catch (error) {
      console.error(error);
    }

    return 'Location not found';
  };

  

  const handleSearch = async (input) => {
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${input}&key=6d2b65dca8274b7ab6e21e3e9d9d47a2`);
      if (response && response.data && response.data.results.length > 0) {
        const suggestions = response.data.results.map((result) => result.formatted);
        setAutocompleteSuggestions(suggestions);
      } else {
        setAutocompleteSuggestions([]);
      }
    } catch (error) {
      console.error(error);
      setAutocompleteSuggestions([]);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setSearchLocation(suggestion);
    setAutocompleteSuggestions([]);
  
    const coordinates = await fetchCoordinatesForLocation(suggestion);
    if (coordinates) {
      setSelectedLocation(coordinates);
      setZoomLevel(0);
    }

    if (suggestion && emergencySearch) {
      setConfirmButtonVisible(true);
    } else {
      setConfirmButtonVisible(false);
    }
  };
  

  const handleEmergencySuggestionClick = (suggestion) => {
    setEmergencySearch(suggestion);
    setEmergencySuggestions([]);
  
    if (searchLocation && suggestion) {
      setConfirmButtonVisible(true);
    } else {
      setConfirmButtonVisible(false);
    }
  };
  
  
  

  const fetchCoordinatesForLocation = async (location) => {
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${location}&key=6d2b65dca8274b7ab6e21e3e9d9d47a2`);
      if (response && response.data && response.data.results.length > 0) {
        const selectedLocationData = response.data.results[0].geometry;
        const latitude = selectedLocationData.lat;
        const longitude = selectedLocationData.lng;
        return { latitude, longitude };
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  useEffect(() => {
    // ...
  
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          setZoomLevel(30);
  
          const locationName = await getLocationName(latitude, longitude);
          setLocationName(locationName);
  
        
          setSearchLocation(locationName);
  
          setSelectedLocation({ latitude, longitude });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not available.");
    }
  
    
  }, []);
  

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          setZoomLevel(15);

          const locationName = await getLocationName(latitude, longitude);
          setLocationName(locationName);

          setSearchLocation(locationName);
          setSelectedLocation({ latitude, longitude });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not available.");
    }
  };

  return (
    <Helmet title={"Home"}> <Row>
      <Col lg="4" md="6" className="blur-box">
       <div className="box-shad">
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter a location..."
            value={searchLocation}
            onChange={(e) => {
              setSearchLocation(e.target.value);
              handleSearch(e.target.value);
            }}
          />
          <Button className="loc_button" onClick={handleUseCurrentLocation}><i class="ri-user-location-fill"></i></Button>
        </div>

        <div className="suggestions-list-box">
          <ul className="suggestions-list">
            {autocompleteSuggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        <div className="emergency-search-container">
          <input
            type="text"
            placeholder="Search for emergencies..."
            value={emergencySearch}
            onChange={(e) => {
              handleEmergencySearch(e.target.value);
            }}
          />
        </div>

        <div className="emergency-suggestions-list-box">
          <ul className="suggestions-list">
            {emergencySuggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleEmergencySuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
        </div>  

        </Col>
        <Col lg="8" md="6">

        {latitude !== null && longitude !== null ? (
          <div>
            <div className="map-container">
            <MapContainer
        center={selectedLocation ? [selectedLocation.latitude, selectedLocation.longitude] : [latitude, longitude]}
        zoom={zoomLevel}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        
        onViewportChange={(newViewport) => {
          setViewport(newViewport);
        }}
        zoomControl={false}
        onLeafletClick={(e) => {
          if (e.originalEvent.type === "touchstart") {
            const touchEndTimeout = setTimeout(() => {
              setLongTapLocation(e.latlng);
            }, 1000);

            mapRef.current.on("touchend", () => {
              clearTimeout(touchEndTimeout);
            });
          }
        }}
      >
        <TileLayer
          url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=e61ccf95bd864fffb2dab162c4d45287"
        />
        {selectedLocation && (
          <>
            <Marker position={[selectedLocation.latitude, selectedLocation.longitude]} icon={customIcon}>
              <Popup>{searchLocation}</Popup>
            </Marker>
            <MapCenter center={[selectedLocation.latitude, selectedLocation.longitude]} />
          </>
        )}

        {longTapLocation && (
          <Marker position={longTapLocation} icon={customIcon}>
            <Popup>Long Tap Location</Popup>
          </Marker>
        )}
      </MapContainer>
            </div>
            <div className="location-details">
              <div>Location: {selectedLocation ? searchLocation : [locationName,latitude,longitude]}</div>
            </div>
          </div>
        ) : (
          <div>
            <div className="map-container">
              <MapContainer
                center={[20, 80]}
                zoom={zoomLevel}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </MapContainer>
            </div>
            <div className="location-details">
              <div>Location: Location not available</div>
              
            </div>
            

          </div>
        )}
      </Col>
      </Row>
      <div className="confirm_button_container">{confirmButtonVisible && (
  <Button className="confirm-button">
    Confirm
  </Button>
)}
</div>
      
    </Helmet>
  );
};

function MapCenter({ center }) {
  const map = useMap();
  map.flyTo(center, 15);
  return null;
}

export default Home;
