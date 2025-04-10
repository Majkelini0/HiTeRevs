import Navbar from '../../components/Navbar/Navbar.jsx'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosinstance.js'
import './Home.css'

const Home = () => {
    const [Products, setProducts] = useState([])
    const [userInfo, setUserInfo] = useState(null)
    const [search, setSearch] = useState('')

    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get('/HTRevs/get-user')
            if (response.data) {
                setUserInfo(response.data && response.data.user)
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token')
            } else {
                console.error('Error fetching user info:', error)
            }
        }
    }

    const getProducts = async () => {
        try {
            const response = await axiosInstance.get('/HTRevs/products')
            if (response.data && response.data.products) {
                setProducts(response.data.products)
            }
        } catch (error) {
            console.error('Error getting products:', error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await getProducts()
            await getUserInfo()
        }
        fetchData().catch((error) =>
            console.error('Error initializing data in useEffect:', error)
        )

        return () => {}
    }, [])

    const filteredProducts = Products.filter((product) => {
        const tags = search.toLowerCase().split(' ').filter(tag => tag)
        return tags.every(tag =>
            product.brand.toLowerCase().includes(tag) ||
            product.model.toLowerCase().includes(tag) ||
            product.year.toString().includes(tag) ||
            (product.tags && product.tags.some(productTag => productTag.toLowerCase().includes(tag)))
        )
    })

    return (
        <>
            <Navbar userInfo={userInfo} />
            <div className="info-container">
                <p>
                    Hight Tech Reviews is a website that allows you to post your
                    own reviews on smartphones, headphones, smartwatches,
                    laptops and everything else tech related. You can also see
                    what other people think about the same products. Weather you
                    are a tech enthusiast or just a regular user, HTRevs is the
                    place for you. So grab a cup of coffee and start reviewing!
                    Every review matters!
                </p>
            </div>

            <div className={'search-container'}>
                <input
                    type="text"
                    className={'basic-input'}
                    placeholder="Add [space] after each tag"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className={'tiles-container'}>
                <ul className={'tiles'}>
                    {filteredProducts.map((product) => (
                        <li key={product._id}>
                            <Link to={`/HTRevs/product?productId=${product._id}`}>
                                <span className={'product-title'}>
                                    {`${product.brand} ${product.model}`}
                                </span>
                                <p className={'product-year'}>
                                    Release: {product.year}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Home
