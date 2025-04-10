import './ReviewCard.css'

const ReviewCard = ({ review }) => {
    if (!review) {
        return null
    }

    return (
        <div className={'review-card'}>
            <h1>{review.title}</h1>
            <h2>{review.review}</h2>
            <br></br>
            <br></br>
            <p>Rating: {review.rating}</p>
            <p>Tags: {review.tags.join(', ')}</p>
            <p>Created on: {new Date(review.createdOn).toDateString()}</p>
        </div>
    )
}

export default ReviewCard;