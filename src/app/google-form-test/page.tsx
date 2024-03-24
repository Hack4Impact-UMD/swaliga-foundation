'use client';

export default function TestPage() {
    const handleCreateForm = async () => {
        try {
            const response = await fetch('/api/google-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const formDetails = await response.json();
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
