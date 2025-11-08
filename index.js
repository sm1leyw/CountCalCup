function searchRestaurant() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const restaurants = document.querySelectorAll(".restaurant");

  restaurants.forEach(r => {
    const name = r.textContent.toLowerCase();
    if (name.includes(input)) {
      r.classList.remove("hidden");
    } else {
      r.classList.add("hidden");
    }
  });
}