import "./TwoStepVerification.css";
import { useState } from "react";

type TwoStepVerificationBoxProps = {
  onBack: () => void;
  userEmail?: string;
};

const TwoStepVerificationBox: React.FC<TwoStepVerificationBoxProps> = ({ onBack, userEmail }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showEmailSetup, setShowEmailSetup] = useState(false);

  const handleToggle = () => {
    setIsEnabled(!isEnabled);
    if (!isEnabled) setShowEmailSetup(true);
  };

  return (
    <div className="two-step-box animate-slide">
      <div className="two-step-header">
        <button className="back-btn" onClick={onBack}>  <i className="ri-arrow-left-line"></i></button>
        <h3>🔐 Two-Step Verification</h3>
      </div><hr />

      <div className="two-step-content">
        <div className="two-step-icon">
          <i>🛡️</i>
        </div>

        <p className="two-step-desc">
          Two-step verification is <strong>{isEnabled ? "on" : "off"}</strong>.
          You’ll need to enter your email if you register your account again.
          <span className="learn-more">Learn more</span>
        </p>

        <div className="toggle-setting">
          <span>Enable Two-Step Verification</span>
          <label className="switch">
            <input type="checkbox" checked={isEnabled} onChange={handleToggle} />
            <span className="slider round"></span>
          </label>
        </div>

        {isEnabled && (
          <div className="email-change">
            <p>Change your email:</p>
            <input
              type="email"
              defaultValue={userEmail || ""}
              placeholder="Enter your email"
              className="email-input"
            />
          </div>
        )}

        {showEmailSetup && (
          <div className="finish-setup">
            <h4>Finish email setup</h4>
            <p>Verify your email in case you forget your two-step verification.</p>
            <button className="verify-btn">Verify Email</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoStepVerificationBox;
