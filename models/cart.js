
module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQuantity = oldCart.totalQuantity || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  // Increase product by one.
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

  // Decrease product by one.
  this.remove = function(item, id) {
    var storedItem = this.items[id];
    if (!storedItem) return;
    if (storedItem.quantity < 2) {
      this.delete(this.items[id], id);
    } else {
      storedItem.quantity--;
      storedItem.price = storedItem.item.price * storedItem.quantity;
      this.totalQuantity--;
      this.totalPrice -= storedItem.item.price;
    }
  }

  // Removes the item no matter the quantity.
  this.delete = function(item, id) {
    if (this.items[id]) {
      this.totalQuantity -= this.items[id].quantity;
      this.totalPrice -= this.items[id].item.price * this.items[id].quantity;
      delete this.items[id];
    }
  }

  // Generates an array of the items to print in the view.
  this.generateArray = function() {
    var arr = [];
    for (let id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
}
