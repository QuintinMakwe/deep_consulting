const Log = require('./../models/log.model');
const Product = require('./../models/product.model')
const db = require('./../config/postgres-db.config');

class ProductService{
    static async addProduct(data){
        const {quantity, expiryTime} =  data.body;
        const {item} = data.params
        let product;

        //check that product exist
        const isProductExists = await Product.findAll(
            {
                where: {
                    name: item
                }
            }
        )

        await db.transaction(async (transaction) => {
            //if product exists, update product quantity
            if(isProductExists.length > 0){
                product = isProductExists[0];
                //check that expirytime is lower before updating object
                const updateObj = {
                    ...(isProductExists[0].dataValues.lowestTime > expiryTime && {lowestTime: expiryTime}),
                    ...({qty: isProductExists[0].dataValues.qty + quantity})
                }

                await Product.update({...updateObj}, {
                    where: {
                        name: item
                    }
                }, {transaction})
 
            }else {
                product = await Product.create(
                    {
                        name: item, 
                        qty: quantity,
                        lowestTime: expiryTime
                    },
                    {
                        transaction
                    }
                )
            }

            //create log of the action
            await Log.create({
                expirationTime: expiryTime,
                qty: quantity,
                productId: product.dataValues.id
            }, {transaction})

        })

        

        return;
    }
}

module.exports = ProductService;