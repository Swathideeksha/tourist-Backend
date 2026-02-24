const mongoose = require("mongoose");

// MongoDB Connection
const MONGO_URI = "mongodb+srv://sushswathi:swathisush1716@cluster0.5bvhfb0.mongodb.net/?appName=Cluster0";

// Place Schema (simplified without middleware)
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

// Places data from frontend places.js
const placesData = [
  // ================= HILL STATIONS =================
  {
    name: "Sakleshpur",
    location: "Hassan",
    description: `Sakleshpur is a scenic hill town in the Hassan district of Karnataka, located in the Western Ghats. It is known for its cool climate, lush greenery, and coffee plantations. Historically, Sakleshpur was ruled by the Chalukyas, Hoysalas, and later the Kingdom of Mysore. The famous Manjarabad Fort was built by Tipu Sultan in 1792 and still stands today.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1600359746315-119f93a7a7d4?w=800"
  },
  {
    name: "Coorg",
    location: "Kodagu",
    description: `Coorg (Kodagu) is a popular hill station in Karnataka, famous for its misty hills, coffee estates, waterfalls, and rich culture. It has a unique history and was ruled by local dynasties before coming under British control. Today, Coorg is known as the "Scotland of India".`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1600359746315-119f93a7a7d4?w=800"
  },
  {
    name: "Chikmagalur",
    location: "Chikmagalur",
    description: `Chikmagalur is a district in the state of Karnataka. Coffee was first cultivated in Chikmagalur in India. The Chikmagalur Mountains, which are part of the Western Ghats, are the source of rivers like Tunga and Bhadra. It is located in the Mullayagiri district of Karnataka, the highest peak.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1600359746315-119f93a7a7d4?w=800"
  },
  {
    name: "Agumbe",
    location: "Shivamogga",
    description: `Agumbe is a scenic hill station in Shivamogga district, known for its lush greenery, waterfalls, and as a base for treks in the Western Ghats. It's often called the "Cherrapunji of the South" due to its high rainfall.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1600359746315-119f93a7a7d4?w=800"
  },
  {
    name: "Bilgiri",
    location: "Chamarajanagar",
    description: `Biligiriranga Hills, or BR Hills, is a scenic hill range in Chamarajanagar District, South-Eastern Karnataka, renowned for the BRT Wildlife Sanctuary, a unique biodiverse ecosystem where the Eastern and Western Ghats meet.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1600359746315-119f93a7a7d4?w=800"
  },
  {
    name: "Gangamoola",
    location: "Chikkamagaluru",
    description: `Gangamoola, located in the Chikkamagaluru district of Karnataka, India, is a significant ecological site in the Western Ghats within the Kudremukh National Park. Known as the birthplace of three rivers—Tunga, Bhadra, and Netravathi.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1600359746315-119f93a7a7d4?w=800"
  },
  {
    name: "Kemmannugundi",
    location: "Chikkamagaluru",
    description: `Kemmannugundi (Red Soil Pit) is a hill station in Tarikere taluk of Chikkamagaluru district in the state of Karnataka, India. It is at the elevation of 1434m above sea level, with its peak at 1863m. This was the summer retreat of Krishnaraja Wodeyar IV.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1600359746315-119f93a7a7d4?w=800"
  },
  {
    name: "Kodachadri",
    location: "Shivamogga",
    description: `Kodachadri is a prominent mountain peak and popular trekking destination situated in the Western Ghats of the Shivamogga (Shimoga) district of Karnataka, India. It is located within the Mookambika Wildlife Sanctuary, near the town of Kollur.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1600359746315-119f93a7a7d4?w=800"
  },
  {
    name: "Kundadri",
    location: "Shivamogga",
    description: `Kundadri is a scenic hill station near Agumbe in Shivamogga district, Karnataka. This 826-meter tall monolithic hill is famous for its 17th-century Jain temple dedicated to Parshwanath.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1600359746315-119f93a7a7d4?w=800"
  },
  {
    name: "Madikeri",
    location: "Kodagu",
    description: `Madikeri is the charming heart of Coorg district in Karnataka, nestled in the Western Ghats. Known as the Queen of Coorg, this historic hill town combines natural beauty with rich cultural heritage.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1600359746315-119f93a7a7d4?w=800"
  },
  {
    name: "Nandi Hills",
    location: "Chikkaballapura",
    description: `Nandi Hills is a scenic hill station located near Chikkaballapura, just 60 kilometers from Bengaluru. Named after the sacred Nandi temple at its base, this picturesque destination is famous for its cool climate and panoramic views.`,
    category: "hill-station",
    image: "https://images.unsplash.com/photo-1600359746315-119f93a7a7d4?w=800"
  },

  // ================= BEACHES =================
  {
    name: "Kapu Beach",
    location: "Udupi",
    description: `Kapu Beach is a beautiful coastal destination in Udupi district, Karnataka. Famous for its iconic lighthouse and vibrant fishing community, this beach offers a perfect blend of natural beauty and local culture.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
  },
  {
    name: "Devbagh Beach",
    location: "Karwar",
    description: `Devbagh Beach is a pristine beach located near Karwar in Karnataka. Known for its serene atmosphere and lush coconut groves, this beach is perfect for those seeking tranquility.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
  },
  {
    name: "Malpe Beach",
    location: "Udupi",
    description: `Malpe Beach is a popular beach destination near Udupi, known for its long stretch of golden sand and clear waters. It's a major fishing harbor and offers various water activities.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
  },
  {
    name: "Mattu Beach",
    location: "Udupi",
    description: `Mattu Beach is a serene beach in Udupi district, known for its peaceful atmosphere and beautiful sunsets. The beach is less crowded compared to other beaches in the area.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
  },
  {
    name: "Murudeshwara Beach",
    location: "Bhatkal",
    description: `Murudeshwara Beach is famous for its massive Lord Shiva statue and the Murudeshwara Temple perched on a hill. The beach offers stunning views of the Arabian Sea.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
  },
  {
    name: "Om Beach",
    location: "Gokarna",
    description: `Om Beach in Gokarna is named after its shape which resembles the Hindi/Sanskrit symbol 'Om'. This beach is famous among backpackers and offers a perfect blend of spirituality and beach culture.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
  },
  {
    name: "Panamburu Beach",
    location: "Mangaluru",
    description: `Panamburu Beach is a beautiful beach near Mangalore, known for its clean waters and black sand. The beach is popular among locals and offers various water sports activities.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
  },
  {
    name: "Someshwara Beach",
    location: "Mangaluru",
    description: `Someshwara Beach is located near Mangalore and is known for its serene environment and the Someshwara Temple nearby. The beach offers a peaceful retreat with its calm waters.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
  },
  {
    name: "St. Mary's Island",
    location: "Udupi",
    description: `St. Mary's Island is a group of islands off the coast of Malpe in Udupi district. These islands are known for their unique columnar basaltic rock formations and pristine beaches.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
  },
  {
    name: "Surathkal Beach",
    location: "Mangaluru",
    description: `Surathkal Beach is a beautiful beach near Mangalore, known for its rocky coastline and the famous Shri Kinnarshi Temple. The beach offers stunning sunset views.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
  },
  {
    name: "Thannirbhavi Beach",
    location: "Mangaluru",
    description: `Thannirbhavi Beach is a serene beach in Mangalore, known for its peaceful atmosphere and beautiful palm groves. The beach is perfect for those looking to escape the crowds.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
  },
  {
    name: "Maravanthe Beach",
    location: "Kundapura",
    description: `Maravanthe Beach is a unique beach where the NH-66 road runs between the beach and a相连的湖泊. This spectacular sight makes it one of the most photogenic beaches in Karnataka.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
  },
  {
    name: "Padubidri Beach",
    location: "Udupi",
    description: `Padubidri Beach is a beautiful beach in Udupi district, known for its pristine beauty and the annual Padubidri Utsav held here. The beach offers a perfect getaway with its golden sand.`,
    category: "beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
  },

  // ================= HISTORY =================
  {
    name: "Hampi",
    location: "Vijayanagara",
    description: `Hampi is a UNESCO World Heritage Site and one of India's most famous historical destinations. It was the capital of the Vijayanagara Empire (14th-16th centuries). The ruins showcase magnificent architecture, temples, and monuments.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Mysore Palace",
    location: "Mysore",
    description: `Mysore Palace is one of India's most iconic palaces, known for its stunning Indo-Saracenic architecture. Built in 1897, it served as the royal residence of the Wodeyar dynasty.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Bijapur Fort",
    location: "Bijapur",
    description: `Bijapur Fort is a massive fortification built in the 16th century by the Adil Shahi dynasty. The fort features solid bastions, gateways, and walls that stretch over 10 km.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Shimoga Fort",
    location: "Shimoga",
    description: `Shimoga Fort is a historical fortification that played an important role during various dynasties. The fort offers panoramic views and remains a testament to the strategic importance of Shimoga.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Badami Caves",
    location: "Badami",
    description: `Badami Caves are a group of Hindu, Buddhist and Jain cave temples located in Badami, Karnataka. The caves date back to the 6th-7th centuries and showcase the evolution of Indian rock-cut architecture.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Halebidu Temple",
    location: "Hassan",
    description: `The Hoysaleswara Temple in Halebidu is a masterpiece of Hoysala architecture built in the 12th century. The temple features intricate stone carvings and sculptures depicting various mythological scenes.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Srirangapatna",
    location: "Mandya",
    description: `Srirangapatna is an island fortress that served as the capital of Tipu Sultan, the famous warrior king. The fort contains several temples, mosques, and historical monuments.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Aihole Temples",
    location: "Bagalkot",
    description: `Aihole is an ancient historical site known as the "Cradle of Indian Architecture." It contains over 120 temples built between the 6th and 12th centuries.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Dandeli Fort",
    location: "Uttara Kannada",
    description: `Dandeli Fort is a historical fortification situated on the banks of the Kali River. It played a significant role in protecting the region during medieval times.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Ramanagaram Fort",
    location: "Ramanagaram",
    description: `Ramanagaram Fort is a historic fortification with ruins that showcase medieval architecture. The fort offers trekking trails and panoramic views of the surrounding landscape.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Hassan",
    location: "Hassan",
    description: `Hassan is home to several historical and religious monuments including temples and ancient sites. The region has a rich history spanning multiple centuries and dynasties.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Bidar Fort",
    location: "Bidar",
    description: `Bidar Fort is one of the largest medieval fortifications in India, built in the 14th century. The fort covers an area of about 70 acres and contains palaces, mosques, and military structures.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Talakadu",
    location: "Mysore",
    description: `Talakadu is an ancient city on the banks of the Kaveri River with several temples buried under sand. It's a sacred pilgrimage site with ruins of temples and historical significance.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Melukote Temple",
    location: "Mandya",
    description: `Melukote is a sacred Hindu pilgrimage site with the renowned Cheluvanarayana Temple. The temple complex contains temples from the Chola and Hoysala periods with intricate carvings.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Somnathpur Temple",
    location: "Mysore",
    description: `Somnathpur Temple is a stunning example of Hoysala architecture built in the 13th century. The temple features intricate stone carvings and a distinctive star-shaped floor plan.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Sringeri Temple",
    location: "Chikmagalur",
    description: `Sringeri is an ancient religious and cultural center located on the banks of the Tunga River. The Sringeri Sharada Pith is one of the four cardinal institutions established by Adi Shankara.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Pattadakal",
    location: "Bagalkot",
    description: `Pattadakal is a UNESCO World Heritage Site featuring a collection of Hindu and Jain temples built between the 7th and 8th centuries. The temples showcase the architectural styles of the Chalukya dynasty.`,
    category: "history",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },

  // ================= RELIGIOUS =================
  {
    name: "Murudeshwara",
    location: "Uttara Kannada",
    description: `Murudeshwara is a sacred Hindu pilgrimage site located on the Arabian Sea coast. The Murudeshwara Temple is famous for its 249-foot tall statue of Shiva, one of the tallest in the world.`,
    category: "religious",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Koti Lingeshwara",
    location: "Kolar",
    description: `Koti Lingeshwara Temple is dedicated to Lord Shiva and is located in Kolar district. The temple is known for its intricate architecture and religious significance. It's believed to house a thousand lingams.`,
    category: "religious",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Banashankari Temple",
    location: "Bagalkot",
    description: `Banashankari Temple is a historic temple dedicated to the Goddess. Located on the banks of the Tungabhadra River, the temple is known for its religious importance and spiritual atmosphere.`,
    category: "religious",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Mookambika Temple",
    location: "Kollur",
    description: `Mookambika Temple is one of the most revered temple complexes in Karnataka, dedicated to the Goddess. Located in the Western Ghats, the temple is surrounded by forests and natural beauty.`,
    category: "religious",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Kedareshwara Temple",
    location: "Halebidu",
    description: `Kedareshwara Temple is an ancient Hindu temple dedicated to Lord Shiva. Located in Halebidu, the temple showcases beautiful medieval architecture with intricate stone carvings.`,
    category: "religious",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Amrutheshwara Temple",
    location: "Chikmagalur",
    description: `Amrutheshwara Temple is an ancient temple dedicated to Lord Shiva. The temple is known for its beautiful architecture and religious significance. Surrounded by coffee plantations and scenic beauty.`,
    category: "religious",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800"
  },
  {
    name: "Kateel",
    location: "Mangalore",
    description: `Kateel is a revered and time-honoured place of worship that continues to inspire deep devotion among countless devotees. Surrounded by a serene atmosphere and enriched with cultural charm, the temple stands as a symbol of faith, tradition, and community bonding.`,
    category: "religious",
    image: "https://dimg04.c-ctrip.com/images/02Y4g12000ack5j164A11_R_1080_808_Q90.jpg"
  }
];

const seedPlaces = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing places
    await Place.deleteMany({});
    console.log("🗑️ Cleared existing places");

    // Insert all places
    await Place.insertMany(placesData);
    console.log(`✅ Successfully added ${placesData.length} places to the database!`);

    // Show summary
    const counts = await Place.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    console.log("\n📊 Summary by category:");
    counts.forEach(c => console.log(`   ${c._id}: ${c.count} places`));

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
};

seedPlaces();
