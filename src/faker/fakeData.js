const {faker} = require('@faker-js/faker');
const fakerArray = [];

for (let index = 0; index < 5; index++) {
    let obj = {
        producto:faker.commerce.productName(),
        precio:  faker.commerce.price(),
        thumbnail: faker.image.imageUrl()
    }
   
    fakerArray.push(obj)
}
console.log(fakerArray)

module.exports= {fakerArray}
