
module.exports = function Cart(oldCart) {
  this.items = oldCart.items ? oldCart.items : {};
  this.totalQuantity = oldCart.totalQuantity ? oldCart.totalQuantity : 0;
  this.totalPrice = oldCart.totalPrice ? oldCart.totalPrice : 0;

  this.add = function(item, id) {
    var storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = {item: item, price: 0, quantity: 0};
    }
    storedItem.quantity++;
    storedItem.price = storedItem.item.price * storedItem.quantity;
    this.totalQuantity++;
    this.totalPrice += storedItem.item.price;
  };

  this.generateArray = function() {
    var arr = [];
    for (let id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
}
