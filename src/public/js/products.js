async function addToCart(productId) {
  const cartId = "6497cdf848cb396f1df1a87a";
  const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  console.log(result);
}
