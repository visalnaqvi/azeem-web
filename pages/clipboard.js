'use client';

import { useEffect, useState } from 'react';
import { listenToClipboard } from '@/services/getData';

export default function ClipboardViewer() {
    const [clipboard, setClipboard] = useState([]);
    const [error, setError] = useState('');
    const [copiedIndex, setCopiedIndex] = useState(null);

    useEffect(() => {
        const unsubscribe = listenToClipboard(
            (data) => setClipboard(data),
            (err) => setError('Failed to listen to clipboard updates.')
        );

        return () => unsubscribe && unsubscribe(); // Cleanup listener on unmount
    }, []);

    const handleCopy = async (text, index) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 1500);
        } catch (err) {
            console.error("Copy failed:", err);
        }
    };

    return (
        <div className="clipboard-background">
            {clipboard.map((item, i) => (
                <div className='clipboard-box' key={i}>
                    <p>{item.content}</p>
                    <button onClick={() => handleCopy(item.content, i)}>
                        {copiedIndex === i ? "Copied!" : "Copy"}
                    </button>
                </div>
            ))}

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
