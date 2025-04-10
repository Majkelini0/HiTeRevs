import Navbar from '../../components/Navbar/Navbar.jsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosinstance.js'

const AddReview = () => {
    const [userInfo, setUserInfo] = useState(null)
    const [error, setError] = useState([])
    const navigate = useNavigate()

    const location = useLocation()
    const givenProduct = location.state?.product || {}

    const [title, setTitle] = useState('')
    const [brand, setBrand] = useState(givenProduct.brand || '')
    const [model, setModel] = useState(givenProduct.model || '')
    const [year, setYear] = useState(givenProduct.year || '')
    const [tags, setTags] = useState(givenProduct.tags?.join(" ") || '')
    const [rating, setRating] = useState('')
    const [img, setImg] = useState('')
    const [review, setReview] = useState('')

    const onClick = (event) => {
        event.target.blur()
    }

    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get('/HTRevs/get-user')
            if (response.data) {
                setUserInfo(response.data && response.data.user)
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.clear()
                navigate('/HTRevs/login')
            } else {
                console.error('Error fetching user info:', error)
            }
        }
    }

    const handleAddReview = async (e) => {
        e.preventDefault()

        if (!title || !brand || !model || !year || !tags || !rating || !review) {
            setError('All fields except img are required')
            return
        }
        if (title.length < 15 || title.length > 100) {
            setError('Title must be between 15 and 50 characters')
            return
        }
        if (year.length !== 4) {
            setError('Year must be 4 characters long')
            return
        }
        if (rating < 1 || rating > 5) {
            setError('Rating must be between 1 and 5')
            return
        }
        if (review.length < 50 || review.length > 5000) {
            setError('Review must be between 50 and 5000 characters')
            return
        }
        setError('')

        try {
            const response = await axiosInstance.post('/HTRevs/add-review', {
                title: title,
                review: review,
                brand: brand,
                model: model,
                year: year,
                tags: tags,
                rating: rating,
                img: img,
                givenProductId: givenProduct._id
            })
            if (response.data && response.data.error) {
                setError(response.data.error)
                return
            }

            if (response.data && response.data.message) {
                navigate('/HTRevs')
            }
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message)
            } else {
                setError('An unexpected error occurred')
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await getUserInfo()
        }
        fetchData().catch((error) =>
            console.error('Error initializing data in useEffect:', error)
        )

        return () => {}
    }, [])

    return (
        <>
            <Navbar userInfo={userInfo} />
            <div className={'basic-inputs-container'}>
                <div>
                    <form onSubmit={handleAddReview}>
                        <h1>Add review</h1>
                        <input
                            type={'text'}
                            placeholder={'Eye catching short title'}
                            className={'basic-input'}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            type={'text'}
                            placeholder={'Brand'}
                            className={'basic-input'}
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            disabled={givenProduct.brand}
                        />
                        <input
                            type={'text'}
                            placeholder={'Model'}
                            className={'basic-input'}
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            disabled={givenProduct.model}
                        />
                        <input
                            type={'text'}
                            placeholder={'Release year'}
                            className={'basic-input'}
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            disabled={givenProduct.year}
                        />
                        <input
                            type={'text'}
                            placeholder={'<tag> <tag> <tag> ...'}
                            className={'basic-input'}
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            disabled={givenProduct.tags}
                        />
                        <input
                            type={'number'}
                            placeholder={'Rating'}
                            className={'basic-input'}
                            min={1}
                            max={5}
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                        />
                        <input
                            type={'url'}
                            placeholder={'Image URL'}
                            className={'basic-input'}
                            value={img}
                            onChange={(e) => setImg(e.target.value)}
                        />
                        <textarea
                            placeholder={'Your detailed review'}
                            id={'review-textarea'}
                            className={'basic-input'}
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        />

                        {error && <p>{error}</p>}

                        <button
                            type={'submit'}
                            className={'default-button'}
                            id={'add-review-button'}
                            onClick={onClick}
                        >
                            Add review
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AddReview
