import './ReviewsList.css'
import { Link } from 'react-router-dom'
import axiosInstance from '../../utils/axiosinstance.js'
import PropTypes from 'prop-types'
import { useState } from 'react'

const ReviewsList = ({ reviews, userInfo }) => {
    if (!reviews) {
        return null
    }

    const [currentPage, setCurrentPage] = useState(1)
    const reviewsPerPage = 5

    const indexOfLastReview = currentPage * reviewsPerPage
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview)

    const paginate = (event, pageNumber) => {
        event.target.blur()
        setCurrentPage(pageNumber)
    }

    const handleDeleteReview = async (reviewId) => {
        event.preventDefault()
        event.target.blur()

        try {
            const response = await axiosInstance.post('/HTRevs/delete-review', {
                reviewId: reviewId,
            })
            if (response.data && response.data.message) {
                console.log(response.data.message)
            }
            window.location.reload()
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                console.error(error.response.data.message)
            } else {
                console.error('An unexpected error occurred')
            }
        }
    }

    return (
        <div className={'reviews-list'}>
            <h1>Reviews</h1>
            <ul>
                {currentReviews.map((review) => (
                    <li key={review._id}>
                        <Link to={`/HTRevs/reviews?reviewId=${review._id}`}>
                            {review.title}
                            <p>{review.tags.join(" ")}</p>
                        </Link>

                        {userInfo && userInfo._id === review.userID && (
                            <button
                                className={'default-button'}
                                onClick={() => handleDeleteReview(review._id)}
                            >
                                Delete
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            <div className="pagination">
                {Array.from(
                    { length: Math.ceil(reviews.length / reviewsPerPage) },
                    (_, index) => (
                        <button
                            key={index + 1}
                            onClick={(event) => paginate(event, index + 1)}
                            className={
                                currentPage === index + 1 ? 'active' : ''
                            }
                            id={'default-button'}
                        >
                            {index + 1}
                        </button>
                    )
                )}
            </div>
        </div>
    )
}

ReviewsList.propTypes = {
    reviews: PropTypes.array,
    userInfo: PropTypes.object,
}

export default ReviewsList
