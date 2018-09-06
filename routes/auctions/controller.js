const models = require('../../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const auction = models.auction
const users = models.user
const bids = models.bid

const controller = {
    
    //-------------------------------------------------------------------------------------------
    get: (req, res, next) => {
        auction
            .findAll({
                include:[{
                    model: users
                },{
                    model: bids
                }]
            })
            .then(auctions => {
                if (auctions.length == 0) {
                    res.status(400).send({
                        message: 'Sorry, your data is empty.'
                    })
                    console.log('Sorry, auction data is empty.')
                }
                else if (auctions.length > 0){
                    res.status(200).send(auctions)
                    console.log('Yeah! You have some auction data!')
                }
            })
            .catch(error => {
                res.status(400).send({
                    error
                })
            })
    },

    //-------------------------------------------------------------------------------------------
    post: (req, res, next) => {
        const {
            user_id,
            category_id,
            title,
            item_condition,
            item_description,
            quantity,
            start_bid,
            max_bid,
            min_bid,
            bids_multiply,
            start_date,
            end_date,
            item_photo,
            status
        } = req.body;
        if (
            user_id &&
            category_id &&
            title &&
            item_condition &&
            item_description &&
            quantity &&
            start_bid &&
            max_bid &&
            min_bid &&
            bids_multiply &&
            start_date &&
            end_date &&
            item_photo &&
            status
        ){
            auction
                .create({
                    user_id,
                    category_id,
                    title,
                    item_condition,
                    item_description,
                    quantity,
                    start_bid,
                    max_bid,
                    min_bid,
                    bids_multiply,
                    start_date,
                    end_date,
                    item_photo,
                    status,
                    created_at: new Date()
                })
                .then(newAuction => {
                    res.status(200).send(newAuction)
                    console.log('You have sent a new auction data!')
                })
                .catch(error => {
                    res.status(400).send({error})
                })
        }
        else{
            res.status(400).send({message: 'You must fill every field!'})
            console.log('You must fill every field!')
        }
    },

    //-------------------------------------------------------------------------------------------
    getById: (req, res, next) => {
        const { auction_id } = req.params
        auction
            .findOne({
                where:{
                    auction_id
                },
                include:[{
                    model: users
                },{
                    model: bids
                }]
            })
            .then(auctionData => {
                if (!auctionData){
                    res.status(400).send({message: 'Sorry, your data is empty.'})
                    console.log('Sorry, auction data is empty.')
                }
                else{
                    res.status(200).send(auctionData)
                    console.log('Yeah! You have some auction data!')
                }
            })
            .catch(error => {
                res.status(400).send({
                    error
                })
            })
    },

    //-------------------------------------------------------------------------------------------
    getByUserId: (req, res, next) => {
        const { user_id } = req.params
        auction
            .findAll({
                where:{
                    user_id
                },
                include:[{
                    model: users
                },{
                    model: bids
                }]
            })
            .then(auctionData => {
                if (auctionData.length == 0) {
                    res.status(400).send({
                        message: 'Sorry, your data is empty.'
                    })
                    console.log('Sorry, auction data is empty.')
                }
                else{
                    res.status(200).send(auctionData)
                    console.log('Yeah! You have some auction data!')
                }
            })
            .catch(error => {
                res.status(400).send({
                    error
                })
            })
    },

    //-------------------------------------------------------------------------------------------
    getByStatus: (req, res, next) => {
        const { status } = req.params
        auction
            .findAll({
                where:{
                    status
                },
                include:[{
                    model: users
                }, {
                    model: bids
                }]
            })
            .then(auctionData => {
                if (auctionData.length == 0) {
                    res.status(400).send({
                        message: 'Sorry, your data is empty.'
                    })
                    console.log('Sorry, auction data is empty.')
                }
                else{
                    res.status(200).send(auctionData)
                    console.log('Yeah! You have some auction data!')
                }
            })
            .catch(error => {
                res.status(400).send({
                    error
                })
            })
    },

    //-------------------------------------------------------------------------------------------
    searchByKeyword: (req, res, next) => {
        const keyword = String(req.query.q).toLowerCase()
        
        if (keyword){
            auction
                .findAll({
                    where: {
                        title : {
                            [Op.like]: `%${keyword}%`
                        }
                    }
                })
                .then(auctions => {
                    if (auctions.length == 0){
                        res.status(400).send({
                            message: "Corresponding data is empty"
                        })
                    }
                    else if (auctions.length > 0){
                        res.status(200).send(auctions)
                    }
                })
                .catch(error => {
                    res.status(400).send(error)
                })
        }
        else{
            // res.status(200).send({
            //     message: "You have to insert the keywords"
            // })
            res.send(auctions)
        }
    },

    //-------------------------------------------------------------------------------------------
    updateAuction: (req, res, next) => {
        const { auction_id } = req.params
        auction.update({
                user_id: req.body.user_id,
                title: req.body.title,
                item_condition: req.body.item_condition,
                item_description: req.body.item_description,
                quantity: req.body.quantity,
                start_bid: req.body.start_bid,
                max_bid: req.body.max_bid,
                min_bid: req.body.min_bid,
                bids_multiply: req.body.bids_multiply,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                item_photo: req.body.item_photo,
                status: req.body.status,
                created_at: new Date()
            }, {
                where: {
                    auction_id
                }
            })
            .then(bid => {
                res.status(200).send({
                    bid
                })
            })
            .catch(err => {
                res.status(400).send({
                    message: 'Update bid failed'
                })
            })
    },

    //-------------------------------------------------------------------------------------------
    deleteAuction: (req, res, next) => {
        const { auction_id } = req.params
        auction.destroy({
                where: {
                    auction_id
                }
            })
            .then(auction => {
                res.status(200).send({
                    auction
                });
            })
            .catch(err => {
                res.status(400).send({
                    message: 'Delete auction failed'
                })
            })
    }
}

module.exports = controller