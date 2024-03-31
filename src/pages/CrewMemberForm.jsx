// CrewMemberForm.js
import React, { useState } from 'react';

const CrewMemberForm = ({ helpCenterSkills }) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [designation, setDesignation] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleAddSkill = (e) => {
    const skill = e.target.value;
    setSelectedSkills((prevSkills) => [...prevSkills, skill]);
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  return (
    <div className="crew-member-form">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Designation"
        value={designation}
        onChange={(e) => setDesignation(e.target.value)}
      />
      <div className="skills">
        <p>Skills:</p>
        <ul>
          {selectedSkills.map((skill) => (
            <li key={skill}>
              {skill}{' '}
              <button onClick={() => handleRemoveSkill(skill)}>Remove</button>
            </li>
          ))}
        </ul>
        <select onChange={handleAddSkill}>
          <option value="" disabled>
            Add a skill
          </option>
          {helpCenterSkills.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CrewMemberForm;
