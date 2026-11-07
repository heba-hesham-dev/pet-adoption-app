// All 15 pets from the Figma design. The screens read from this file,
// so later the backend only has to replace where this list comes from.

export type Category = 'dog' | 'cat' | 'other';

export type Pet = {
  id: string;
  name: string;
  category: Category;
  breed: string;
  sex: string;
  age: string;
  size: string;
  tags: string[];
  about: string;
  personality: string;
  energyLevel: string;
  goodWith: string[];
  careNeeds: string[];
  health: string;
  story: string;
  location: string;
  adoptionFee: string;
  image: number;
};

const SHELTER = 'Happy Paws Shelter, Cairo';

export const pets: Pet[] = [
  // ---------- Dogs ----------
  {
    id: 'max', name: 'Max', category: 'dog',
    breed: 'Golden Retriever', sex: 'Male', age: '3 years old', size: 'Large (30 kg)',
    tags: ['Vaccinated', 'Neutered', 'House-trained', 'Microchipped'],
    about: 'Max is a gentle, happy dog who loves people. He enjoys long walks, playing fetch, and relaxing on the couch after a busy day.',
    personality: 'Friendly · Playful · Loyal', energyLevel: 'Medium–High',
    goodWith: ['Children: Yes', 'Other dogs: Yes', 'Cats: Not tested'],
    careNeeds: ['Needs about 1 hour of exercise a day', 'Brush 2–3 times a week', 'Best in a home with a yard or daily outdoor time'],
    health: 'Vaccinations up to date. Neutered. No known health issues.',
    story: "Max came to the shelter when his family moved abroad. He's ready to find a new home where he can be part of the family.",
    location: SHELTER, adoptionFee: '1,500 EGP',
    image: require('../../assets/images/pets/max.png'),
  },
  {
    id: 'mochi', name: 'Mochi', category: 'dog',
    breed: 'Beagle', sex: 'Female', age: '4 years old', size: 'Medium (11 kg)',
    tags: ['Vaccinated', 'Spayed', 'House-trained', 'Microchipped'],
    about: 'Mochi is a cheerful, curious girl who follows her nose everywhere. She loves treats, games, and naps in the sun.',
    personality: 'Curious · Cheerful · Food-loving', energyLevel: 'High',
    goodWith: ['Children: Yes', 'Other dogs: Yes', 'Cats: Not tested'],
    careNeeds: ['Needs about 1 hour of walks and sniff time a day', 'Brush once a week', 'Needs a secure yard, as beagles love to wander'],
    health: 'Vaccinations up to date. Spayed. No known health issues.',
    story: "Mochi was found wandering near a park, happy and friendly. She's ready for a family who loves walks as much as she does.",
    location: SHELTER, adoptionFee: '1,200 EGP',
    image: require('../../assets/images/pets/mochi.png'),
  },
  {
    id: 'alex', name: 'Alex', category: 'dog',
    breed: 'German Shepherd', sex: 'Male', age: '3 years old', size: 'Large (35 kg)',
    tags: ['Vaccinated', 'Neutered', 'House-trained', 'Microchipped'],
    about: 'Alex is smart, loyal, and protective. He learns fast and loves having a job to do.',
    personality: 'Loyal · Intelligent · Protective', energyLevel: 'High',
    goodWith: ['Children: Older kids', 'Other dogs: Calm dogs only', 'Cats: No'],
    careNeeds: ['Needs 1–2 hours of exercise a day', 'Enjoys training and puzzle games', 'Brush 3–4 times a week, as he sheds a lot'],
    health: 'Vaccinations up to date. Neutered. Hips checked and healthy.',
    story: "Alex's owner could no longer give him the time he needed. He's looking for an active home where he can learn, play, and protect his family.",
    location: SHELTER, adoptionFee: '1,500 EGP',
    image: require('../../assets/images/pets/alex.png'),
  },
  {
    id: 'teddy-toby', name: 'Teddy & Toby', category: 'dog',
    breed: 'Golden Retriever', sex: 'Males', age: '3 months old', size: 'Small (puppies)',
    tags: ['Vaccines in progress', 'Microchipped', 'Bonded pair'],
    about: "Teddy and Toby are fluffy brothers who play, eat, and sleep together. They're always ready for a game.",
    personality: 'Playful · Sweet · Curious', energyLevel: 'High',
    goodWith: ['Children: Yes', 'Other dogs: Yes', 'Cats: Not tested'],
    careNeeds: ['Need puppy training and lots of play', 'Short walks a few times a day', 'Must be adopted together'],
    health: 'First vaccines done, more due soon. Too young to be neutered yet.',
    story: "The brothers were born at a foster home. They've never been apart, so they're looking for one family to adopt them both.",
    location: SHELTER, adoptionFee: '2,000 EGP (for both)',
    image: require('../../assets/images/pets/teddy-toby.png'),
  },
  {
    id: 'toffee', name: 'Toffee', category: 'dog',
    breed: 'Pomeranian', sex: 'Female', age: '2 years old', size: 'Small (3 kg)',
    tags: ['Vaccinated', 'Spayed', 'House-trained', 'Microchipped'],
    about: 'Toffee is a fluffy little ball of energy. She loves laps, short walks, and being brushed.',
    personality: 'Lively · Affectionate · Alert', energyLevel: 'Medium',
    goodWith: ['Children: Calm kids', 'Other dogs: Small dogs', 'Cats: Yes'],
    careNeeds: ['Needs 30 minutes of walks a day', 'Brush 3–4 times a week', 'Great for apartments'],
    health: 'Vaccinations up to date. Spayed. Regular teeth cleaning advised.',
    story: "Toffee came to the shelter after her owner moved to a home where pets weren't allowed. She's waiting for a cozy lap to call her own.",
    location: SHELTER, adoptionFee: '1,200 EGP',
    image: require('../../assets/images/pets/toffee.png'),
  },

  // ---------- Cats ----------
  {
    id: 'sofi', name: 'Sofi', category: 'cat',
    breed: 'Scottish Fold', sex: 'Female', age: '3 months old', size: 'Small (1.5 kg)',
    tags: ['Vaccines in progress', 'Litter-trained', 'Microchipped'],
    about: 'Sofi is a sweet, gentle kitten with soft folded ears. She loves warm blankets and quiet cuddles.',
    personality: 'Gentle · Calm · Cuddly', energyLevel: 'Medium',
    goodWith: ['Children: Yes', 'Other cats: Yes', 'Dogs: Not tested'],
    careNeeds: ['Indoor cat', 'Brush once a week', 'Needs toys and short play sessions every day'],
    health: 'First vaccines done, more due soon. Regular ear and joint checks advised for her breed.',
    story: "Sofi was born in a foster home. She's ready to find a quiet, loving family to grow up with.",
    location: SHELTER, adoptionFee: '1,000 EGP',
    image: require('../../assets/images/pets/sofi.png'),
  },
  {
    id: 'milo', name: 'Milo', category: 'cat',
    breed: 'Maine Coon', sex: 'Male', age: '2 years old', size: 'Large (8 kg)',
    tags: ['Vaccinated', 'Neutered', 'Litter-trained', 'Microchipped'],
    about: "Milo is a big, friendly giant. He's calm, social, and loves to follow his people around the house.",
    personality: 'Friendly · Social · Easygoing', energyLevel: 'Medium',
    goodWith: ['Children: Yes', 'Other cats: Yes', 'Dogs: Yes'],
    careNeeds: ['Indoor cat', 'Brush 2–3 times a week, as his coat is long', 'Needs a big scratching post and climbing space'],
    health: 'Vaccinations up to date. Neutered. No known health issues.',
    story: "Milo was rescued as a young cat and grew up around other pets. He's ready for a busy, happy home.",
    location: SHELTER, adoptionFee: '1,200 EGP',
    image: require('../../assets/images/pets/milo.png'),
  },
  {
    id: 'luna', name: 'Luna', category: 'cat',
    breed: 'Ragdoll', sex: 'Female', age: '2 years old', size: 'Medium (5 kg)',
    tags: ['Vaccinated', 'Spayed', 'Litter-trained', 'Microchipped'],
    about: 'Luna is calm and affectionate. She goes soft and relaxed when you pick her up, and loves being held.',
    personality: 'Calm · Loving · Gentle', energyLevel: 'Low',
    goodWith: ['Children: Yes', 'Other cats: Yes', 'Dogs: Calm dogs'],
    careNeeds: ['Indoor cat', 'Brush 2 times a week', 'Perfect for quiet homes and apartments'],
    health: 'Vaccinations up to date. Spayed. No known health issues.',
    story: "Luna's family could no longer care for her after a new baby arrived. She's looking for a peaceful home with lots of cuddles.",
    location: SHELTER, adoptionFee: '1,200 EGP',
    image: require('../../assets/images/pets/luna.png'),
  },
  {
    id: 'mia', name: 'Mia', category: 'cat',
    breed: 'Siamese Mix', sex: 'Female', age: '4 months old', size: 'Small (2 kg)',
    tags: ['Vaccines in progress', 'Litter-trained', 'Microchipped'],
    about: "Mia is a chatty, playful kitten who'll greet you every time you come home.",
    personality: 'Talkative · Playful · Smart', energyLevel: 'High',
    goodWith: ['Children: Yes', 'Other cats: Yes', 'Dogs: Not tested'],
    careNeeds: ['Indoor cat', 'Needs daily play and attention', 'Brush once a week'],
    health: 'First vaccines done, more due soon. Too young to be spayed yet.',
    story: "Mia was found as a tiny kitten and raised by a foster family. She's ready for a home that loves to chat back.",
    location: SHELTER, adoptionFee: '900 EGP',
    image: require('../../assets/images/pets/mia.png'),
  },

  // ---------- Others ----------
  {
    id: 'shelly', name: 'Shelly', category: 'other',
    breed: 'Indian Star Tortoise', sex: 'Female', age: '4 years old', size: 'Small (0.8 kg)',
    tags: ['Health checked', 'Eats greens and veggies'],
    about: 'Shelly is a slow, peaceful companion. She loves warm sunny spots and munching on leafy greens.',
    personality: 'Calm · Curious · Independent', energyLevel: 'Low',
    goodWith: ['Children: Calm kids, with adult help', 'Other pets: Keep separate'],
    careNeeds: ['Needs a warm enclosure with UV light', 'Fresh greens daily and clean water', 'Can live 50+ years, so needs a long-term home'],
    health: 'Health checked by a vet. Shell in good condition.',
    story: "Shelly's owner moved abroad and couldn't take her along. She's ready for a patient family who will care for her for many years.",
    location: SHELTER, adoptionFee: '600 EGP',
    image: require('../../assets/images/pets/shelly.png'),
  },
  {
    id: 'oreo', name: 'Oreo', category: 'other',
    breed: 'English Spot Rabbit', sex: 'Male', age: '2 years old', size: 'Medium (2.5 kg)',
    tags: ['Vaccinated', 'Neutered', 'Litter-trained'],
    about: 'Oreo is curious and gentle. He loves hay, veggies, and doing happy jumps around the room.',
    personality: 'Curious · Gentle · Playful', energyLevel: 'Medium',
    goodWith: ['Children: Calm kids', 'Other rabbits: Yes', 'Cats and dogs: Not recommended'],
    careNeeds: ['Needs a large pen and daily time to hop freely', 'Unlimited hay, fresh greens, and water', 'Brush once a week'],
    health: 'Vaccinations up to date. Neutered. Healthy teeth.',
    story: "Oreo was given up when his family no longer had time for him. He's looking for a home with space to hop and someone to share his snacks with.",
    location: SHELTER, adoptionFee: '500 EGP',
    image: require('../../assets/images/pets/oreo.png'),
  },
  {
    id: 'blu', name: 'Blu', category: 'other',
    breed: 'Blue Macaw', sex: 'Male', age: '3 years old', size: 'Large (1 kg)',
    tags: ['Health checked', 'Hand-tamed'],
    about: 'Blu is clever, colorful, and loves attention. He enjoys talking, playing, and sitting on your shoulder.',
    personality: 'Smart · Social · Talkative', energyLevel: 'High',
    goodWith: ['Children: Older kids', 'Other pets: Keep separate', 'Owners: Best with experienced bird owners'],
    careNeeds: ['Needs a very large cage and daily time out', 'Fresh fruits, veggies, and bird pellets every day', 'Can be loud, so not ideal for apartments'],
    health: 'Health checked by a bird vet. Feathers in great condition.',
    story: "Blu's owner could no longer give him the attention he needs. Macaws can live 50+ years, so he's looking for a lifelong friend.",
    location: SHELTER, adoptionFee: '3,000 EGP',
    image: require('../../assets/images/pets/blu.png'),
  },
  {
    id: 'pea', name: 'P • E • A', category: 'other',
    breed: 'Conure Parrots', sex: '3 birds', age: '2 years old', size: 'Small (100 g each)',
    tags: ['Health checked', 'Bonded trio'],
    about: "Meet P, E, and A! Each letter is one bird, and together they're PEA. These three playful conures do everything together.",
    personality: 'Playful · Cuddly · Social', energyLevel: 'High',
    goodWith: ['Children: Older kids', 'Other pets: Keep separate', 'Owners: Great for first-time bird owners with time to play'],
    careNeeds: ['Needs a large cage for three birds', 'Daily play time outside the cage', 'Can be noisy, especially in the morning'],
    health: 'All three health checked by a bird vet. No known health issues.',
    story: "P, E, and A grew up together and have never been apart. They'll go home as a trio to a family ready for triple the fun.",
    location: SHELTER, adoptionFee: '2,500 EGP (for all 3)',
    image: require('../../assets/images/pets/pea.png'),
  },
  {
    id: 'ember', name: 'Ember', category: 'other',
    breed: 'Betta Fish', sex: 'Male', age: '1 year old', size: 'Small (6 cm)',
    tags: ['Healthy', 'Easy care'],
    about: "Ember is a bright red fish with long flowing fins. He's calm and beautiful to watch.",
    personality: 'Calm · Curious · Independent', energyLevel: 'Low',
    goodWith: ['Children: All ages', 'Other fish: Lives alone'],
    careNeeds: ['Needs a heated, filtered tank (at least 20 L)', 'Feed small amounts once or twice a day', 'Change part of the water every week'],
    health: 'Healthy fins and bright color.',
    story: "Ember was rescued from a tiny bowl. He's ready for a proper tank and a family who will enjoy watching him swim.",
    location: SHELTER, adoptionFee: '150 EGP',
    image: require('../../assets/images/pets/ember.png'),
  },
  {
    id: 'pip', name: 'Pip', category: 'other',
    breed: 'Syrian Hamster', sex: 'Female', age: '6 months old', size: 'Small (150 g)',
    tags: ['Health checked', 'Hand-tamed'],
    about: 'Pip is tiny, gentle, and curious. She loves her wheel and stuffing her cheeks with snacks.',
    personality: 'Gentle · Curious · Busy', energyLevel: 'Medium',
    goodWith: ['Children: Older kids, with adult help', 'Other hamsters: Lives alone'],
    careNeeds: ['Needs a large cage, a wheel, and deep bedding', 'Most active in the evening and at night', 'Fresh food and water every day'],
    health: 'Health checked by a vet. No known health issues.',
    story: "Pip was born in a litter that was too big for her first home. She's ready for a quiet room and gentle hands.",
    location: SHELTER, adoptionFee: '200 EGP',
    image: require('../../assets/images/pets/pip.png'),
  },
];

// Helpers the screens will use
export const getPetsByCategory = (category: Category) =>
  pets.filter((pet) => pet.category === category);

export const getPetById = (id: string) => pets.find((pet) => pet.id === id);
