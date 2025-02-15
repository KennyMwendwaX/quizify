const categories = {
  Science: [
    "Physics",
    "Chemistry",
    "Biology",
    "Astronomy",
    "Earth Science",
    "Medicine",
    "Engineering",
    "Space Exploration",
    "Rocket Science",
  ],
  Mathematics: [
    "Algebra",
    "Geometry",
    "Trigonometry",
    "Calculus",
    "Statistics & Probability",
    "Number Theory",
    "Mathematical Puzzles",
    "Logic & Reasoning",
    "Discrete Mathematics",
  ],
  History: [
    "Ancient History",
    "Medieval History",
    "Modern History",
    "World Wars",
    "African History",
    "American History",
    "European History",
    "Asian History",
  ],
  Geography: [
    "Countries & Capitals",
    "Physical Geography",
    "World Landmarks",
    "Climate & Weather",
    "Maps & Navigation",
    "Oceans & Rivers",
  ],
  Literature: [
    "Classic Literature",
    "Modern Literature",
    "Poetry",
    "Shakespeare",
    "Fantasy & Sci-Fi",
    "Non-Fiction",
    "Mythology & Folklore",
  ],
  "Art & Culture": [
    "Painting & Sculpture",
    "Architecture",
    "Theater & Performing Arts",
    "Cultural Traditions",
    "Fashion & Design",
    "World Religions",
  ],
  Technology: [
    "Computer Science",
    "Artificial Intelligence",
    "Internet & Cybersecurity",
    "Gadgets & Inventions",
    "Space Technology",
    "Programming & Software",
  ],
  Politics: [
    "World Leaders",
    "Political Theories",
    "Elections & Governments",
    "International Relations",
    "Law & Constitution",
    "Wars & Conflicts",
  ],
  Sports: [
    "Football",
    "Basketball",
    "Tennis",
    "NFL",
    "Cricket",
    "Olympics",
    "Athletics",
    "Esports",
  ],
  Entertainment: {
    Movies: [
      "Hollywood",
      "Bollywood",
      "Animated Films",
      "Oscar Winners",
      "Directors & Filmmakers",
    ],
    "TV Shows": [
      "Sitcoms",
      "Dramas",
      "Reality TV",
      "Streaming Series",
      "Classic TV Shows",
    ],
    Music: [
      "Pop",
      "Rock",
      "Hip-Hop",
      "Classical",
      "Jazz & Blues",
      "Music Awards",
    ],
    "Anime & Manga": [
      "Shonen",
      "Shojo",
      "Seinen",
      "Isekai",
      "Classic Anime",
      "Manga Artists",
    ],
    "K-Drama": [
      "Romance",
      "Thriller",
      "Fantasy",
      "Comedy",
      "Historical",
      "Popular Actors",
    ],
  },
  "Current Events": [
    "World News",
    "Science & Technology Updates",
    "Politics & Government",
    "Climate Change",
    "Economic Trends",
    "Sports & Entertainment News",
  ],
};

type CategoryOption = {
  value: string;
  label: string;
};

const flattenCategories = (
  categories: Record<string, string[] | Record<string, string[]>>
): CategoryOption[] => {
  const options: CategoryOption[] = [];

  Object.entries(categories).forEach(([category, subcategories]) => {
    options.push({ value: category, label: category });

    if (Array.isArray(subcategories)) {
      subcategories.forEach((subcategory) => {
        options.push({
          value: `${category} - ${subcategory}`,
          label: subcategory,
        });
      });
    } else if (typeof subcategories === "object") {
      Object.entries(subcategories).forEach(
        ([subCategory, subSubcategories]) => {
          options.push({
            value: `${category} - ${subCategory}`,
            label: subCategory,
          });
          subSubcategories.forEach((subSubcategory) => {
            options.push({
              value: `${category} - ${subCategory} - ${subSubcategory}`,
              label: subSubcategory,
            });
          });
        }
      );
    }
  });

  return options;
};

export const categoryOptions = flattenCategories(categories);
