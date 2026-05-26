// src/util/yelp.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const SEARCH_PATH = `${BASE_URL}/api/yelp/businesses/search`;

async function searchBusinesses(term, location, sortBy) {
  // Create URL search parameters using term, location, sort_by, and limit
  const params = new URLSearchParams({
    term,
    location,
    sort_by: sortBy,
    limit: "20",
  });

  // Send a fetch request to the Yelp backend search endpoint
  const res = await fetch(`${SEARCH_PATH}?${params}`);
  // Check if the response failed and throw an error if needed
  if (!res.ok) {
    throw new Error(`Yelp request failed (${res.status})`);
  }

  const data = await res.json();

  return data.businesses.map((b) => ({
    id: b.id,
    imageSrc: b.image_url,
    name: b.name,
    address: b.location.address1,
    city: b.location.city,
    state: b.location.state,
    zipCode: b.location.zip_code,
    category: b.categories[0]?.title,
    rating: b.rating,
    reviewCount: b.review_count,
  }));
}

export { searchBusinesses };