import './ImageCard.css'
import { useEffect, useState } from 'react'

const ImageCard = ({ imgUrls }) => {
    if (!imgUrls) {
        return null
    }

    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % imgUrls.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [imgUrls.length])

    return (
        <div className="product-image">
            <img src={imgUrls[currentIndex]} alt={'no available images'} />
        </div>
    )
}

export default ImageCard
