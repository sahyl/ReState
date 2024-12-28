import { ID } from "react-native-appwrite";
import { databases, config } from "./appwrite";
import {
  agentImages,
  galleryImages,
  propertiesImages,
  reviewImages,
} from "./data";

const COLLECTIONS = {
  AGENT: config.agentsCollectionId,
  REVIEWS: config.reviewsCollectionId,
  GALLERY: config.galleriesCollectionId,
  PROPERTY: config.propertiesCollectionId,
};

// Custom Data Arrays
const propertyNames = [
  "Marlwood Manor",
  "Serene Palace",
  "Azure Heights",
  "Golden Ridge",
  "Sunset Villa",
  "Tranquil Haven",
  "Harborview Estate",
  "Meadowbrook Cottage",
  "Crescent Court",
  "Lakeside Retreat",
  "Willow Park",
  "Mountainview Chalet",
  "Orchard Grove",
  "Oceanfront Oasis",
  "The Grandview",
  "Evergreen Lodge",
  "Riverstone Residence",
  "Bayside Bungalow",
  "Hillside Haven",
  "Maplewood Estate",
];

const propertyAddresses = [
  "123 Marlwood Lane",
  "456 Serene Avenue",
  "789 Azure Drive",
  "101 Golden Ridge Road",
  "202 Sunset Boulevard",
  "303 Haven Street",
  "404 Harborview Way",
  "505 Meadowbrook Lane",
  "606 Crescent Plaza",
  "707 Lakeside Drive",
  "808 Willow Road",
  "909 Mountainview Trail",
  "1001 Orchard Road",
  "1102 Oceanfront Way",
  "1203 Grandview Circle",
  "1304 Evergreen Drive",
  "1405 Riverstone Lane",
  "1506 Bayside Avenue",
  "1607 Hillside Path",
  "1708 Maplewood Court",
];

const agentNames = [
  "Sophia Anderson",
  "Liam Carter",
  "Olivia Bennett",
  "Noah Collins",
  "Emma Davidson",
];

const agentEmails = [
  "sophia.anderson@example.com",
  "liam.carter@example.com",
  "olivia.bennett@example.com",
  "noah.collins@example.com",
  "emma.davidson@example.com",
];

const customReviews = [
  "Excellent service and a great experience!",
  "I loved the place and the process was smooth.",
  "Highly professional and responsive agents.",
  "Would recommend to anyone looking for a home.",
  "The property was exactly as described. Great work!",
  "Very satisfied with the overall experience.",
  "The agent made everything easy and hassle-free.",
  "Amazing service and lovely properties to choose from.",
  "Quick and efficient process, highly recommend!",
  "A delightful experience from start to finish.",
];

const customPropertyDescriptions = [
  "A stunning manor with spacious gardens and modern amenities.",
  "A luxurious palace offering serene views and top-notch facilities.",
  "Elegant residences situated in the heart of the city with easy access to amenities.",
  "A beautiful ridge property with panoramic views and exquisite design.",
  "A charming villa boasting a beautiful sunset view and ample living space.",
  "A peaceful haven perfect for families, featuring a large backyard and contemporary interiors.",
  "An expansive estate located near the harbor, offering breathtaking sea views.",
  "A cozy cottage nestled in the meadows, ideal for a quiet retreat.",
  "A sophisticated court with modern architecture and state-of-the-art facilities.",
  "A tranquil retreat by the lake, perfect for relaxation and recreation.",
  "A picturesque park-side property with lush greenery and serene surroundings.",
  "A chalet located in the mountains, offering stunning vistas and premium amenities.",
  "A lovely grove property surrounded by orchards, providing a peaceful environment.",
  "An oasis by the ocean, featuring luxurious interiors and private beach access.",
  "A grandview property with expansive spaces and elegant design elements.",
  "A lodge set in evergreen landscapes, perfect for nature lovers.",
  "A residence by the riverstone, combining modern living with natural beauty.",
  "A bungalow situated by the bay, offering stunning water views and modern comforts.",
  "A hillside property with breathtaking views and top-tier facilities.",
  "An estate surrounded by maplewood trees, providing a serene and beautiful setting.",
];

const propertyTypes = [
  "House",
  "Townhouse",
  "Condo",
  "Duplex",
  "Studio",
  "Villa",
  "Apartment",
  "Other",
];

const facilities = [
  "Laundry",
  "Parking",
  "Sports Center",
  "Gym",
  "Swimming pool",
  "Wifi",
  "Pet Center",
];

function getRandomSubset<T>(
  array: T[],
  minItems: number,
  maxItems: number
): T[] {
  if (minItems > maxItems) {
    throw new Error("minItems cannot be greater than maxItems");
  }
  if (minItems < 0 || maxItems > array.length) {
    throw new Error(
      "minItems or maxItems are out of valid range for the array"
    );
  }

  const subsetSize =
    Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;

  const arrayCopy = [...array];
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[randomIndex]] = [
      arrayCopy[randomIndex],
      arrayCopy[i],
    ];
  }

  return arrayCopy.slice(0, subsetSize);
}

async function seed() {
  try {
    // Clear existing data from all collections
    for (const key in COLLECTIONS) {
      const collectionId = COLLECTIONS[key as keyof typeof COLLECTIONS];
      const documents = await databases.listDocuments(
        config.databaseId!,
        collectionId!
      );
      for (const doc of documents.documents) {
        await databases.deleteDocument(
          config.databaseId!,
          collectionId!,
          doc.$id
        );
      }
    }

    console.log("Cleared all existing data.");

    // Seed Agents
    const agents = [];
    for (let i = 0; i < agentNames.length; i++) {
      const agent = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.AGENT!,
        ID.unique(),
        {
          name: agentNames[i],
          email: agentEmails[i],
          avatar: agentImages[i % agentImages.length],
        }
      );
      agents.push(agent);
    }
    console.log(`Seeded ${agents.length} agents.`);

    // Seed Reviews
    const reviews = [];
    for (let i = 0; i < customReviews.length; i++) {
      const review = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.REVIEWS!,
        ID.unique(),
        {
          name: `Reviewer ${i + 1}`,
          avatar: reviewImages[i % reviewImages.length],
          review: customReviews[i],
          rating: Math.floor(Math.random() * 5) + 1, // Rating between 1 and 5
        }
      );
      reviews.push(review);
    }
    console.log(`Seeded ${reviews.length} reviews.`);

    // Seed Galleries
    const galleries = [];
    for (const image of galleryImages) {
      const gallery = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.GALLERY!,
        ID.unique(),
        { image }
      );
      galleries.push(gallery);
    }
    console.log(`Seeded ${galleries.length} galleries.`);

    // Seed Properties
    for (let i = 0; i < propertyNames.length; i++) {
      const assignedAgent = agents[Math.floor(Math.random() * agents.length)];
      const assignedReviews = getRandomSubset(reviews, 5, 7); // 5 to 7 reviews
      const assignedGalleries = getRandomSubset(galleries, 3, 8); // 3 to 8 galleries
      const selectedFacilities = getRandomSubset(
        facilities,
        2,
        facilities.length
      ); // At least 2 facilities

      const image =
        propertiesImages.length - 1 >= i
          ? propertiesImages[i]
          : propertiesImages[
              Math.floor(Math.random() * propertiesImages.length)
            ];

      const property = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.PROPERTY!,
        ID.unique(),
        {
          name: propertyNames[i],
          type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
          description: customPropertyDescriptions[i],
          address: propertyAddresses[i],
          geolocation: `192.168.1.${i + 1}, 192.168.1.${i + 1}`,
          price: Math.floor(Math.random() * 9000) + 1000,
          area: Math.floor(Math.random() * 3000) + 500,
          bedrooms: Math.floor(Math.random() * 5) + 1,
          bathrooms: Math.floor(Math.random() * 5) + 1,
          rating: Math.floor(Math.random() * 5) + 1,
          facilities: selectedFacilities,
          image: image,
          agent: assignedAgent.$id,
          reviews: assignedReviews.map((review) => review.$id),
          gallery: assignedGalleries.map((gallery) => gallery.$id),
        }
      );

      console.log(`Seeded property: ${property.name}`);
    }

    console.log("Data seeding completed.");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

export default seed;
