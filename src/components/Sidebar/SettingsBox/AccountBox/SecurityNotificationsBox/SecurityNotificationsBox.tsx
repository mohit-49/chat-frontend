import "./SecurityNotificationsBox.css"

type SecurityNotificationsBoxProps = {
  onBack: () => void;
};

const SecurityNotificationsBox: React.FC<SecurityNotificationsBoxProps> = ({ onBack }) => {
  return (
    <div className="security-box animate-slide">
      <div className="security-header">
        <button className="back-btn" onClick={onBack}>  <i className="ri-arrow-left-line"></i></button>
        <h3>🛡️ Security Notifications </h3>
      </div> <hr />

      <div className="security-content">
        <div className="security-icon">🔒</div>
        <h4>Your chats and calls are private</h4>
        <p>
          End-to-end encryption keeps your messages and calls private — no one outside your chats can read or listen to them.
        </p>

        <ul className="security-features">
          <li>💬 Text & Voice Messages</li>
          <li>📞 Audio & Video Calls</li>
          <li>📷 Photos</li>
          <li>🎥 Videos</li>
          <li>📄 Documents</li>
          <li>📍 Location Sharing</li>
          <li>🟢 Status Updates</li>
        </ul>

        <button className="learn-more-btn">Learn more</button>

        <div className="toggle-setting">
          <p>Show security notifications on this device</p>
           <span>Get notified when your security code changes for a contact's phone in an end-to-end encrypted chat.
            If you have multiple devices, this setting must be enabled on each device where you want 
            to get notifications.<button className="learn-more-btn">Learn more</button></span>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
         
        </div>
      </div>
    </div>
  );
};

export default SecurityNotificationsBox;

