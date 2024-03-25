"use client";
import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "konva/lib/shapes/Line";
import { Stage, Layer, Line } from "react-konva/lib/ReactKonvaCore";
import { Polygon, Dims } from "@/types/konva-types";
import styles from "./CreateAccountPage.module.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function CreateAccountPage() {
    const [dims, setDims] = useState<Dims>({ width: 0, height: 0 });
    const [polygons, setPolygons] = useState<Polygon[]>([]);
    const [polygonOverlay, setPolygonOverlay] = useState<Polygon[]>([]);

    const updateDims = useCallback(() => {
      setDims({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    useEffect(() => {
      updateDims();
      window.addEventListener("resize", updateDims);
      return () => window.removeEventListener("resize", updateDims);
    }, [updateDims]);

    //Generating the polygons present in the background
    const generatePolygons = useCallback((dims: Dims) => {
      const coords: Polygon[] = [
        {
          points: [
            0,
            0,
            0,

            dims.height / 30,
            (50 / 100) * dims.width,
            dims.height,

            dims.width,
            dims.height,
            dims.width,
            
            0.45 * dims.height,
            dims.height / 60,
            0,
          ],
          fill: "#D0D12A",
        },
        {
          points: [
            0,
            dims.height / 60,
            0,
            dims.height,
            (50 / 85) * dims.width,
            dims.height,
          ],
          fill: "#295972",
        },
        {
          points: [
            dims.height / 60,
            0,
            dims.width,
            0,
            dims.width,
            0.45 * dims.height,
          ],
          fill: "#295972",
        },
      ];
      setPolygons(coords);
    }, []);

    const generatePolygonOverlay = useCallback((dims: Dims) => {
      const coords: Polygon[] = [
        {
          points: [
            dims.width / 2,
            0.15 * dims.height,
            0.875 * dims.width,
            0.15 * dims.height,
            0.875 * dims.width,
            0.39375 * dims.height,
            dims.width / 2,
            0.225 * dims.height,
          ],
          fill: "#D0D12A",
        },
        {
          points: [
            dims.width / 2,
            0.225 * dims.height,
            0.875 * dims.width,
            0.39375 * dims.height,
            0.875 * dims.width,
            0.85 * dims.height,
            0.5 * dims.width,
            0.85 * dims.height,
          ],
          fill: "#295972",
        },
      ];
      setPolygonOverlay(coords);
    }, []);

    useEffect(() => {
      if (dims.width && dims.height) {
        generatePolygons(dims);
        generatePolygonOverlay(dims);
      }
    }, [dims, generatePolygons]);

    const drawPolygon = (polygon: Polygon) => (
      <Line
        key={polygon.points.toString()}
        points={polygon.points}
        fill={polygon.fill}
        closed
        stroke="black"
        strokeWidth={0}
      />
    );

    const [accountInfo, setAccountInfo] = useState({
          firstName: '',
          middleName: '',
          lastName: '',
          name: '',
          email: '',
          phoneNumber: '',
          emergencyEmail: '',
          emergencyPhone: '',
          password: '',
          confirmPassword: '',
          streetName: '',
          city: '',
          state: '',
          zipCode: '',
        });
      
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [emergencyContacts, setEmergencyContacts] = useState([
        { name: '', email: '', phone: '' } // Start with one empty contact
    ]);
    
    const addEmergencyContact = () => {
        setEmergencyContacts([...emergencyContacts, { name: '', email: '', phone: '' }]);
    };
    
    const deleteEmergencyContact = (index: number) => {
        setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
    };
    
    const handleEmergencyContactChange = (index: number, field: 'name' | 'email' | 'phone', value: string) => {
        const updatedContacts = [...emergencyContacts];

        // Perform letter check only when the field being changed is 'name'
        if (field === 'name' && value !== '' && !/^[A-Za-z\s]*$/.test(value)) {
            // If it doesn't, just return without updating the state
            return;
        }

        if (field === 'phone' && value !== '' && !/^\d+$/.test(value)) {
            // If it doesn't, just return without updating the state
            return;
        }

        // Update the specified contact field with the new value
        updatedContacts[index] = { ...updatedContacts[index], [field]: value };

        // Update the state with the new contacts array
        setEmergencyContacts(updatedContacts);
    };
      
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if ((name === 'phoneNumber' || name === 'zipCode') && value !== '' && !/^\d+$/.test(value)) {
            // If input is not numeric, prevent the update
            return;
        }

        if ((name === 'city' || name === 'state' || name === 'firstName' || name === 'middleName' || name === 'lastName') && value !== '' && !/^[A-Za-z ]*$/.test(value)) {
            // If input is not text, prevent the update
            return;
        }

        setAccountInfo(prevState => ({
        ...prevState,
        [name]: value,
        }));

        if (name === 'password' || name === 'confirmPassword') {
            if (name === 'password' && accountInfo.confirmPassword && value !== accountInfo.confirmPassword) {
                setPasswordError("Passwords do not match");
            } else if (name === 'confirmPassword' && accountInfo.password && value !== accountInfo.password) {
                setPasswordError("Passwords do not match");
            } else {
                setPasswordError(""); // Clear error if passwords match
            }
        }
    };
      
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
      
    return (
        <div className={styles.container}>
            <div className={styles.background}>
                <Stage className={styles.stage} width={dims.width} height={dims.height}>
                    <Layer>
                        {polygons.map(drawPolygon)}
                        {polygonOverlay.map(drawPolygon)}
                    </Layer>
                </Stage>
                <div className={styles.createAccountContainer}>
                    <h2 className={styles.createAccountTitle}>Create Account</h2>
                </div>
                <form className={styles.accountForm}>
                    {/* Fields for Name on School Record */}
                    <div className={styles.formGroupRow}>
                        <div className={styles.formGroup}>
                            <label>Name on School Record <span className={styles.requiredAsterisk}>*</span></label>
                            <div className={styles.inputRow}>
                                <div className={styles.inputIconGroup}>
                                    <i className="fas fa-address-card"></i>
                                    <input type="text" name="firstName" placeholder="First" value={accountInfo.firstName} onChange={handleChange} />
                                </div>
                                <div className={styles.inputIconGroup}>
                                    <i className="fas fa-address-card"></i>   
                                    <input type="text" name="middleName" placeholder="Middle" value={accountInfo.middleName} onChange={handleChange} />
                                </div>
                                <div className={styles.inputIconGroup}>
                                    <i className="fas fa-address-card"></i>
                                    <input type="text" name="lastName" placeholder="Last" value={accountInfo.lastName} onChange={handleChange} />
                                </div>   
                            </div>
                        </div>
                    </div>

                    {/* Fields for Personal Info */}
                    <div className={styles.formGroupRow}>
                        <div className={styles.formGroup}>
                            <label>Personal Info <span className={styles.requiredAsterisk}>*</span></label>
                            <div className={styles.inputRow}>
                                <div className={styles.inputIconGroup}>
                                    <i className="fas fa-envelope"></i>
                                    <input type="email" name="email" placeholder="Enter email" value={accountInfo.email} onChange={handleChange} />
                                </div>
                                <div className={styles.inputIconGroup}>
                                    <i className="fas fa-phone"></i>
                                    <input type="tel" name="phoneNumber" placeholder="Enter phone number" value={accountInfo.phoneNumber} onChange={handleChange} />
                                </div>   
                            </div>
                        </div>
                    </div>

                    {/* Fields for Emergency Contact Info */}
                    <div className={styles.formGroupRow}>
                        <div className={styles.formGroup}>
                            <label>Emergency Contact Info <span className={styles.requiredAsterisk}>*</span></label>
                            {emergencyContacts.map((contact, index) => (
                                <>
                                <div className={styles.contactContainer} key={index}>
                                    <div className={styles.inputIconGroup}>
                                        <i className="fas fa-user"></i>
                                        <input 
                                            type="name" 
                                            name="emergencyName" 
                                            placeholder="Enter name" 
                                            value={contact.name} 
                                            onChange={(e) => handleEmergencyContactChange(index, 'name', e.target.value)} 
                                        />
                                    </div>
                                    <div className={styles.inputIconGroup}>
                                        <i className="fas fa-envelope"></i>
                                        <input 
                                            type="email" 
                                            name="emergencyEmail" 
                                            placeholder="Enter email" 
                                            value={contact.email} 
                                            onChange={(e) => handleEmergencyContactChange(index, 'email', e.target.value)} 
                                        />
                                    </div>
                                    <div className={styles.inputIconGroup}>
                                        <i className="fas fa-phone"></i>
                                        <input 
                                            type="tel" 
                                            name="emergencyPhone" 
                                            placeholder="Enter phone number" 
                                            value={contact.phone} 
                                            onChange={(e) => handleEmergencyContactChange(index, 'phone', e.target.value)} 
                                        />
                                    </div>
                                    <button className={styles.emergencyRemoveButton} type="button" onClick={() => deleteEmergencyContact(index)}>
                                        Remove Contact
                                    </button>
                                </div>
                                </>
                            ))}
                            <button className={styles.emergencyAddButton} type="button" onClick={addEmergencyContact}>
                                Add Emergency Contact
                            </button>
                        </div>
                    </div>    

                    {/* Fields for Password with Visibility Toggle */}
                    <div className={styles.formGroupRow}>
                        <div className={styles.formGroup}>
                        <label style={{ color: passwordError ? 'red' : 'inherit' }}>Create Password <span className={styles.requiredAsterisk}>*</span></label>
                            <div className={`${styles.inputIconGroup} ${passwordError ? styles.inputError : ''}`}>
                                <i className={`${styles.inputIconGroup} ${passwordError ? styles.inputError : ''}`}></i>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter password"
                                    value={accountInfo.password}
                                    onChange={handleChange}
                                />
                                <i
                                    className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                                    onClick={togglePasswordVisibility}
                                ></i>
                            </div>
                            <div className={`${styles.inputIconGroup} ${passwordError ? styles.inputError : ''}`}>
                                <i className={`${styles.inputIconGroup} ${passwordError ? styles.inputError : ''}`}></i>
                                <input
                                    className={passwordError ? styles.inputError : ""}
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    value={accountInfo.confirmPassword}
                                    onChange={handleChange}
                                />
                                <i
                                    className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
                                    onClick={toggleConfirmPasswordVisibility}
                                ></i>
                            </div>
                            {passwordError && <div className={styles.passwordError}>{passwordError}</div>}
                        </div>
                    </div>

                    {/* Address Fields */}
                    <div className={styles.formGroupRow}>
                        <div className={styles.formGroup}>
                            <label>Home Address <span className={styles.requiredAsterisk}>*</span></label>
                            <div className={styles.inputRow}>
                                <div className={styles.inputIconGroup}>
                                    <i className="fas fa-road"></i>
                                    <input type="text" name="streetName" placeholder="Street Name" value={accountInfo.streetName} onChange={handleChange} />
                                </div>
                                <div className={styles.inputIconGroup}>
                                    <i className="fas fa-city"></i>   
                                    <input type="text" name="city" placeholder="City" value={accountInfo.city} onChange={handleChange} />
                                </div>
                                <div className={styles.inputIconGroup}>
                                    <i className="fas fa-landmark"></i>
                                    <input type="text" name="state" placeholder="State" value={accountInfo.state} onChange={handleChange} />
                                </div>   
                                <div className={styles.inputIconGroup}>
                                    <i className="fas fa-map-pin"></i>
                                    <input type="text" name="zipCode" placeholder="Zip Code" value={accountInfo.zipCode} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton}>Submit</button>
                </form>
            </div>
        </div>
    );
};
