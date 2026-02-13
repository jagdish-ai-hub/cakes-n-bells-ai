
import { Product, PaymentTier } from './types';

// We store the UPI ID for each tier. 
// The actual QR Code will be generated dynamically combining this ID + The Order Amount.
export const TIER_UPI_IDS: Record<PaymentTier, string> = {
  standard: '9322820147-2@axl', 
  premium: '9322820147-2@axl',   
  luxury: '9322820147-2@axl'      
};

export const DEFAULT_SECTIONS = ['Birthday Cakes', 'Anniversary Cakes', 'Celebration Cakes'];

export const PRODUCTS: Product[] = [
  // --- STANDARD CAKES (Tier: standard) ---
  {
    id: 'vanilla',
    name: 'Vanilla Cake',
    category: 'Cake',
    sections: ['Birthday Cakes', 'Celebration Cakes'],
    description: 'A classic, light, and airy vanilla sponge layered with our signature Madagascar vanilla bean cream. Perfectly balanced sweetness for every occasion.',
    prices: { '0.5kg': 380, '1kg': 700 },
    images: [
      'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517427294546-5aa12163d019?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'standard'
  },
  {
    id: 'blackforest',
    name: 'Blackforest Cake',
    category: 'Cake',
    sections: ['Birthday Cakes', 'Anniversary Cakes'],
    description: 'Delectable layers of moist chocolate sponge, whipped cream, and tart cherries. Garnished with generous chocolate shavings and maraschino cherries.',
    prices: { '0.5kg': 380, '1kg': 700 },
    images: [
      'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'standard'
  },
  {
    id: 'butterscotch',
    name: 'Butterscotch Cake',
    category: 'Cake',
    sections: ['Birthday Cakes', 'Celebration Cakes'],
    description: 'Crunchy butterscotch bits paired with a smooth caramel-infused cream. A nostalgic flavor that never fails to delight.',
    prices: { '0.5kg': 380, '1kg': 700 },
    images: [
      'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'standard'
  },
  {
    id: 'mango',
    name: 'Mango Cake',
    category: 'Cake',
    sections: ['Birthday Cakes', 'Celebration Cakes'],
    description: 'Made with real Alphonso mango pulp and fresh cream. This seasonal favorite is light, refreshing, and burst with tropical flavor.',
    prices: { '0.5kg': 380, '1kg': 700 },
    images: [
      'https://drive.google.com/thumbnail?id=1cBKfJw4_gVb473_b_aRaVjvHwF0n6o4M&sz=w1000',
      'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'standard'
  },
  {
    id: 'strawberry',
    name: 'Strawberry Cake',
    category: 'Cake',
    sections: ['Birthday Cakes'],
    description: 'Fresh strawberry compote layered between soft pink sponge and creamy frosting. A sweet and fruity indulgence.',
    prices: { '0.5kg': 380, '1kg': 700 },
    images: [
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586985289066-63f6831c21f9?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'standard'
  },
  {
    id: 'pineapple',
    name: 'Pineapple Cake',
    category: 'Cake',
    sections: ['Celebration Cakes'],
    description: 'Classic tropical treat with juicy pineapple chunks and vanilla whipped cream. Garnished with a glazed cherry.',
    prices: { '0.5kg': 380, '1kg': 700 },
    images: [
      'https://images.unsplash.com/photo-1551807501-807089c74574?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1506459225024-1428097a7e18?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'standard'
  },

  // --- PREMIUM CAKES (Tier: premium) ---
  {
    id: 'blueberry',
    name: 'Blueberry Cake',
    category: 'Cake',
    sections: ['Anniversary Cakes'],
    description: 'Indulgent cake layered with premium blueberry compote. The perfect blend of tangy and sweet for sophisticated palates.',
    prices: { '0.5kg': 400, '1kg': 760 },
    images: [
      'https://images.unsplash.com/photo-1563729768640-d813a21e69da?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1619985632461-13352f504381?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'premium'
  },
  {
    id: 'rasmali',
    name: 'Rasmalai Fusion Cake',
    category: 'Cake',
    sections: ['Celebration Cakes', 'Anniversary Cakes'],
    description: 'An exquisite fusion of traditional Indian Rasmalai and Western patisserie. Topped with pistachios, rose petals, and saffron strands.',
    prices: { '0.5kg': 400, '1kg': 760 },
    images: [
      'https://images.unsplash.com/photo-1605807646983-377bc5a76493?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'premium'
  },
  {
    id: 'mixed-fruit',
    name: 'Mixed Fruit Cake',
    category: 'Cake',
    sections: ['Birthday Cakes'],
    description: 'A colorful cornucopia of seasonal fresh fruits layered in light cream. Fresh, healthy, and absolutely delicious.',
    prices: { '0.5kg': 400, '1kg': 760 },
    images: [
      'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1488477304112-4944851de03d?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'premium'
  },

  // --- LUXURY / CHOCOLATE SPECIALS (Tier: luxury) ---
  {
    id: 'choco-truffle',
    name: 'Chocolate Truffle',
    category: 'Cake',
    sections: ['Birthday Cakes', 'Anniversary Cakes'],
    description: 'The ultimate for chocolate lovers. Rich dark chocolate ganache between layers of moist cocoa sponge.',
    prices: { '0.5kg': 420, '1kg': 820 },
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'luxury'
  },
  {
    id: 'choco-hazelnut',
    name: 'Chocolate Hazlnut',
    category: 'Cake',
    sections: ['Anniversary Cakes'],
    description: 'Creamy hazelnut spread mixed with rich chocolate ganache. Topped with roasted hazelnut pieces for extra crunch.',
    prices: { '0.5kg': 420, '1kg': 820 },
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'luxury'
  },
  {
    id: 'choco-ferrero',
    name: 'Chocolate Ferrero',
    category: 'Cake',
    sections: ['Anniversary Cakes'],
    description: 'Inspired by the world-famous truffle. Layers of hazelnut chocolate cream and wafer bits, topped with real Ferrero Rocher.',
    prices: { '0.5kg': 420, '1kg': 820 },
    images: [
      'https://images.unsplash.com/photo-1508737804141-4c3b688e2546?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'luxury'
  },
  {
    id: 'choco-chips',
    name: 'Chocolate Chocochips',
    category: 'Cake',
    sections: ['Birthday Cakes'],
    description: 'A playful chocolate cake loaded with crunchy dark chocochips in every bite. Kids and adults love it alike!',
    prices: { '0.5kg': 420, '1kg': 820 },
    images: [
      'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'luxury'
  },

  // --- CHEESECAKES (Tier: luxury) ---
  {
    id: 'biscoff-cheese',
    name: 'Biscoff Cheesecake',
    category: 'Cake',
    sections: ['Celebration Cakes'],
    description: 'Creamy baked cheesecake on a Lotus Biscoff biscuit base, topped with Biscoff spread and cookie crumbs.',
    prices: { '0.5kg': 430, '1kg': 820 },
    images: [
      'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'luxury'
  },
  {
    id: 'blueberry-cheese',
    name: 'Blueberry Cheesecake',
    category: 'Cake',
    sections: ['Celebration Cakes'],
    description: 'Classic velvety cheesecake topped with our house-made blueberry preserve. A timeless elegance.',
    prices: { '0.5kg': 430, '1kg': 820 },
    images: [
      'https://images.unsplash.com/photo-1626803775151-61d756612fcd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'luxury'
  },
  {
    id: 'mango-cheese',
    name: 'Mango Cheesecake',
    category: 'Cake',
    sections: ['Celebration Cakes'],
    description: 'A summer delight featuring smooth cheesecake swirled with fresh mango puree and topped with fresh fruit.',
    prices: { '0.5kg': 430, '1kg': 820 },
    images: [
      'https://images.unsplash.com/photo-1627054247563-3a5a755d9b4b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1519340333755-56e9c1d04579?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'luxury'
  },
  {
    id: 'strawberry-cheese',
    name: 'Strawberry Cheesecake',
    category: 'Cake',
    sections: ['Celebration Cakes'],
    description: 'Elegant cheesecake featuring a sweet and tangy strawberry glaze. Perfectly smooth and rich.',
    prices: { '0.5kg': 430, '1kg': 820 },
    images: [
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1464349141505-f93309a4d8c1?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'luxury'
  },

  // --- SPECIAL OFFERS & CONFECTIONERY (Tier: standard - default) ---
  {
    id: 'mawa-cake',
    name: 'Mawa Cake',
    category: 'Cake',
    sections: ['Celebration Cakes'],
    description: 'The soul of Parsi baking. Rich, dense, and full of aromatic cardamom and mawa. Best enjoyed with tea.',
    prices: { 'piece': 199 },
    images: [
      'https://images.unsplash.com/photo-1602351447937-745cb720612f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'standard'
  },
  {
    id: 'popsicle',
    name: 'Popsicle',
    category: 'Confectionery',
    sections: [],
    description: 'Refreshing fruit-based ice popsicles. Made with real fruit extracts and no artificial preservatives.',
    prices: { 'piece': 39 },
    images: [
      'https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1505394033641-40c6ad1178d1?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'standard'
  },
  {
    id: 'donuts',
    name: 'Sprinkle Donuts',
    category: 'Confectionery',
    sections: [],
    description: 'Hand-dipped donuts with a choice of chocolate or vanilla glaze and colorful rainbow sprinkles.',
    prices: { 'piece': 49 },
    images: [
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1612240498936-31f880609590?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'standard'
  },
  {
    id: 'cupcake',
    name: 'Gourmet Cupcake',
    category: 'Confectionery',
    sections: [],
    description: 'Individual masterpieces of cake and frosting. Perfectly portioned joy for any celebration.',
    prices: { 'piece': 89 },
    images: [
      'https://images.unsplash.com/photo-1614707267537-b85af00c4b81?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'standard'
  },
  {
    id: 'brownies',
    name: 'Chocolate Brownies',
    category: 'Confectionery',
    sections: [],
    description: 'Decadent, fudgy chocolate brownies that melt in your mouth. Made with premium Belgian chocolate.',
    prices: { 'piece': 70 },
    images: [
      'https://images.unsplash.com/photo-1610611382875-52b6540c7931?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515037893149-de7f840978e2?auto=format&fit=crop&q=80&w=800'
    ],
    paymentTier: 'standard'
  },
  {
    id: 'combo-box-1',
    name: 'B\'day Party Combo 1',
    category: 'Confectionery',
    sections: [],
    description: 'The ultimate Party Box Trio: Includes a Classic Burger, Golden French Fries, and a Gourmet Cupcake. Joy in a box!',
    prices: { 'piece': 129 },
    images: [
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=800', // Burger
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800', // Fries
      'https://images.unsplash.com/photo-1614707267537-b85af00c4b81?auto=format&fit=crop&q=80&w=800'  // Cupcake
    ],
    paymentTier: 'standard'
  },
  {
    id: 'combo-box-2',
    name: 'B\'day Party Combo 2',
    category: 'Confectionery',
    sections: [],
    description: 'Party Box Duo: Includes a Mini Pizza and a refreshing fruit Popsicle. Perfect for kids parties!',
    prices: { 'piece': 129 },
    images: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800', // Pizza
      'https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&q=80&w=800', // Popsicle
      'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=800'  // Chips
    ],
    paymentTier: 'standard'
  },
  {
    id: 'combo-box-3',
    name: 'B\'day Party Combo 3',
    category: 'Confectionery',
    sections: [],
    description: 'Gourmet Trio: Creamy White Sauce Pasta, a Sprinkle Donut, and Potato Smiles. The perfect treat!',
    prices: { 'piece': 129 },
    images: [
      'https://images.unsplash.com/photo-1473093226795-af9932fe5855?auto=format&fit=crop&q=80&w=800', // Pasta
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800', // Donut
      'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&q=80&w=800'  // Smiles
    ],
    paymentTier: 'standard'
  }
];

export const WHATSAPP_NUMBER = '+919438394676';
