import "./PassKeys.css";

type PassKeysBoxProps = {
    onBack: () => void;
};

const PassKeysBox: React.FC<PassKeysBoxProps> = ({ onBack }) => {
    return (
        <div className="passkeys-box animate-slide">
            <div className="passkeys-header">
                <button className="back-btn" onClick={onBack}>
                      <i className="ri-arrow-left-line"></i>
                </button>
                <h3>PassKeys</h3>
            </div><hr />

            <div className="passkeys-content">
                <div className="passkey-icon">
                    <i>🔐</i>
                </div>
                <h4>🔑 Log in securely and protect your account</h4>
                <ul className="passkeys-points">
                    <li>
                        <i>🛡️</i> Create a passkey for a secure, easy way to log into your account.
                    </li>
                    <li>
                        <i>👆</i> Log into MyChats with your face, fingerprint, or screen lock.
                    </li>
                    <li>
                        <i>💾</i> Your passkey is stored safely in your password manager.
                    </li>
                </ul>

                <button className="create-passkey-btn">Create a Passkey</button>
            </div>
        </div>
    );
};

export default PassKeysBox;
