import React, { useEffect, useState } from 'react';
import { listAllImages } from '@/services/storage';
import Image from 'next/image';
import styles from "./style.module.css"

const ImageGallery = ({ onClick, btnText, btnType }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const imgs = await listAllImages();
            setImages(imgs);
        } catch (err) {
            console.error("Error listing images:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);



    return (
        <div>
            <h2 className={styles.heading}>Image Gallery</h2>
            <div className={`${styles.info} ${styles.reload}`} onClick={fetchImages}>Reload</div>
            {loading ? (
                <p>Loading images...</p>
            ) : (
                <div className={styles.cardWrapper}>
                    {images.map(({ url, path }) => (
                        <div key={path} className={styles.card}>
                            <Image width={300} height={300} src={url} alt="Uploaded" className="w-full max-w-xs rounded shadow" />
                            <div
                                onClick={() => { onClick(path, url) }}
                                className={`${styles.button} ${styles[btnType]}`}
                            >
                                {btnText}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ImageGallery;