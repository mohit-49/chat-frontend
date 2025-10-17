import { useState } from "react";
import "./PrivacyBox.css";

type PrivacyOption = "lastSeen" | "profilePic" | "about" | "links" | "status" | null;

const Privacy = () => {
  const [activeOption, setActiveOption] = useState<PrivacyOption>(null);

  return (
    <div className="privacy-container">
      <h2>Who can see my personal information</h2>
      <hr />

      {activeOption === null && (
        <ul className="privacy-list">
          <li onClick={() => setActiveOption("lastSeen")}>
            Last Seen and Online <span className="arrow"><i className="ri-arrow-right-line"></i></span>
          </li>
          <li onClick={() => setActiveOption("profilePic")}>
            Profile Picture <span className="arrow"><i className="ri-arrow-right-line"></i></span>
          </li>
          <li onClick={() => setActiveOption("about")}>
            About <span className="arrow"><i className="ri-arrow-right-line"></i></span>
          </li>
          <li onClick={() => setActiveOption("links")}>
            Links <span className="arrow"><i className="ri-arrow-right-line"></i></span>
          </li>
          <li onClick={() => setActiveOption("status")}>
            Status <span className="arrow"><i className="ri-arrow-right-line"></i></span>
          </li>
          <li>Read Receipts <button className="toggle-btn">ON</button></li>
          <li>Default Message Timer <button className="toggle-btn">OFF</button></li>
          <li>Groups</li>
          <li>Avatar Stickers</li>
          <li>Live Location</li>
          <li>Calls</li>
          <li>Contacts</li>
          <li>App Lock</li>
          <li>Allow Camera Effects <button className="toggle-btn">OFF</button></li>
          <li>Advanced</li>
          <li>Privacy Checkup</li>
        </ul>
      )}

      {activeOption === "lastSeen" && (
        <div className="privacy-modal">
          <div className="modal-header">
            <button onClick={() => setActiveOption(null)}><i className="ri-arrow-left-line"></i></button>
            <h3>Last Seen & Online</h3>
          </div>

          <div className="modal-content">
            <h4>Who can see my last seen:</h4>
            <div className="checkbox-group">
              <label><input type="radio" name="lastSeen" /> Everyone</label>
              <label><input type="radio" name="lastSeen" /> My Contacts</label>
              <label><input type="radio" name="lastSeen" /> My Contacts Except...</label>
              <label><input type="radio" name="lastSeen" /> Nobody</label>
            </div>

            <h4>Who can see when I'm online:</h4>
            <div className="checkbox-group">
              <label><input type="radio" name="online" /> Everyone</label>
              <label><input type="radio" name="online" /> My Contacts</label>
              <label><input type="radio" name="online" /> My Contacts Except...</label>
              <label><input type="radio" name="online" /> Nobody</label>
            </div>

            <p className="info-text">
              If you don't share your last seen or online status, you won't be able to see others' last seen or online status.
            </p>
          </div>
        </div>
      )}

      {activeOption === "profilePic" && (
        <div className="privacy-modal">
          <div className="modal-header">
            <button onClick={() => setActiveOption(null)}><i className="ri-arrow-left-line"></i></button>
            <h3>Profile Picture</h3>
          </div>

          <div className="modal-content">
            <div className="checkbox-group">
              <label><input type="radio" name="profilePic" /> Everyone</label>
              <label><input type="radio" name="profilePic" /> My Contacts</label>
              <label><input type="radio" name="profilePic" /> My Contacts Except...</label>
              <label><input type="radio" name="profilePic" /> Nobody</label>
            </div>
          </div>
        </div>
      )}

      {activeOption === "about" && (
        <div className="privacy-modal">
          <div className="modal-header">
            <button onClick={() => setActiveOption(null)}>  <i className="ri-arrow-left-line"></i></button>
            <h3>About</h3>
          </div>

          <div className="modal-content">
            <div className="checkbox-group">
              <label><input type="radio" name="about" /> Everyone</label>
              <label><input type="radio" name="about" /> My Contacts</label>
              <label><input type="radio" name="about" /> My Contacts Except...</label>
              <label><input type="radio" name="about" /> Nobody</label>
            </div>
          </div>
        </div>
      )}

      {activeOption === "links" && (
        <div className="privacy-modal">
          <div className="modal-header">
            <button onClick={() => setActiveOption(null)}><i className="ri-arrow-left-line"></i></button>
            <h3>Links</h3>
          </div>

          <div className="modal-content">
            <div className="checkbox-group">
              <label><input type="radio" name="links" /> Everyone</label>
              <label><input type="radio" name="links" /> My Contacts</label>
              <label><input type="radio" name="links" /> My Contacts Except...</label>
              <label><input type="radio" name="links" /> Nobody</label>
            </div>
          </div>
        </div>
      )}

      {activeOption === "status" && (
        <div className="privacy-modal">
          <div className="modal-header">
            <button onClick={() => setActiveOption(null)}><i className="ri-arrow-left-line"></i></button>
            <h3>Status</h3>
          </div>

          <div className="modal-content">
            <div className="checkbox-group">
              <label><input type="radio" name="status" /> Everyone</label>
              <label><input type="radio" name="status" /> My Contacts</label>
              <label><input type="radio" name="status" /> My Contacts Except...</label>
              <label><input type="radio" name="status" /> Nobody</label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Privacy;
