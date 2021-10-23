const Log = require('./../models/log.model');
const Product = require('./../models/product.model')
const db = require('./../config/postgres-db.config');
const CustomError = require('./../utils/custom-error');

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
                    ...(isProductExists[0].dataValues.lowesttime > expiryTime && {lowesttime: expiryTime}),
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
                        lowesttime: expiryTime
                    },
                    {
                        transaction
                    }
                )
            }

            //create log of the action
            await Log.create({
                expirationtime: expiryTime,
                qty: quantity,
                productId: product.dataValues.id
            }, {transaction})

        })

        

        return;
    }

    static async  setQtyToZero({data, quantity}) {
        await db.transaction(async (transaction) => {
            //update the sold qty column in the log table 
            await Log.update({soldqty: data.qty, state: 'sold'}, {where: { id: data.id}}, {transaction});
            //update the qty and lowesttime column in the product table 
            await Product.findByPk(data.productId).then(product => {
                return product.decrement('qty', {by: data.qty}, {transaction})
            });
            await Product.update({lowesttime: data.expirationtime}, {where: {id: data.productId}})
        })

        return {quantity : (quantity - data.qty)} 
    }

    static async sellProduct(data) {
        const {item} = data.params;
        let {quantity} = data.body;
        const unchangedQty = quantity;

        //verify that total products in stock can cather for quantity to be sold 
        const isProductSufficient = await Product.findAll({where: {name: item}})

        if(isProductSufficient[0].dataValues.qty < quantity) throw new CustomError('Out of quantity!')

        //get products from the log table that haven't been sold out and arrange in ascending order of expiration time 
        const logRecords = await db.query(`SELECT * FROM products, logs WHERE products.name = '${item}' AND logs.qty != logs.soldqty ORDER BY logs.expirationtime ASC`);

        //start transaction here 
        // await db.transaction(async (transaction) => {
        //     for(let i = 0; i < logRecords[0].length ; i++) {
        //         console.log(`log record ${i} `, logRecords[0][i])
        //         console.log('quantity before ', quantity);

        //         if((logRecords[0][i].qty -logRecords[0][i].soldqty) - quantity < 0 ) { 
        //             let updatedQty = await this.setQtyToZero({data: logRecords[0][i], quantity});
        //             quantity = updatedQty.quantity;
        //             console.log('quantity after', quantity);
        //             continue 
        //         }

        //         //update the logs table 
        //         await Log.findByPk(logRecords[0][i].id).then(log => {
        //             log.increment('soldqty', {by: quantity}, {transaction})
        //         })
        //         //update the products table 
        //         await Product.findByPk(logRecords[0][i].productId).then(product => {
        //             product.decrement('qty', {by: quantity}, {transaction})
        //         })
        //         await Product.update({lowesttime: logRecords[0][i].lowesttime}, {where: {
        //             id: logRecords[0][i].productId
        //         }}, {transaction})

        //         break;
        //     }
        // });
        //start transaction here 
        await db.transaction(async (transaction) => {
            let logIdsSetToZero = [];
            let logsToUpdate = null;
            for(let i = 0; i < logRecords[0].length ; i++) {
                console.log(`log record ${i} `, logRecords[0][i]);
                console.log('quantity before ', quantity);

                if((logRecords[0][i].qty -logRecords[0][i].soldqty) - quantity < 0 ) { 
                    logIdsSetToZero.push(logRecords[0][i].id);
                    quantity -= logRecords[0][i].qty
                    console.log('quantity after', quantity);
                    continue 
                }

                logsToUpdate = {id: logRecords[0][i].id, quantity, timestamp: logRecords[0][i].lowesttime}
                break;
            }

            let logUpdate = `UPDATE logs SET soldqty = qty, state =  'sold' WHERE id IN (${logIdsSetToZero.join(',')})`
            logUpdate += logsToUpdate !== null ? ` \n UPDATE logs SET soldqty = '${logsToUpdate.quantity}' WHERE id = '${logsToUpdate.id}'` : ';'
            let productUpdate = `UPDATE products SET products.qty = products.qty - ${unchangedQty} WHERE products.name = '${item}'`;
            if(productUpdate  !== null){
                const lowestTime = `SELECT expirationtime FROM logs ORDER BY logs.expirationtime ASC LIMIT 1`
                productUpdate += ` \n UPDATE products SET products.lowesttime = '${lowestTime}'`
            }else {
                productUpdate += `\n UPDATE products SET products.lowesttime = '${logsToUpdate.timestamp}' WHERE products.name = '${item}'` 
            }
            console.log('log update query ::', logUpdate);
            console.log('product update query ::', productUpdate);

            await db.query(logUpdate, {transaction});
            await db.query(productUpdate, {transaction})


        });

        return;
    }

    static async getProduct(data) {
        const {item} = data.params

        const product = await Product.findAll({where: { name: item}})

        return product[0].dataValues.qty == 0 ? {quantity: product[0].dataValues.qty, validTill: product[0].dataValues.lowesttime} : {quantity: product[0].dataValues.qty, validTill: product[0].dataValues.lowesttime} ;
    }
}

module.exports = ProductService;