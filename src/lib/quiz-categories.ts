type CategoryType = {
  id: string;
  name: string;
  icon: string;
  subcategories?: CategoryType[];
};

export const categories: CategoryType[] = [
  {
    id: "academic",
    name: "Academic",
    icon: "BookOpen",
    subcategories: [
      {
        id: "mathematics",
        name: "Mathematics",
        icon: "Calculator",
        subcategories: [
          { id: "algebra", name: "Algebra", icon: "Hash" },
          { id: "geometry", name: "Geometry", icon: "Square" },
          { id: "calculus", name: "Calculus", icon: "LineChart" },
          { id: "statistics", name: "Statistics", icon: "BarChart" },
          { id: "trigonometry", name: "Trigonometry", icon: "Triangle" },
          { id: "probability", name: "Probability", icon: "Dice" },
        ],
      },
      {
        id: "science",
        name: "Science",
        icon: "Atom",
        subcategories: [
          {
            id: "physics",
            name: "Physics",
            icon: "Zap",
            subcategories: [
              { id: "mechanics", name: "Mechanics", icon: "Cog" },
              {
                id: "electricity",
                name: "Electricity & Magnetism",
                icon: "Lightning",
              },
              {
                id: "thermodynamics",
                name: "Thermodynamics",
                icon: "Thermometer",
              },
              { id: "quantum", name: "Quantum Physics", icon: "Atoms" },
            ],
          },
          {
            id: "chemistry",
            name: "Chemistry",
            icon: "Flask",
            subcategories: [
              { id: "organic", name: "Organic Chemistry", icon: "Molecule" },
              { id: "inorganic", name: "Inorganic Chemistry", icon: "Beaker" },
              {
                id: "physical",
                name: "Physical Chemistry",
                icon: "AtomicStructure",
              },
              { id: "biochemistry", name: "Biochemistry", icon: "Dna" },
            ],
          },
          {
            id: "biology",
            name: "Biology",
            icon: "Leaf",
            subcategories: [
              { id: "genetics", name: "Genetics", icon: "Dna" },
              { id: "ecology", name: "Ecology", icon: "TreePine" },
              { id: "anatomy", name: "Anatomy", icon: "Heart" },
              { id: "microbiology", name: "Microbiology", icon: "Bacteria" },
            ],
          },
          { id: "astronomy", name: "Astronomy", icon: "Star" },
          { id: "earth-science", name: "Earth Science", icon: "Globe" },
        ],
      },
      {
        id: "languages",
        name: "Languages",
        icon: "Languages",
        subcategories: [
          { id: "english", name: "English", icon: "Type" },
          { id: "spanish", name: "Spanish", icon: "Type" },
          { id: "french", name: "French", icon: "Type" },
          { id: "german", name: "German", icon: "Type" },
          { id: "mandarin", name: "Mandarin", icon: "Type" },
          { id: "japanese", name: "Japanese", icon: "Type" },
        ],
      },
      {
        id: "computer-science",
        name: "Computer Science",
        icon: "Computer",
        subcategories: [
          { id: "programming", name: "Programming", icon: "Code" },
          { id: "databases", name: "Databases", icon: "Database" },
          { id: "networking", name: "Networking", icon: "Network" },
          { id: "cybersecurity", name: "Cybersecurity", icon: "Shield" },
          { id: "ai", name: "Artificial Intelligence", icon: "Brain" },
        ],
      },
    ],
  },
  {
    id: "history",
    name: "History",
    icon: "Clock",
    subcategories: [
      { id: "ancient", name: "Ancient History", icon: "Monument" },
      { id: "medieval", name: "Medieval History", icon: "Sword" },
      { id: "modern", name: "Modern History", icon: "Building" },
      { id: "world-wars", name: "World Wars", icon: "Milestone" },
    ],
  },
  {
    id: "geography",
    name: "Geography",
    icon: "Globe",
    subcategories: [
      { id: "physical", name: "Physical Geography", icon: "Mountain" },
      { id: "political", name: "Political Geography", icon: "Flag" },
      { id: "human", name: "Human Geography", icon: "Users" },
      { id: "climate", name: "Climate & Weather", icon: "Cloud" },
    ],
  },
  {
    id: "culture",
    name: "Culture",
    icon: "Globe",
    subcategories: [
      { id: "art", name: "Art History", icon: "Palette" },
      { id: "literature", name: "Literature", icon: "Book" },
      { id: "mythology", name: "Mythology", icon: "Sparkles" },
      { id: "religion", name: "Religion", icon: "PrayingHands" },
    ],
  },
  {
    id: "current-events",
    name: "Current Events",
    icon: "Newspaper",
  },
  {
    id: "politics",
    name: "Politics",
    icon: "Building2",
  },
  {
    id: "economics",
    name: "Economics",
    icon: "TrendingUp",
  },
  {
    id: "general",
    name: "General Knowledge",
    icon: "Lightbulb",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "Film",
    subcategories: [
      {
        id: "movies",
        name: "Movies",
        icon: "Clapperboard",
        subcategories: [
          { id: "hollywood", name: "Hollywood", icon: "Star" },
          { id: "bollywood", name: "Bollywood", icon: "Music" },
          { id: "anime", name: "Anime", icon: "Tv" },
          { id: "classics", name: "Classic Films", icon: "Film" },
          { id: "documentary", name: "Documentaries", icon: "Camera" },
        ],
      },
      {
        id: "music",
        name: "Music",
        icon: "Music",
        subcategories: [
          { id: "pop", name: "Pop", icon: "Radio" },
          { id: "rock", name: "Rock", icon: "Guitar" },
          { id: "classical", name: "Classical", icon: "Piano" },
          { id: "jazz", name: "Jazz", icon: "Saxophone" },
          { id: "hip-hop", name: "Hip Hop", icon: "Microphone" },
          { id: "electronic", name: "Electronic", icon: "Headphones" },
        ],
      },
      {
        id: "gaming",
        name: "Gaming",
        icon: "Gamepad",
        subcategories: [
          { id: "video-games", name: "Video Games", icon: "Gamepad2" },
          { id: "board-games", name: "Board Games", icon: "Dice" },
          { id: "card-games", name: "Card Games", icon: "Cards" },
          { id: "rpg", name: "Role-Playing Games", icon: "Swords" },
        ],
      },
      {
        id: "television",
        name: "Television",
        icon: "Tv",
        subcategories: [
          { id: "drama", name: "Drama Series", icon: "Theater" },
          { id: "comedy", name: "Comedy Shows", icon: "Smile" },
          { id: "reality", name: "Reality TV", icon: "Camera" },
          { id: "documentary", name: "TV Documentaries", icon: "Film" },
        ],
      },
    ],
  },
  {
    id: "sports",
    name: "Sports",
    icon: "Running",
    subcategories: [
      {
        id: "team-sports",
        name: "Team Sports",
        icon: "Users",
        subcategories: [
          { id: "football", name: "Football", icon: "Ball" },
          { id: "nfl", name: "NFL", icon: "Ball" },
          { id: "basketball", name: "Basketball", icon: "Ball" },
          { id: "cricket", name: "Cricket", icon: "Ball" },
          { id: "baseball", name: "Baseball", icon: "Ball" },
          { id: "hockey", name: "Hockey", icon: "Stick" },
        ],
      },
      {
        id: "individual-sports",
        name: "Individual Sports",
        icon: "User",
        subcategories: [
          { id: "tennis", name: "Tennis", icon: "Ball" },
          { id: "golf", name: "Golf", icon: "Flag" },
          { id: "athletics", name: "Athletics", icon: "Running" },
          { id: "swimming", name: "Swimming", icon: "Waves" },
        ],
      },
      { id: "olympics", name: "Olympics", icon: "Medal" },
      { id: "esports", name: "E-Sports", icon: "Gamepad" },
    ],
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    icon: "Heart",
    subcategories: [
      {
        id: "food-drink",
        name: "Food & Drink",
        icon: "UtensilsCrossed",
        subcategories: [
          { id: "cuisine", name: "World Cuisine", icon: "Chef" },
          { id: "beverages", name: "Beverages", icon: "Wine" },
          { id: "cooking", name: "Cooking", icon: "Kitchen" },
          { id: "baking", name: "Baking", icon: "Cake" },
        ],
      },
      {
        id: "health-fitness",
        name: "Health & Fitness",
        icon: "Activity",
        subcategories: [
          { id: "nutrition", name: "Nutrition", icon: "Apple" },
          { id: "exercise", name: "Exercise", icon: "Dumbbell" },
          { id: "mental-health", name: "Mental Health", icon: "Brain" },
          { id: "yoga", name: "Yoga & Meditation", icon: "Lotus" },
        ],
      },
      {
        id: "fashion",
        name: "Fashion",
        icon: "Shirt",
        subcategories: [
          { id: "clothing", name: "Clothing", icon: "Shirt" },
          { id: "accessories", name: "Accessories", icon: "Watch" },
          { id: "beauty", name: "Beauty", icon: "Sparkles" },
          { id: "trends", name: "Fashion Trends", icon: "Trending" },
        ],
      },
      { id: "travel", name: "Travel", icon: "Plane" },
      { id: "hobbies", name: "Hobbies & Crafts", icon: "Brush" },
    ],
  },
];

// Helper function to flatten categories for select input
export const flattenCategories = (
  categories: CategoryType[],
  parentPath = ""
): { value: string; label: string }[] => {
  return categories.reduce((acc, category) => {
    const currentPath = parentPath
      ? `${parentPath}/${category.id}`
      : category.id;
    const current = { value: currentPath, label: category.name };

    if (category.subcategories) {
      return [
        ...acc,
        current,
        ...flattenCategories(category.subcategories, currentPath),
      ];
    }

    return [...acc, current];
  }, [] as { value: string; label: string }[]);
};

// Helper function to get category name from path
export const getCategoryNameFromPath = (
  path: string,
  categories: CategoryType[]
): string => {
  const parts = path.split("/");
  const result = [];
  let currentCategories = categories;

  for (const part of parts) {
    const category = currentCategories.find((c) => c.id === part);
    if (category) {
      result.push(category.name);
      currentCategories = category.subcategories || [];
    }
  }

  return result.join(" › ");
};
