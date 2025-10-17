import { useState, useRef, useEffect } from "react";
import EditUser from "../EditUserWindow/EditUser";
import DeleteUser from "../DeleteUserWindow/DeleteUser";
import SettingsBox from "./SettingsBox/SettingsBox";
import AccountBox from "./SettingsBox/AccountBox/AccountBox";
import SecurityNotificationsBox from "./SettingsBox/AccountBox/SecurityNotificationsBox/SecurityNotificationsBox";
import PassKeysBox from "./SettingsBox/AccountBox/PassKeysBox/PassKeys";
import EmailAddressBox from "./SettingsBox/AccountBox/EmailAddressBox/EmailAddress";
import TwoStepVerificationBox from "./SettingsBox/AccountBox/TwoStepVerificationBox/TwoStepVerification";
import ChangeNumberBox from "./SettingsBox/AccountBox/ChangePhoneBox/ChangePhone";
import RequestAccountInfoBox from "./SettingsBox/AccountBox/RequestAccountInfoBox/RequestAccountInfo";
import AddAccountForm from "./SettingsBox/AccountBox/AddAccountBox/AddAccount";
import DeleteAccountBox from "./SettingsBox/AccountBox/DeleteAccountBox/DeleteAccount";
import Privacy from "./SettingsBox/Privacy/PrivacyBox";

type User = {
    name: string;
    email: string;
    avatar: string;
};

type SidebarProps = {
    currentUser: User;
    onCreateGroup?: () => void;
};

type ActiveModal =
    | "menu"
    | "settings"
    | "account"
    | "securityNotifications"
    | "passkeys"
    | "emailaddress"
    | "twoStepVerification"
    | "changeNumber"
    | "requestaccountinfo"
    | "addaccount"
    | "deleteaccount"

    | "privacy"
    | null;


const Sidebar: React.FC<SidebarProps> = ({ currentUser, onCreateGroup }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setActiveModal(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);



    return (
        <div className="user-menu-wrapper" ref={menuRef}>
            <div
                className="current-user-avatar"
                onClick={() => setActiveModal(activeModal === "menu" ? null : "menu")}
            >
                {currentUser.avatar ? (
                    <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${currentUser.avatar}`}
                        alt={currentUser.name}
                        className="avatar-img"
                    />
                ) : (
                    <span>{currentUser.name.charAt(0)}</span>
                )}
            </div>

            {activeModal === "menu" && (
                <div className="user-menu-box">
                    <button onClick={() => setActiveModal(null)}>✖</button>
                    <ul>
                        <li onClick={() => setActiveModal("settings")}>⚙️ Settings</li>
                        <li onClick={() => {
                            setActiveModal(null);
                            onCreateGroup && onCreateGroup();
                        }}>
                            ➕ New Group
                        </li>
                        <li className="coming-soon">🌐 New Community</li>
                        <li className="coming-soon">📢 New Broadcast</li>
                        <li className="coming-soon">🔗 Linked Devices</li>
                        <li className="coming-soon">💳 Payments</li>
                        <li className="coming-soon">📖 Read All</li>
                        <li className="coming-soon">♋ Starred</li>
                    </ul>
                </div>
            )}

            {activeModal === "settings" && (
                <SettingsBox
                    currentUser={currentUser}
                    onEdit={() => setShowEdit(true)}
                    onDelete={() => setShowDelete(true)}
                    onOpenAccount={() => setActiveModal("account")}
                    onOpenPrivacy={() => setActiveModal("privacy")}
                    onClose={() => setActiveModal(null)}
                />
            )}

            {activeModal === "account" && (
                <AccountBox
                    onBack={() => setActiveModal("settings")}
                    onOpenSecurity={() => setActiveModal("securityNotifications")}
                    onOpenPassKeys={() => setActiveModal("passkeys")}
                    onOpenEmialAddress={() => setActiveModal("emailaddress")}
                    onOpenTwoStepVerification={() => setActiveModal("twoStepVerification")}
                    onOpenChangeNumber={() => setActiveModal("changeNumber")}
                    onOpenRequestAccountInfo={() => setActiveModal("requestaccountinfo")}
                    onOpenAddAccount={() => setActiveModal("addaccount")}
                    onOpenDeleteAccount={() => setActiveModal("deleteaccount")}
                />
            )}


            {activeModal === "securityNotifications" && (
                <SecurityNotificationsBox onBack={() => setActiveModal("account")} />
            )}


            {activeModal === "passkeys" && (
                <PassKeysBox onBack={() => setActiveModal("account")} />
            )}

            {activeModal === "emailaddress" && (
                <EmailAddressBox onBack={() => setActiveModal("account")}
                    userEmail={currentUser.email}
                />
            )}

            {activeModal === "twoStepVerification" && (
                <TwoStepVerificationBox
                    onBack={() => setActiveModal("account")}
                    userEmail={currentUser.email}
                />
            )}

            {activeModal === "changeNumber" && (
                <ChangeNumberBox onBack={() => setActiveModal("account")} />
            )}


            {activeModal === "requestaccountinfo" && (
                <RequestAccountInfoBox onBack={() => setActiveModal("account")} />
            )}


            {activeModal === "addaccount" && (
                <AddAccountForm onBack={() => setActiveModal("account")} />
            )}


            {/* {activeModal === "deleteaccount" && (
                <DeleteAccountBox onBack={() => setActiveModal("account")} />
            )} */}



            {activeModal === "privacy" && (
                <Privacy />
            )}

            {showEdit && <EditUser user={currentUser} onClose={() => setShowEdit(false)} />}
            {showDelete && <DeleteUser user={currentUser} onClose={() => setShowDelete(false)} />}
        </div>
    );
};

export default Sidebar;
