import React, { useState, useEffect } from 'react';
import {Container,Row,Col} from 'reactstrap';
import { toast } from 'react-toastify';
import { db, storage } from '../firebase.config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup, Label, Input } from 'reactstrap'; // Import FormGroup, Label, and Input from Reactstrap

const OrganizationForm = () => {
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [locationName, setLocationName] = useState('');
  const [contactImage, setContactImage] = useState(null);
  const [orgImage, setOrgImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    if (locationName.trim() !== '') {
      // Fetch location suggestions from OpenCage API
      fetchLocationSuggestions(locationName);
    } else {
      setLocationSuggestions([]);
    }
  }, [locationName]);

  const fetchLocationSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=6d2b65dca8274b7ab6e21e3e9d9d47a2`
      );
      const data = await response.json();

      if (data.results) {
        const suggestions = data.results.map((result) => result.formatted);
        setLocationSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
    }
  };

  const handleLocationInputChange = (e) => {
    const inputValue = e.target.value; 
  setLocationName(inputValue);
    setSelectedLocation('');
    if (inputValue.trim() !== '' && !selectedLocation) {
      fetchLocationSuggestions(inputValue);
    } else {
      setLocationSuggestions([]);
    }
  
    
  };

  const handleLocationSuggestionClick = (suggestion) => {
    setLocationName(suggestion);
    setSelectedLocation(suggestion);
    setLocationSuggestions([]);
  };
  


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      
      const contactImageRef = ref(storage, `contactImages/${contactImage.name}`);
      const orgImageRef = ref(storage, `orgImages/${orgImage.name}`);

      const contactImageUploadTask = uploadBytesResumable(contactImageRef, contactImage);
      const orgImageUploadTask = uploadBytesResumable(orgImageRef, orgImage);

      const [contactImageSnapshot, orgImageSnapshot] = await Promise.all([
        contactImageUploadTask,
        orgImageUploadTask,
      ]);

      const contactImageUrl = await getDownloadURL(contactImageSnapshot.ref);
      const orgImageUrl = await getDownloadURL(orgImageSnapshot.ref);

      const organizationsCollectionRef = collection(db, 'organizations');
      await addDoc(organizationsCollectionRef, {
        orgName,
        orgType,
        description,
        contactName,
        phoneNumber,
        locationName,
        contactImageUrl,
        orgImageUrl,
      });

      setLoading(false);
      toast.success('Organization data added successfully');

      setOrgName('');
      setOrgType('');
      setDescription('');
      setContactName('');
      setPhoneNumber('');
      setLocationName('');
      setContactImage(null);
      setOrgImage(null);
    } catch (error) {
      setLoading(false);
      toast.error('Error adding organization data');
    }
  };

  return (

    <section>
      <Container>
        <Row>
          <Col>
          <div>
      <h1>Organization Registration Form</h1>
      <form onSubmit={handleFormSubmit}>
        <FormGroup>
          <Label for="orgName">Organization Name:</Label>
          <Input
            type="text"
            id="orgName"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="category">Category:</Label>
          <Input
            type="select"
            id="category"
            value={orgType}
            onChange={(e) => setOrgType(e.target.value)}
            required
          >
            <option value="">Choose category</option>
            <option value="Hospitals and Clinics">Hospitals and Clinics</option>
            <option value="Emergency Medical Services (EMS)">Emergency Medical Services (EMS)</option>
            <option value="Fire Departments">Fire Departments</option>
            <option value="National Disaster Response Force (NDRF)">National Disaster Response Force (NDRF)</option>
            <option value="State Disaster Response Force (SDRF)">State Disaster Response Force (SDRF)</option>
            <option value="Indian Navy">Indian Navy</option>
            <option value="Indian Coast Guard">Indian Coast Guard</option>
            <option value="Local Police">Local Police</option>
            <option value="Child Helpline (1098)">Child Helpline (1098)</option>
            <option value="Animal Welfare Organizations">Animal Welfare Organizations</option>
            <option value="Environmental Protection Agencies">Environmental Protection Agencies</option>
            <option value="NGOs (Non-Governmental Organizations)">NGOs (Non-Governmental Organizations)</option>
            <option value="United Nations Agencies">United Nations Agencies</option>
            <option value="Special Forces">Special Forces</option>
            <option value="Women's Shelters">Women's Shelters</option>
            <option value="Agricultural Extension Services">Agricultural Extension Services</option>
            <option value="Utility Companies">Utility Companies</option>
            <option value="Government Relief Programs">Government Relief Programs</option>
            <option value="Traffic Police">Traffic Police</option>
            <option value="Labor Departments">Labor Departments</option>
            <option value="Other">Other</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="description">Description:</Label>
          <Input
            type="textarea"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="contactName">Contact Person's Name:</Label>
          <Input
            type="text"
            id="contactName"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="phoneNumber">Phone Number:</Label>
          <Input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
                  <Label for="locationName">Location Name:</Label>
                  <Input
                    type="text"
                    id="locationName"
                    value={locationName}
                    onChange={handleLocationInputChange}
                    required
                  />
                  {locationSuggestions.length > 0 && (
                    <ul className="location-suggestions">
                      {locationSuggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() => handleLocationSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </FormGroup>
        <FormGroup>
          <Label for="contactImage">Contact Person's Image:</Label>
          <Input
            type="file"
            id="contactImage"
            onChange={(e) => setContactImage(e.target.files[0])}
            
          />
        </FormGroup>
        <FormGroup>
          <Label for="orgImage">Organization Image:</Label>
          <Input
            type="file"
            id="orgImage"
            onChange={(e) => setOrgImage(e.target.files[0])}
            
          />
        </FormGroup>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Organization'}
        </button>
      </form>
    </div>
          </Col>
        </Row>
      </Container>
    </section>

    
  );
};

export default OrganizationForm;
