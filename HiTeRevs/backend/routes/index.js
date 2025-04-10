const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {authenticateToken, getCapitalizedSentence, getLowerCaseSentence, updateProducts} = require('../utils');
//const updateProducts = require('../utils2');
const User = require('../models/user.model');
const Review = require('../models/review.model');
const Product = require('../models/product.model');
const bcrypt = require('bcrypt');
require('dotenv').config();

router.get('/', authenticateToken, async function (req, res, next) {

});

router.post('/HTRevs/register', async function (req, res) {
    const {fullName, login, password} = req.body;
    if (!login) {
        return res.status(400).json({error: true, message: 'Login is required'});
    }
    if (!password) {
        return res.status(400).json({error: true, message: 'Password is required'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const isUser = await User.findOne({login: login});

    if (isUser) {
        return res.status(400).json({error: true, message: 'User already exists'});
    }

    const capitalizedFullName = getCapitalizedSentence(fullName);

    const user = new User({
        fullName: capitalizedFullName,
        login: login,
        password: hashedPassword
    });
    await user.save();

    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1m'});

    return res.json({
        user,
        accessToken,
        message: 'User created successfully'
    });
});

router.post('/HTRevs/login', async function (req, res) {
    const {login, password} = req.body;
    if (!login) {
        return res.status(400).json({error: 'Login is required'});
    }
    if (!password) {
        return res.status(400).json({error: 'Password is required'});
    }

    const user = await User.findOne({login: login});

    if (!user) {
        return res.status(400).json({error: true, message: 'Invalid credentials'});
    }
    if (user.isDeleted) {
        return res.status(400).json({error: true, message: 'Account was deleted'});
    }

    if (await bcrypt.compare(password, user.password) && user.login === login) {
        const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});

        return res.json({
            user,
            accessToken,
            message: 'Login successful'
        })
    } else {
        return res.status(400).json({error: true, message: 'Invalid credentials'});
    }
});

router.post('/HTRevs/add-review', authenticateToken, async function (req, res) {
    let {title, review, brand, model, year, tags, rating, img, givenProductId} = req.body;
    const {user} = req.user;

    title = getCapitalizedSentence(title).trimEnd();
    brand = getLowerCaseSentence(brand).trimEnd();
    model = getLowerCaseSentence(model).trimEnd();
    year = year.trimEnd();
    tags = getLowerCaseSentence(tags).split(' ');

    try {
        const newReview = new Review({
            title: title,
            review: review,
            brand: brand,
            model: model,
            year: year,
            tags: tags,
            rating: rating,
            img: img,
            userID: user._id
        });
        const newReviewMongoDB = await newReview.save();

        if (!givenProductId) {
            try {
                await updateProducts(newReviewMongoDB);
            } catch (error) {
                return res.json({error: true, message: 'Review added but -> Error updating products'});
            }
        } else {
            try {
                const existingProduct = await Product.findById(givenProductId);
                console.log('existingProduct:', existingProduct);

                existingProduct.reviewIDs.push(newReviewMongoDB._id);
                existingProduct.rating = ((existingProduct.rating * existingProduct.revsCount + Number(rating)) / (existingProduct.revsCount + 1));
                existingProduct.revsCount += 1;
                existingProduct.save();
            } catch (error) {
                return res.json({error: true, message: 'Review added but -> Error updating products'});
            }
        }


        return res.json({message: 'Review added successfully'});
    } catch (error) {
        return res.status(500).json({error: true, message: 'Internal server error'});
    }
});

router.get('/HTRevs/account/reviews', authenticateToken, async function (req, res) {
    try {
        const id = req.user.user._id;

        const reviews = await Review.find({userID: id, isDeleted: false});

        return res.json({error: false, message: 'Reviews found', reviews});
    } catch (error) {
        console.error('Error in /:id/reviews endpoint:', error);
        return res.status(500).json({error: true, message: 'Internal server error'});
    }
});

router.get('/HTRevs/products', async function (req, res) {
    try {
        const products = await Product.find();

        return res.json({error: false, message: 'Products found', products});
    } catch (error) {
        console.error('Error in /products endpoint:', error);
        return res.status(500).json({error: true, message: 'Internal server error'});
    }
});

router.get('/HTRevs/product/:id', async function (req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(400).json({error: true, message: 'Product not found'});
        }

        return res.json({error: false, message: 'Product found', product});
    } catch (error) {
        console.log('Error in /product/:id endpoint:', error);
        return res.status(500).json({error: true, message: 'Internal server error'});
    }
});

router.get('/HTRevs/product/:id/reviews', async function (req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(400).json({error: true, message: 'Product not found'});
        }
        const reviewsIDs = product.reviewIDs;
        const productReviews = await Review.find({_id: {$in: reviewsIDs}, isDeleted: false});

        if (!productReviews) {
            return res.status(400).json({error: true, message: 'Product reviews not found'});
        }

        return res.json({error: false, message: 'Product reviews found', productReviews});
    } catch (error) {
        console.log('Error in /product/:id/reviews endpoint:', error);
        return res.status(500).json({error: true, message: 'Internal server error'});
    }
});

router.get('/HTRevs/reviews/:id', async function (req, res) {
    try {
        // const review = await Review.findById(req.params.id);
        const review = await Review.findOne({_id: req.params.id, isDeleted: false});
        if (!review) {
            return res.status(400).json({error: true, message: 'Review not found'});
        }

        return res.json({error: false, message: 'Review found', review});
    } catch (error) {
        console.log('Error in /reviews/:id endpoint:', error);
        return res.status(500).json({error: true, message: 'Internal server error'});
    }
});

router.post('/HTRevs/delete-review', authenticateToken, async function (req, res) {
    try {
        const reviewId = req.body.reviewId;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(400).json({error: true, message: 'Review not found'});
        }
        review.isDeleted = true;
        review.save();

        return res.json({error: false, message: 'Review deleted successfully'});

    } catch (error) {
        console.log('Error in /delete-review endpoint:', error);
        return res.status(500).json({error: true, message: 'Internal server error'});
    }
});


router.get('/HTRevs/get-user', authenticateToken, async function (req, res) {
    try {
        if (!req.user || !req.user.user) {
            return res.status(401).json({error: true, message: 'Unauthorized'});
        }
        const {user} = req.user;
        const isUser = await User.findById(user._id);

        if (!isUser) {
            console.log('User not found');
            return res.status(400).json({error: true, message: 'User not found'});
        }

        return res.status(200).json({
            error: false,
            message: 'User found',
            user: {
                fullName: isUser.fullName,
                login: isUser.login,
                _id: isUser._id,
                createdOn: isUser.createdOn,
            },
        });
    } catch (error) {
        console.error('Error in /get-user endpoint:', error);
        return res.status(500).json({error: true, message: 'Internal server error'});
    }
});

router.post('/HTRevs/update-account', authenticateToken, async function (req, res) {
    try {
        const {fullName, login, oldPassword, newPassword, pass} = req.body;
        const {user} = req.user;

        const isUser = await User.findById(user._id);

        if (!isUser) {
            return res.status(400).json({error: true, message: 'User not found'});
        }

        if (pass === true) {
            if (!await bcrypt.compare(oldPassword, isUser.password)) {
                return res.status(400).json({error: true, message: 'Invalid credentials'});
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            isUser.fullName = fullName;
            isUser.login = login;
            isUser.password = hashedPassword;

            await isUser.save();
        } else {
            isUser.fullName = fullName;
            isUser.login = login;

            await isUser.save();
        }

        return res.json({message: 'Account updated successfully'});
    } catch (error) {
        console.error('Error in /update-account endpoint:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
});

router.post('/HTRevs/delete-account', authenticateToken, async function (req, res) {
    try {
        const {user} = req.user;

        const isUser = await User.findById(user._id);

        if (!isUser) {
            return res.status(400).json({error: true, message: 'User not found'});
        }

        isUser.login = isUser.login + '.deleted:' + Date.now();
        isUser.isDeleted = true;
        isUser.save();

        return res.json({message: 'Account deleted successfully'});
    } catch (error) {
        console.error('Error in /delete-account endpoint:', error);
        return res.status(500).json({error: 'Internal server error'});
    }
});

module.exports = router;
