var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping', {
  useNewUrlParser: true
});

var products = [
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/2/2e/In_Rainbows_Official_Cover.jpg',
    title: 'In Rainbows',
    description: 'Very nice album from the band Radiohead.',
    price: 11
  }),
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/c/c5/BlackHolesCover.jpg',
    title: 'Black Holes & Revelations',
    description: 'Powerful Muse!',
    price: 9
  }),
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/d/df/RedHotChiliPeppersCalifornication.jpg',
    title: 'Californication',
    description: 'Dream of Californication by the Chili Peppers.',
    price: 7
  })
];

let i = 0;
for (let product of products) {
  product.save(function(err, result) {
    i++;
    if (i >= products.length) mongoose.disconnect();
  })
}
