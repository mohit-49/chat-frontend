type AccountBoxProps = {
  onBack: () => void;
  onOpenSecurity: () => void;
  onOpenPassKeys: () => void;
  onOpenEmialAddress: () => void;
  onOpenTwoStepVerification: () => void;
  onOpenChangeNumber: () => void;
  onOpenRequestAccountInfo: () => void;
  onOpenAddAccount: () => void;
  onOpenDeleteAccount: () => void;
};

const AccountBox: React.FC<AccountBoxProps> = ({ onBack, onOpenSecurity, onOpenPassKeys, onOpenEmialAddress, onOpenTwoStepVerification,
  onOpenChangeNumber, onOpenRequestAccountInfo, onOpenAddAccount, onOpenDeleteAccount }) => (
  <div className="account-box animate-slide">
    <div className="account-header">
      <button className="back-btn" onClick={onBack}>
          <i className="ri-arrow-left-line"></i>
      </button>
      <h3>👤 Account</h3>
    </div>

    <ul className="account-options">
      <li onClick={onOpenSecurity}><i className="ri-shield-keyhole-line"></i> Security Notifications</li>
      <li onClick={onOpenPassKeys}><i className="ri-key-line"></i> Passkeys</li>
      <li onClick={onOpenEmialAddress}><i className="ri-mail-line"></i> Email Address</li>
      <li onClick={onOpenTwoStepVerification}><i className="ri-shield-check-line"></i>  Two-Step Verification</li>
      <li onClick={() => onOpenChangeNumber()}><i className="ri-phone-line"></i> Change Number</li>
      <li onClick={() => onOpenRequestAccountInfo()}><i className="ri-file-list-line"></i>  Request Account Info</li>
      <li onClick={() => onOpenAddAccount()}><i className="ri-user-add-line"></i> Add Account</li>
      <li onClick={() => onOpenDeleteAccount()} className="danger"><i className="ri-delete-bin-line"></i> Delete Account</li>
    </ul>
  </div>
);

export default AccountBox;
