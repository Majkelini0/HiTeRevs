import Navbar from '../../components/Navbar/Navbar.jsx'
import axiosInstance from '../../utils/axiosinstance.js'
import { useLocation} from 'react-router-dom'
import { useEffect, useState } from 'react'
import ProductCard from '../../components/Cards/ProductCard.jsx'
import ImageCard from '../../components/Cards/ImageCard.jsx'
import ReviewsList from '../../components/Lists/ReviewsList.jsx'
import './Product.css'


const Product = () => {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const productId = queryParams.get('productId')

    const [userInfo, setUserInfo] = useState(null)
    const [product, setProduct] = useState(null)
    const [productReviews, setProductReviews] = useState([])
    const [imgUrls, setImgUrls] = useState([])

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

    const getProduct = async () => {
        try {
            const response = await axiosInstance.get(`/HTRevs/product/${productId}`)
            if (response.data) {
                setProduct(response.data.product)
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

    const getProductReviews = async () => {
        try {
            const response = await axiosInstance.get(
                `/HTRevs/product/${productId}/reviews`
            )
            if (response.data) {
                setProductReviews(response.data && response.data.productReviews)
                console.log(response.data.productReviews)
                const imageUrls = response.data.productReviews
                    .map((review) => review.img)
                    .filter((url) => url !== '')
                setImgUrls(imageUrls)
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
            await getProductReviews()
            await getUserInfo()
            await getProduct()

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
                <div className={'product-container'}>
                    <ImageCard imgUrls={imgUrls} />
                    <ProductCard product={product} />
                </div>

                <div className={'reviews-container'}>
                    <ReviewsList userInfo={userInfo} reviews={productReviews} />
                </div>
            </div>
        </>
    )
}

export default Product;
