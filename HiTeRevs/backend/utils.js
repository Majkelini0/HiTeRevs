const jwt = require('jsonwebtoken');
const Product = require("./models/product.model");

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    })
}

function getCapitalizedSentence(sentence){
    const sentenceArray = sentence.split(' ');
    for(let i = 0; i < sentenceArray.length; i++){
        sentenceArray[i] = sentenceArray[i].charAt(0).toUpperCase() + sentenceArray[i].slice(1).toLowerCase();
    }
    return sentenceArray.join(' ');
}

function getLowerCaseSentence(sentence){
    const sentenceArray = sentence.split(' ');
    for(let i = 0; i < sentenceArray.length; i++){
        sentenceArray[i] = sentenceArray[i].toLowerCase();
    }
    return sentenceArray.join(' ');
}

async function updateProducts(newReview) {
    const products = await Product.find();

    if (!products || products.length === 0) {
        const newProduct = new Product({
            tags: newReview.tags,
            brand: newReview.brand,
            model: newReview.model,
            year: newReview.year,
            reviewIDs: [newReview._id],
            rating: newReview.rating,
            revsCount: 1
        });
        await newProduct.save();

    } else {
        let foundProduct = null;

        for (const product of products) {
            const matchingTags = product.tags.filter(tag => newReview.tags.includes(tag));
            const matchPercentage = (matchingTags.length / product.tags.length) * 100;

            if (
                product.brand === newReview.brand &&
                product.model === newReview.model &&
                product.year === newReview.year &&
                matchPercentage >= 75
            ) {
                foundProduct = product;
                break;
            }
        }

        if (foundProduct) {
            foundProduct.reviewIDs.push(newReview._id);
            foundProduct.rating = ((foundProduct.rating * foundProduct.revsCount + newReview.rating) / (foundProduct.revsCount + 1));
            foundProduct.revsCount++;
            await foundProduct.save();
        } else {
            const newProduct = new Product({
                tags: newReview.tags,
                brand: newReview.brand,
                model: newReview.model,
                year: newReview.year,
                reviewIDs: [newReview._id],
                rating: newReview.rating,
                revsCount: 1
            });
            await newProduct.save();
        }
    }
}

module.exports = {
    authenticateToken,
    getCapitalizedSentence,
    getLowerCaseSentence,
    updateProducts
}
