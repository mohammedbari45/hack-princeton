import React from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src="profile-picture.jpg" alt="Profile Picture" className="profile-picture" />
        <h1>John Doe</h1>
        <p className="role">Web Developer</p>
      </div>

      <div className="profile-body">
        <section className="bio">
        </section>

        <section className="contact">
          <h2>Contact Information</h2>
          <ul>
            <li>Email: john.doe@example.com</li>
            <li>Phone: +123 456 7890</li>
            <li>Location: New York, NY</li>
          </ul>

          <h2>Current Credit Cards</h2>
          <ul>
            <li>Card 1</li>
            <li>Card 2</li>
            <li>Card 3</li>
          </ul>

        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
