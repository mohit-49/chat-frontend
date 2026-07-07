import "./EmailAddress.css";

type EmailAddressBoxProps = {
  onBack: () => void;
  userEmail?: string;
};

const EmailAddressBox: React.FC<EmailAddressBoxProps> = ({ onBack, userEmail }) => {
  return (
    <div className="email-box animate-slide">
      <div className="email-header">
        <button className="back-btn" onClick={onBack}>
            <i className="ri-arrow-left-line"></i>
        </button>
        <h3>📧 Email Address</h3>   
         <h3>📧 Email Address</h3>        
      </div><hr />

      <div className="email-content">
        <div className="email-icon">
          <i>📬</i>
        </div>

        <p className="email-desc">
          Email helps us verify your account or reach you in case of security or support issues.
          Your email address won’t be visible to others. <span className="learn-more">Learn more</span>
        </p>

        <input
          type="email"
          className="email-input"
          defaultValue={userEmail || ""}
          placeholder="Enter your email"
        />

        <button className="next-btn">Next</button>
      </div>
    </div>
  );
};

export default EmailAddressBox;
