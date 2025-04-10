import './ProductCard.css'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product }) => {
    if (!product) {
        return null
    }
    const navigate = useNavigate()

    const brand = product.brand.toUpperCase()
    const model = product.model.toUpperCase()
    const year = product.year
    const rating = product.rating
    const tags = product.tags.join(" ")
    const revsCount = product.revsCount

    const handleAddLinkedReview = async (e) => {
        e.preventDefault();
        e.target.blur();

        navigate('/HTRevs/addreview', {state: {product: product}});
    }

    return (
        <div className="product-info">
            <h1>Brand: {brand}</h1>
            <h2>Model: {model}</h2>
            <h2>Release year: {year}</h2>
            <h2>
                Rating: {rating} ({revsCount} reviews)
            </h2>
            <h2>Tags: {tags}</h2>
            <div className={'button-border'}>
                <button className={'default-button'} onClick={handleAddLinkedReview}>Add Review</button>
            </div>
        </div>
    )
}

export default ProductCard
