"use client";
import React from "react";
import { createGoogleForm } from '@/lib/firebase/createGoogleForm';

export default function testPage() {
    const handleCreateForm = async () => {
        try {
            const formDetails = await createGoogleForm();
            console.log('Form Created Successfully:', formDetails);
        } catch (error) {
            console.error('Error creating form:', error);
        }
    };

    return (
        <div>
            <button onClick={handleCreateForm}>Create Google Form</button>
        </div>
    );
}