import { useState } from "react";
import "./ChangePhone.css";

type ChangeNumberBoxProps = {
  onBack: () => void;
};

const ChangeNumberBox: React.FC<ChangeNumberBoxProps> = ({ onBack }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [oldNumber, setOldNumber] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const handleNext = () => setStep(2);

  const handleSubmit = () => {
    alert("Number change submitted!");
  };

  return (
    <div className="change-number-box animate-slide">
      <div className="change-number-header">
        <button className="back-btn" onClick={step === 1 ? onBack : () => setStep(1)}>  <i className="ri-arrow-left-line"></i></button>
        <h3>📱 Change Number</h3>
      </div> <hr />

      <div className="change-number-content">
        {step === 1 && (
          <>
            <div className="change-number-icon">
              <i>📞</i>
            </div>

            <p className="change-number-desc">
              Changing your phone number will migrate your account info, groups, and settings.
            </p>

            <div className="instructions">
              <p>Before proceeding, please confirm that you are able to receive SMS or calls at your new number.</p>
              <p>If you have both a new phone and a new number, first change your number on your old phone.</p>
            </div>

            <button className="proceed-btn" onClick={handleNext}>Next</button>
          </>
        )}

        {step === 2 && (
          <div className="number-form">
            <label>
              Old Phone Number
              <input
                type="tel"
                placeholder="Enter your old phone number"
                value={oldNumber}
                onChange={(e) => setOldNumber(e.target.value)}
              />
            </label>

            <label>
              New Phone Number
              <input
                type="tel"
                placeholder="Enter your new phone number"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
              />
            </label>

            <button className="proceed-btn" onClick={handleSubmit}>Submit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeNumberBox;
