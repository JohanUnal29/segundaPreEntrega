const cartId = "6497cdf848cb396f1df1a87a";

async function addToCart(productId) {
  let response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: "POST",
    body: JSON.stringify({ quantity: 1 }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  let result = await response.json();
  console.log(result);
}
