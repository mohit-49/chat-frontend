import { useState } from "react";
import "./RequestAccountInfo.css";

type RequestAccountInfoBoxProps = {
  onBack: () => void;
};

const RequestAccountInfoBox: React.FC<RequestAccountInfoBoxProps> = ({ onBack }) => {
  const [autoAccountReport, setAutoAccountReport] = useState(false);
  const [autoChannelReport, setAutoChannelReport] = useState(false);

  return (
    <div className="request-info-box animate-slide">
      <div className="request-header">
        <button className="back-btn" onClick={onBack}>  <i className="ri-arrow-left-line"></i></button>
        <h3>📄 Request Account Info</h3>
      </div><hr />

      <div className="request-content">

        <section className="section-box">
          <h4>Account Information</h4>
          <p>
            Create a report of your chat application account information and settings,
            which you can access or port to another app. This report does not include your messages.
            <span className="learn-more"> Learn more</span>
          </p>

          <div className="toggle-setting">
            <span>Create reports automatically</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={autoAccountReport}
                onChange={() => setAutoAccountReport(!autoAccountReport)}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <p className="monthly-note">A new report will be created every month. <span className="learn-more">Learn more</span></p>
        </section>

        <section className="section-box">
          <h4>Channel Activity</h4>
          <p>
            Create a report of your channel updates and information, which you can access or port to another app.
            <span className="learn-more"> Learn more</span>
          </p>

          <div className="toggle-setting">
            <span>Create reports automatically</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={autoChannelReport}
                onChange={() => setAutoChannelReport(!autoChannelReport)}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <p className="monthly-note">A new report will be created every month. <span className="learn-more">Learn more</span></p>
        </section>
      </div>
    </div>
  );
};

export default RequestAccountInfoBox;
