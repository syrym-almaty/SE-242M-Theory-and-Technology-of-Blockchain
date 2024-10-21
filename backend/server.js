// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const web3 = require('./web3');
const contract = require('./contract');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Define API routes here

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// POST /listItem
app.post('/listItem', async (req, res) => {
    const { sellerAddress, name, description, price } = req.body;

    if (!web3.utils.isAddress(sellerAddress)) {
        return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    try {
        const tx = contract.methods.listItem(name, description, web3.utils.toWei(price, 'ether'));
        const gas = await tx.estimateGas({ from: sellerAddress });
        const gasPrice = await web3.eth.getGasPrice();
        const data = tx.encodeABI();

        const nonce = await web3.eth.getTransactionCount(sellerAddress);

        const signedTx = await web3.eth.accounts.signTransaction(
            {
                to: contract.options.address,
                data,
                gas,
                gasPrice,
                nonce,
            },
            process.env.PRIVATE_KEY
        );

        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        res.json({
            transactionHash: receipt.transactionHash,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// POST /purchaseItem
app.post('/purchaseItem', async (req, res) => {
    const { buyerAddress, itemId } = req.body;

    if (!web3.utils.isAddress(buyerAddress)) {
        return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    try {
        const item = await contract.methods.items(itemId).call();
        const price = item.price;

        const tx = contract.methods.purchaseItem(itemId);
        const gas = await tx.estimateGas({ from: buyerAddress, value: price });
        const gasPrice = await web3.eth.getGasPrice();
        const data = tx.encodeABI();

        const nonce = await web3.eth.getTransactionCount(buyerAddress);

        const signedTx = await web3.eth.accounts.signTransaction(
            {
                to: contract.options.address,
                data,
                gas,
                gasPrice,
                nonce,
                value: price,
            },
            process.env.PRIVATE_KEY
        );

        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        res.json({
            transactionHash: receipt.transactionHash,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// POST /addReview
app.post('/addReview', async (req, res) => {
    const { reviewerAddress, itemId, rating, comment } = req.body;

    if (!web3.utils.isAddress(reviewerAddress)) {
        return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    try {
        const tx = contract.methods.addReview(itemId, rating, comment);
        const gas = await tx.estimateGas({ from: reviewerAddress });
        const gasPrice = await web3.eth.getGasPrice();
        const data = tx.encodeABI();

        const nonce = await web3.eth.getTransactionCount(reviewerAddress);

        const signedTx = await web3.eth.accounts.signTransaction(
            {
                to: contract.options.address,
                data,
                gas,
                gasPrice,
                nonce,
            },
            process.env.PRIVATE_KEY
        );

        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        res.json({
            transactionHash: receipt.transactionHash,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /getItem/:itemId
app.get('/getItem/:itemId', async (req, res) => {
    const itemId = req.params.itemId;

    try {
        const item = await contract.methods.items(itemId).call();
        res.json({
            itemId: item.itemId,
            seller: item.seller,
            name: item.name,
            description: item.description,
            price: web3.utils.fromWei(item.price, 'ether'),
            sold: item.sold,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /getReviews/:itemId
app.get('/getReviews/:itemId', async (req, res) => {
    const itemId = req.params.itemId;

    try {
        const reviews = await contract.methods.getReviews(itemId).call();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
