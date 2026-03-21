fetch('http://localhost:3000/api/deals', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: "Sony WH-1000XM5 Headphones - Massive Drop!",
    content: "This is an automated test review to see if the database is working. These headphones have excellent noise cancellation.",
    affiliateUrl: "https://amazon.in/dp/B09XS7JWHH?tag=test-tag-21",
    platform: "Amazon",
    secret: "your-super-secret-n8n-password" 
  })
})
.then(response => response.json())
.then(data => console.log("Server Response:", data))
.catch(error => console.error("Error:", error));