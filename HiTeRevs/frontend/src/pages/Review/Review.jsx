import axiosInstance from '../../utils/axiosinstance.js'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar.jsx'
import ReviewCard from '../../components/Cards/ReviewCard.jsx'
import './Review.css'

const Review = () => {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const reviewId = queryParams.get('reviewId')

    const [userInfo, setUserInfo] = useState(null)
    const [review, setReview] = useState(null)

    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get('/HTRevs/get-user')
            if (response.data) {
                setUserInfo(response.data && response.data.user)
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.clear()
            } else {
                console.error('Error fetching user info:', error)
            }
        }
    }

    const getReview = async () => {
        try {
            const response = await axiosInstance.get(`/HTRevs/reviews/${reviewId}`)
            if (response.data) {
                setReview(response.data && response.data.review)
            }
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

    useEffect(() => {
        const fetchData = async () => {
            await getUserInfo()
            await getReview()
        }
        fetchData().catch((error) =>
            console.error('Error initializing data in useEffect:', error)
        )

        return () => {}
    }, [])

    return (
        <>
            <Navbar userInfo={userInfo} />

            <div className={'main'}>
                <ReviewCard review={review} />
            </div>
        </>
    )
}

export default Review
