
type User = {
  name: string;
  email: string;
  avatar?: string;
};
type SettingsBoxProps = {

  currentUser: User;
  onEdit: () => void;
  onDelete: () => void;
  onOpenAccount: () => void;
  onOpenPrivacy: () => void;
  onClose: () => void;
};

const SettingsBox: React.FC<SettingsBoxProps> = ({
  currentUser,
  onEdit,
  onDelete,
  onOpenAccount,
  onOpenPrivacy,
  onClose,
}) => {
  return (
    <div className="settings-box">
      <div className="settings-close">
        <button onClick={onClose}>✖</button>
      </div>

      <div className="settings-header">
        <div className="avatar-large">
          {currentUser.avatar ? (
            <img src={`${process.env.NEXT_PUBLIC_API_URL}${currentUser.avatar}`} alt={currentUser.name} />
          ) : (
            <span>{currentUser.name.charAt(0)}</span>
          )}
        </div>
        <div className="user-info">
          <h3>{currentUser.name}</h3>
          <p>{currentUser.email}</p>
        </div>


      </div>
      <div className="settings-actions">
        <button className="settings-actions-edit-btn" onClick={() => {
          onClose();
          onEdit();
        }}>
          <i className="ri-edit-line"></i> Edit
        </button>

        <button className="settings-actions-delete-btn" onClick={() => {
          onClose();
          onDelete();
        }}>
          <i className="ri-delete-bin-line"></i> Delete
        </button>
      </div>

      <hr></hr>
      <ul className="settings-list">
        <li onClick={onOpenAccount}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>👤 Account </span>
          <span style={{ fontWeight: "400", color: "#888", fontSize: "0.85em" }}>
            Security notification, change number
          </span>
        </li>
        <li
          onClick={onOpenPrivacy}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>🔒 Privacy</span>
          <span style={{ fontWeight: "400", color: "#888", fontSize: "0.85em" }}>
            Block contacts, disappearing messages
          </span>
        </li>

        <li

          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>😊 Avatar</span>
          <span style={{ fontWeight: "400", color: "#888", fontSize: "0.85em" }}>
            Create, edit, profile photo
          </span>
        </li>

        <li

          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>📑 Lists</span>
          <span style={{ fontWeight: "400", color: "#888", fontSize: "0.85em" }}>
            Manage people and groups
          </span>
        </li>

        <li

          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>💬 Chats</span>
          <span style={{ fontWeight: "400", color: "#888", fontSize: "0.85em" }}>
            Theme, wallpapers, chat history
          </span>
        </li>


        <li

          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>🔔 Notifications</span>
          <span style={{ fontWeight: "400", color: "#888", fontSize: "0.85em" }}>
            Message, group & call tones
          </span>
        </li>

        <li

          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>💾 Storage and Data</span>
          <span style={{ fontWeight: "400", color: "#888", fontSize: "0.85em" }}>
            Network usage, auto-download
          </span>
        </li>

        <li

          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>👨‍✈️ Accessibility</span>
          <span style={{ fontWeight: "400", color: "#888", fontSize: "0.85em" }}>
            Increase contrast, animation
          </span>
        </li>

        <li

          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>🈯 App Language</span>
          <span style={{ fontWeight: "400", color: "#888", fontSize: "0.85em" }}>
            English (device's language)
          </span>
        </li>

        <li

          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>❔ Help</span>
          <span style={{ fontWeight: "400", color: "#888", fontSize: "0.85em" }}>
            Help center, contact us, privacy policy
          </span>
        </li>

        <li

          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>👨‍👧‍👧 Invite a friend</span>
          <span style={{ fontWeight: "400", color: "#888", fontSize: "0.85em" }}>
            Invite a multiple's friend's
          </span>
        </li>

        <li

          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>✅ Site updates</span>
          <span style={{ fontWeight: "400", color: "#888", fontSize: "0.85em" }}>
            Show the lastest updates
          </span>
        </li>
        <hr></hr>

        <ul style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}>

          {[
            { name: "Instagram", icon: "fa-instagram", color: "linear-gradient(45deg, #f58529, #dd2a7b, #8134af, #515bd4)" },
            { name: "Facebook", icon: "fa-facebook", color: "#1877f2" },
            { name: "GitHub", icon: "fa-github", color: "#000" },
            { name: "LinkedIn", icon: "fa-linkedin", color: "#0a66c2" },
          ].map((item, i) => (
            <li
              key={i}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 16px",
                background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
                borderRadius: "14px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1), inset 0 -2px 3px rgba(255,255,255,0.5)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <i
                className={`fa-brands ${item.icon}`}
                style={{
                  fontSize: "22px",
                  ...(item.icon === "fa-instagram"
                    ? {
                      background: item.color,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }
                    : { color: item.color }),
                }}
              ></i>
              <span style={{ fontWeight: "600", color: "#333" }}>{item.name}</span>
            </li>
          ))}
        </ul>

      </ul>
    </div>
  );
};

export default SettingsBox;




