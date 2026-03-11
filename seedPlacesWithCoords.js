const mongoose = require("mongoose");
const Place = require("./models/Place");

// Place coordinates data matching the places in placesData.jsx
const placesWithCoords = [
  // 🌊 BEACHES (13 places)
  { id: 1, name: "Kapu Beach", location: "Udupi", category: "beach", latitude: 13.3390, longitude: 74.7421 },
  { id: 2, name: "Devbagh Beach", location: "Karwar", category: "beach", latitude: 14.8167, longitude: 74.3333 },
  { id: 3, name: "Malpe Beach", location: "Udupi", category: "beach", latitude: 13.3404, longitude: 74.7431 },
  { id: 4, name: "Mattu Beach", location: "Udupi", category: "beach", latitude: 13.3404, longitude: 74.7431 },
  { id: 5, name: "Murudeshwara Beach", location: "Bhatkal", category: "beach", latitude: 14.4289, longitude: 74.4843 },
  { id: 6, name: "Om Beach", location: "Gokarna", category: "beach", latitude: 14.5644, longitude: 74.3204 },
  { id: 7, name: "Panamburu Beach", location: "Mangaluru", category: "beach", latitude: 12.8556, longitude: 74.8333 },
  { id: 8, name: "Someshwara Beach", location: "Mangaluru", category: "beach", latitude: 12.8556, longitude: 74.8333 },
  { id: 9, name: "St. Mary's Island", location: "Udupi", category: "beach", latitude: 13.3390, longitude: 74.7421 },
  { id: 10, name: "Surathkal Beach", location: "Mangaluru", category: "beach", latitude: 12.8556, longitude: 74.8333 },
  { id: 11, name: "Thannirbhavi Beach", location: "Mangaluru", category: "beach", latitude: 12.8556, longitude: 74.8333 },
  { id: 12, name: "Maravanthe Beach", location: "Kundapura", category: "beach", latitude: 13.5344, longitude: 74.6951 },
  { id: 13, name: "Padubidri Beach", location: "Udupi", category: "beach", latitude: 13.3390, longitude: 74.7421 },

  // ⛰️ HILL STATIONS (11 places)
  { id: 101, name: "Sakleshpur", location: "Hassan", category: "hill-station", latitude: 13.0333, longitude: 75.6500 },
  { id: 102, name: "Coorg", location: "Kodagu", category: "hill-station", latitude: 12.3375, longitude: 75.8069 },
  { id: 103, name: "Chikmagalur", location: "Chikmagalur", category: "hill-station", latitude: 13.3258, longitude: 75.7804 },
  { id: 104, name: "Agumbe", location: "Shivamogga", category: "hill-station", latitude: 13.5859, longitude: 75.6500 },
  { id: 105, name: "Biligiri Hills", location: "Chamarajanagar", category: "hill-station", latitude: 12.2000, longitude: 76.8500 },
  { id: 106, name: "Gangamoola", location: "Chikmagalur", category: "hill-station", latitude: 13.3500, longitude: 75.8000 },
  { id: 107, name: "Kemmannugundi", location: "Chikmagalur", category: "hill-station", latitude: 13.4000, longitude: 75.7000 },
  { id: 108, name: "Kodachadri", location: "Shivamogga", category: "hill-station", latitude: 13.9333, longitude: 75.4500 },
  { id: 109, name: "Kundadri", location: "Shivamogga", category: "hill-station", latitude: 13.8667, longitude: 75.5500 },
  { id: 110, name: "Madikeri", location: "Madikeri", category: "hill-station", latitude: 12.4381, longitude: 75.7304 },
  { id: 111, name: "Nandi Hills", location: "Chikkaballapura", category: "hill-station", latitude: 13.3667, longitude: 77.7167 },

  // 🏛️ HISTORY (17 places)
  { id: 201, name: "Hampi", location: "Vijayanagara", category: "history", latitude: 15.3350, longitude: 76.4600 },
  { id: 202, name: "Mysore Palace", location: "Mysore", category: "history", latitude: 12.2958, longitude: 76.6394 },
  { id: 203, name: "Bijapur Fort", location: "Bijapur", category: "history", latitude: 16.8300, longitude: 75.7100 },
  { id: 204, name: "Shimoga Fort", location: "Shimoga", category: "history", latitude: 13.9289, longitude: 75.5604 },
  { id: 205, name: "Badami Caves", location: "Bagalkot", category: "history", latitude: 15.9167, longitude: 75.6750 },
  { id: 206, name: "Halebidu Temple", location: "Hassan", category: "history", latitude: 13.2000, longitude: 75.8500 },
  { id: 207, name: "Srirangapatna Fort", location: "Mandya", category: "history", latitude: 12.4156, longitude: 76.7056 },
  { id: 208, name: "Aihole Temples", location: "Bagalkot", category: "history", latitude: 15.9500, longitude: 75.8500 },
  { id: 209, name: "Dandeli Fort", location: "Uttara Kannada", category: "history", latitude: 14.9500, longitude: 74.5833 },
  { id: 210, name: "Ramanagaram Fort", location: "Ramanagaram", category: "history", latitude: 12.7208, longitude: 77.2833 },
  { id: 211, name: "Hassan Historic Site", location: "Hassan", category: "history", latitude: 13.1988, longitude: 75.9400 },
  { id: 212, name: "Bidar Fort", location: "Bidar", category: "history", latitude: 17.5797, longitude: 77.5000 },
  { id: 213, name: "Talakadu", location: "Mysore", category: "history", latitude: 12.1219, longitude: 76.8022 },
  { id: 214, name: "Melukote Temple", location: "Mandya", category: "history", latitude: 12.4500, longitude: 77.0500 },
  { id: 215, name: "Somnathpur Temple", location: "Mysore", category: "history", latitude: 12.2500, longitude: 76.8500 },
  { id: 216, name: "Sringeri Temple", location: "Chikmagalur", category: "history", latitude: 13.2833, longitude: 75.7333 },
  { id: 217, name: "Pattadakal Temple", location: "Bagalkot", category: "history", latitude: 15.9333, longitude: 75.8667 },

  // 🛕 RELIGIOUS (6 places)
  { id: 301, name: "Murudeshwara Temple", location: "Uttara Kannada", category: "religious", latitude: 14.3561, longitude: 74.4854 },
  { id: 302, name: "Koti Lingeshwara", location: "Kolar", category: "religious", latitude: 13.2167, longitude: 78.1667 },
  { id: 303, name: "Banashankari Temple", location: "Bagalkot", category: "religious", latitude: 15.9333, longitude: 75.7000 },
  { id: 304, name: "Mookambika Temple", location: "Kollur", category: "religious", latitude: 13.5833, longitude: 74.6667 },
  { id: 305, name: "Kedareshwara Temple", location: "Halebidu", category: "religious", latitude: 13.2000, longitude: 75.8500 },
  { id: 306, name: "Amrutheshwara Temple", location: "Chikkamagalur", category: "religious", latitude: 13.3258, longitude: 75.7804 },
];

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tourist-karnataka";

async function seedPlaces() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing places
    await Place.deleteMany({});
    console.log("Cleared existing places");

    // Insert all places with coordinates
    const places = await Place.insertMany(placesWithCoords);
    console.log(`Successfully seeded ${places.length} places with coordinates`);

    // Display the seeded places
    places.forEach(place => {
      console.log(`- ${place.name} (${place.category}): [${place.latitude}, ${place.longitude}]`);
    });

    console.log("\n✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding places:", error);
    process.exit(1);
  }
}

seedPlaces();

