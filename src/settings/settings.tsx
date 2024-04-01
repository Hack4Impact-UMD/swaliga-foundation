"use client";

export default function Settings() {
    /* add functionality for updating user type after editing */
    
    return (
        <>
            <div className="leftPane">
                <img src="/swaliga-website-logo.png" alt="swaliga logo" />
                <p>Home</p>
                <p>Student ID: XXX-XXX-XXXX</p>
                <div className="settingsBtn">
                    <button>
                        Settings
                    </button>
                </div>
            </div>

            <div className="rightPane">
                <div className="headSection">
                    <h1 className="settingsHeader">Settings</h1>
                </div>

                <div className="settingsContainer">
                    <div className="settingField">
                        <input type="text" />
                        <button className="editBtn">Edit</button>
                    </div>
                </div>

                <div className="btnsContainer">
                    <button>Back to Home</button>
                    <button>Cancel</button>
                    <button>Save Changes</button>
                </div>
            </div>
        </>
    )
}