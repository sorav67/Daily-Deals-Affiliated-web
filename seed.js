const LIVE_API_URL = "https://affiliate-site-lake.vercel.app/api/deals";
const API_SECRET = "your-super-secret-n8n-password"; // Make sure this matches your .env!

const dealsToPost = [
  {
    title: "Razer DeathAdder V3 Pro Wireless Gaming Mouse",
    content: "Ultra-lightweight wireless esports mouse with a 30K optical sensor. Massive price drop today. If you need precision for competitive play, this is the lowest price we've seen all month.",
    affiliateUrl: "https://amazon.in",
    platform: "Amazon",
    imageUrl: "https://images.unsplash.com/photo-1527814050087-379381547969?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Keychron K2 Wireless Mechanical Keyboard",
    content: "Compact 84-key RGB bluetooth keyboard. Perfect for writing code or marathon gaming sessions. Includes tactile brown switches.",
    affiliateUrl: "https://amazon.in",
    platform: "Amazon",
    imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "LG UltraGear 27-inch 144Hz Gaming Monitor",
    content: "1ms response time and incredible color accuracy. This IPS panel is currently 30% off. A must-have upgrade for your rig.",
    affiliateUrl: "https://flipkart.com",
    platform: "Flipkart",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Xbox Core Wireless Controller - Carbon Black",
    content: "The gold standard for PC and console gaming. Features a hybrid D-pad and textured grip. Grab it before the stock runs out.",
    affiliateUrl: "https://amazon.in",
    platform: "Amazon",
    imageUrl: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Samsung 980 PRO 2TB PCIe NVMe Gen4 SSD",
    content: "Expand your storage with read speeds up to 7,000 MB/s. Perfect for massive game libraries or heavy software environments.",
    affiliateUrl: "https://amazon.in",
    platform: "Amazon",
    imageUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Logitech MX Master 3S Wireless Mouse",
    content: "The ultimate productivity mouse. Features ultra-fast scrolling and a 8K DPI sensor that tracks on glass. Huge discount applied at checkout.",
    affiliateUrl: "https://amazon.in",
    platform: "Amazon",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac1e653815f7?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "ASUS ROG Zephyrus G14 Gaming Laptop",
    content: "Incredible power in a 14-inch chassis. Perfect for rendering 3D environments or taking your setup on the go.",
    affiliateUrl: "https://flipkart.com",
    platform: "Flipkart",
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Corsair Vengeance LPX 32GB DDR4 RAM",
    content: "Give your system the memory it needs to multitask effortlessly. This 3200MHz kit is currently at an all-time low price.",
    affiliateUrl: "https://amazon.in",
    platform: "Amazon",
    imageUrl: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Elgato Stream Deck MK.2",
    content: "15 customizable LCD keys to control your apps, tools, and platforms. An incredible tool for automating your workflow.",
    affiliateUrl: "https://amazon.in",
    platform: "Amazon",
    imageUrl: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Sony PlayStation 5 Console - Disc Edition",
    content: "Rare restock alert! Get the flagship console with the DualSense controller. Limited quantities available.",
    affiliateUrl: "https://flipkart.com",
    platform: "Flipkart",
    imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Anker 735 Charger (GaNPrime 65W)",
    content: "Charge your laptop, phone, and accessories simultaneously with this ultra-compact brick. Essential for tech minimalism.",
    affiliateUrl: "https://amazon.in",
    platform: "Amazon",
    imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Apple iPad Air",
    content: "Desktop-class performance in a tablet. Excellent for mobile game testing, reading, or media consumption.",
    affiliateUrl: "https://amazon.in",
    platform: "Amazon",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "SteelSeries Arctis Nova Pro Wireless Headset",
    content: "Premium high-fidelity audio with active noise cancellation. Features a hot-swappable battery system so you never lose audio.",
    affiliateUrl: "https://amazon.in",
    platform: "Amazon",
    imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Secretlab TITAN Evo Gaming Chair",
    content: "Ergonomic support built for long hours at the desk. Features a magnetic memory foam head pillow and 4-way lumbar support.",
    affiliateUrl: "https://amazon.in",
    platform: "Amazon",
    imageUrl: "https://images.unsplash.com/photo-1598550473305-949e25e98f06?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Nintendo Switch OLED Model",
    content: "Experience games with vibrant colors and crisp contrast. The OLED screen makes a massive difference for handheld play.",
    affiliateUrl: "https://flipkart.com",
    platform: "Flipkart",
    imageUrl: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&w=800&q=80"
  }
];

async function seedDatabase() {
  console.log("🚀 Starting visual database upload to live server...");
  
  for (let i = 0; i < dealsToPost.length; i++) {
    const deal = dealsToPost[i];
    deal.secret = API_SECRET;

    try {
      const response = await fetch(LIVE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deal)
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Success [${i + 1}/15]: Added ${deal.title} (with image)`);
      } else {
        console.error(`❌ Failed [${i + 1}/15]: ${data.error}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`💥 Network Error on deal ${i + 1}:`, error.message);
    }
  }
  
  console.log("🎉 All done! Go check your beautiful live website.");
}

seedDatabase();