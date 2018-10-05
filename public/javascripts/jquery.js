
$(function() {
  var handler = StripeCheckout.configure({
    key: 'pk_test_ptCDSnOn0yibg7HwsHfBRvs1',
    locale: 'auto',
    token: function(token) {
      // You can access the token ID with `token.id`.
      // Get the token ID to your server-side code for use.
      console.log(token);
      console.log(token.id);
    }
  });

  // Checkout process.
  $('#checkout').click(function(event) {
    $('#checkout').prop('disabled', true);
    let price = Number($('#checkout-price').text());
    console.log(price, typeof price);
    handler.open({
      name: 'Checkout',
      amount: price * 100
    });
  })

  // Close Checkout on page navigation:
  window.addEventListener('popstate', function() {
    handler.close();
  });
});
