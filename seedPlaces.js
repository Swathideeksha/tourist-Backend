const mongoose = require("mongoose");

// MongoDB Connection
const MONGO_URI = "mongodb+srv://sushswathi:swathisush1716@cluster0.5bvhfb0.mongodb.net/?appName=Cluster0";

// Place Schema
const placeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ["beach", "hill-station", "history", "religious"] },
  image: { type: String, default: "" },
  images: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  savedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Place = mongoose.model("Place", placeSchema);

// Places data with external images that work immediately
const placesData = [
  // ================= HILL STATIONS =================
  {
    name: "Sakleshpur",
    location: "Hassan",
    description: `Sakleshpur is a scenic hill town in the Hassan district of Karnataka, located in the Western Ghats. It is known for its cool climate, lush greenery, and coffee plantations.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1600359746315-119f93a7a7d4?w=800"
  },
  {
    name: "Coorg",
    location: "Kodagu",
    description: `Coorg (Kodagu) is a popular hill station in Karnataka, famous for its misty hills, coffee estates, waterfalls, and rich culture. Known as the "Scotland of India".`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1585938389612-a552a28d6914?w=800"
  },
  {
    name: "Chikmagalur",
    location: "Chikmagalur",
    description: `Chikmagalur is a district in the state of Karnataka. Coffee was first cultivated in Chikmagalur in India.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1545696968-1a5245650b36?w=800"
  },
  {
    name: "Agumbe",
    location: "Shivamogga",
    description: `Agumbe is a scenic hill station in Shivamogga district, known for its lush greenery and waterfalls.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800"
  },
  {
    name: "Bilgiri",
    location: "Chamarajanagar",
    description: `Biligiriranga Hills, or BR Hills, is a scenic hill range in Chamarajanagar District.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
  },
  {
    name: "Gangamoola",
    location: "Chikkamagaluru",
    description: `Gangamoola is a significant ecological site in the Western Ghats, known as the birthplace of three rivers.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800"
  },
  {
    name: "Kemmannugundi",
    location: "Chikkamagaluru",
    description: `Kemmannugundi is a hill station at elevation of 1434m above sea level. This was the summer retreat of Krishnaraja Wodeyar IV.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800"
  },
  {
    name: "Kodachadri",
    location: "Shivamogga",
    description: `Kodachadri is a prominent mountain peak and popular trekking destination in the Western Ghats.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800"
  },
  {
    name: "Kundadri",
    location: "Shivamogga",
    description: `Kundadri is a scenic hill station famous for its 17th-century Jain temple.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800"
  },
  {
    name: "Madikeri",
    location: "Kodagu",
    description: `Madikeri is the charming heart of Coorg district, known as the Queen of Coorg.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1596436897705-55d392f9f298?w=800"
  },
  {
    name: "Nandi Hills",
    location: "Chikkaballapura",
    description: `Nandi Hills is a scenic hill station near Bengaluru, famous for its cool climate and panoramic views.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1568454537842-d933259bb258?w=800"
  },

  // ================= BEACHES =================
  {
    name: "Kapu Beach",
    location: "Udupi",
    description: `Kapu Beach is a beautiful coastal destination famous for its iconic lighthouse.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
  },
  {
    name: "Devbagh Beach",
    location: "Karwar",
    description: `Devbagh Beach is a pristine beach known for its serene atmosphere.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800"
  },
  {
    name: "Malpe Beach",
    location: "Udupi",
    description: `Malpe Beach is a popular beach destination known for its golden sand.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800"
  },
  {
    name: "Mattu Beach",
    location: "Udupi",
    description: `Mattu Beach is a serene beach known for its peaceful atmosphere.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1473116763249-2f3bfa18f1b1?w=800"
  },
  {
    name: "Murudeshwara Beach",
    location: "Bhatkal",
    description: `Murudeshwara Beach is famous for its massive Lord Shiva statue.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1537519646069-2f3bfa18f1b1?w=800"
  },
  {
    name: "Om Beach",
    location: "Gokarna",
    description: `Om Beach in Gokarna is named after its shape which resembles 'Om'.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1455729552865-3658a5d39692?w=800"
  },
  {
    name: "Panamburu Beach",
    location: "Mangaluru",
    description: `Panamburu Beach is a beautiful beach known for its clean waters.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=800"
  },
  {
    name: "Someshwara Beach",
    location: "Mangaluru",
    description: `Someshwara Beach is known for its serene environment.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1505238680356-667803448bb1?w=800"
  },
  {
    name: "St. Mary's Island",
    location: "Udupi",
    description: `St. Mary's Island is known for its unique columnar basaltic rock formations.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800"
  },
  {
    name: "Surathkal Beach",
    location: "Mangaluru",
    description: `Surathkal Beach is known for its rocky coastline.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?w=800"
  },
  {
    name: "Thannirbhavi Beach",
    location: "Mangaluru",
    description: `Thannirbhavi Beach is known for its peaceful atmosphere.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800"
  },
  {
    name: "Maravanthe Beach",
    location: "Kundapura",
    description: `Maravanthe Beach is a unique beach where the road runs between the beach and a lake.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
  },
  {
    name: "Padubidri Beach",
    location: "Udupi",
    description: `Padubidri Beach is known for its pristine beauty.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=800"
  },

  // ================= HISTORICAL SITES =================
  {
    name: "Hampi",
    location: "Vijayanagara",
    description: `Hampi is a UNESCO World Heritage Site and one of India's most famous historical destinations.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Mysore Palace",
    location: "Mysore",
    description: `Mysore Palace is one of India's most iconic palaces, known for its stunning Indo-Saracenic architecture.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1589740734696-133c3013e036?w=800"
  },
  {
    name: "Badami Caves",
    location: "Badami",
    description: `Badami Caves are a group of Hindu, Buddhist and Jain cave temples.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Bijapur Fort",
    location: "Bijapur",
    description: `Bijapur Fort is a massive fortification built in the 16th century.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Shimoga Fort",
    location: "Shimoga",
    description: `Shimoga Fort is a historical fortification.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Halebidu Temple",
    location: "Hassan",
    description: `The Hoysaleswara Temple in Halebidu is a masterpiece of Hoysala architecture.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Srirangapatna",
    location: "Mandya",
    description: `Srirangapatna is an island fortress that served as the capital of Tipu Sultan.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Aihole Temples",
    location: "Bagalkot",
    description: `Aihole is known as the "Cradle of Indian Architecture".`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Dandeli Fort",
    location: "Uttara Kannada",
    description: `Dandeli Fort is a historical fortification.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Ramanagaram Fort",
    location: "Ramanagaram",
    description: `Ramanagaram Fort is a historic fortification.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Hassan",
    location: "Hassan",
    description: `Hassan is home to several historical and religious monuments.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Bidar Fort",
    location: "Bidar",
    description: `Bidar Fort is one of the largest medieval fortifications in India.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Talakadu",
    location: "Mysore",
    description: `Talakadu is an ancient city with several temples buried under sand.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Melukote Temple",
    location: "Mandya",
    description: `Melukote is a sacred Hindu pilgrimage site.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Somnathpur Temple",
    location: "Mysore",
    description: `Somnathpur Temple is a stunning example of Hoysala architecture.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Sringeri Temple",
    location: "Chikmagalur",
    description: `Sringeri is an ancient religious and cultural center.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Pattadakal",
    location: "Bagalkot",
    description: `Pattadakal is a UNESCO World Heritage Site.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },

  // ================= RELIGIOUS SITES =================
  {
    name: "Murudeshwara",
    location: "Uttara Kannada",
    description: `Murudeshwara is a sacred Hindu pilgrimage site famous for its 249-foot tall statue of Shiva.`,
    category: "religious",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Koti Lingeshwara",
    location: "Kolar",
    description: `Koti Lingeshwara Temple is dedicated to Lord Shiva.`,
    category: "religious",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Banashankari Temple",
    location: "Bagalkot",
    description: `Banashankari Temple is a historic temple dedicated to the Goddess.`,
    category: "religious",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Mookambika Temple",
    location: "Kollur",
    description: `Mookambika Temple is one of the most revered temple complexes in Karnataka.`,
    category: "religious",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Kedareshwara Temple",
    location: "Halebidu",
    description: `Kedareshwara Temple is an ancient Hindu temple dedicated to Lord Shiva.`,
    category: "religious",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Amrutheshwara Temple",
    location: "Chikmagalur",
    description: `Amrutheshwara Temple is an ancient temple dedicated to Lord Shiva.`,
    category: "religious",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Kateel",
    location: "Mangalore",
    description: `Kateel is a revered place of worship.`,
    category: "religious",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
];

async function seedPlaces() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Place.deleteMany({});
    console.log("🗑️ Cleared existing places");

    await Place.insertMany(placesData);
    console.log(`✅ Successfully added ${placesData.length} places to the database!`);

    const summary = {};
    placesData.forEach(p => {
      summary[p.category] = (summary[p.category] || 0) + 1;
    });
    console.log("\n📊 Summary by category:");
    Object.entries(summary).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} places`);
    });

    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding places:", error);
    process.exit(1);
  }
}

seedPlaces();
