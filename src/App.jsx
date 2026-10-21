import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  CakeSlice,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Coffee,
  CupSoda,
  Facebook,
  Instagram,
  MapPin,
  MessageCircle,
  Moon,
  Search,
  ShoppingBag,
  Sparkles,
  Sun,
  Utensils,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AddToCartControl,
  CartButton,
  CartDrawer,
  CartFab,
  CartProvider,
  parsePrice,
  useCart,
} from "./cart";
import { whatsAppUrl } from "./whatsapp";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { id: "calientes", label: "Calientes", icon: Coffee },
  { id: "frias", label: "Café frío", icon: CupSoda },
  { id: "jugos", label: "Jugos", icon: CupSoda },
  { id: "desayunos", label: "Desayunos", icon: Sun },
  { id: "helados", label: "Helados", icon: CakeSlice },
  { id: "postres", label: "Postres", icon: CakeSlice },
  { id: "salados", label: "Salados", icon: Utensils },
  { id: "cocteleria", label: "Coctelería", icon: Sparkles },
];

const productImages = {
  latte:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1100&q=85",
  cappuccino:
    "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1100&q=85",
  americano:
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1100&q=85",
  mocaccino:
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1100&q=85",
  coldBrew:
    "https://images.unsplash.com/photo-1523368749929-6b2bf370dbf8?auto=format&fit=crop&w=1100&q=85",
  frappe:
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1100&q=85",
  tea:
    "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=1100&q=85",
  cheesecake:
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1100&q=85",
  brownie:
    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1100&q=85",
  waffle:
    "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=1100&q=85",
  croissant:
    "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1100&q=85",
  toast:
    "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=1100&q=85",
  sandwich:
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1100&q=85",
  combo:
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1100&q=85",
  brunch:
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1100&q=85",
  seasonal:
    "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=1100&q=85",
  juice:
    "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=1100&q=85",
  breakfast:
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1100&q=85",
  savory:
    "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=1100&q=85",
  cocktail:
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1100&q=85",
  espresso:
    "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=1100&q=85",
  filtered:
    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1100&q=85",
  hotChocolate:
    "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=1100&q=85",
  matcha:
    "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1100&q=85",
  milkshake:
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1100&q=85",
  lemonade:
    "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=1100&q=85",
  pancakes:
    "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1100&q=85",
  frenchToast:
    "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=1100&q=85",
  oatmeal:
    "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=1100&q=85",
  donut:
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1100&q=85",
  cake:
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1100&q=85",
  cookie:
    "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1100&q=85",
  tiramisu:
    "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1100&q=85",
  bruschetta:
    "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=1100&q=85",
  empanada:
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1100&q=85",
  shawarma:
    "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=1100&q=85",
  fries:
    "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=1100&q=85",
  burger:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1100&q=85",
  pizza:
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1100&q=85",
  pasta:
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1100&q=85",
  lasagna:
    "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=1100&q=85",
  wings:
    "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=1100&q=85",
  ribs:
    "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1100&q=85",
  salad:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1100&q=85",
  beer:
    "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=1100&q=85",
  mojito:
    "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=1100&q=85",
};

const localImage =
  "https://res.cloudinary.com/dsay0it3n/image/upload/q_auto/f_auto/v1780539396/Lunaria_rcy0mu.jpg";

const imagePools = {
  hotCoffee: [productImages.espresso, productImages.americano, productImages.cappuccino, productImages.latte, productImages.mocaccino, productImages.filtered, productImages.hotChocolate, productImages.matcha, "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1100&q=85", "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1100&q=85", "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=1100&q=85", "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1100&q=85"],
  coldCoffee: [productImages.coldBrew, productImages.frappe, productImages.milkshake, productImages.matcha, productImages.latte, productImages.seasonal, "https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?auto=format&fit=crop&w=1100&q=85", "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=1100&q=85"],
  juices: [productImages.juice, productImages.lemonade, productImages.tea, productImages.milkshake, "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=1100&q=85", "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1100&q=85", "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=1100&q=85"],
  breakfast: [productImages.frenchToast, productImages.pancakes, productImages.oatmeal, productImages.waffle, "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1100&q=85", "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1100&q=85"],
  desserts: [productImages.cheesecake, productImages.brownie, productImages.donut, productImages.cake, productImages.cookie, productImages.tiramisu, productImages.croissant, "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1100&q=85", "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=1100&q=85"],
  savory: [productImages.bruschetta, productImages.empanada, productImages.shawarma, productImages.fries, productImages.sandwich, productImages.salad, productImages.burger, productImages.pizza, productImages.pasta, productImages.lasagna, productImages.wings, productImages.ribs],
  cocktails: [productImages.cocktail, productImages.mojito, productImages.beer, "https://images.unsplash.com/photo-1551751299-1b51cab2694c?auto=format&fit=crop&w=1100&q=85", "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1100&q=85"],
};

function hashName(value) {
  return [...value].reduce((hash, letter) => (hash * 31 + letter.charCodeAt(0)) >>> 0, 7);
}

function uniqueMenuImage(images, name) {
  const hash = hashName(name);
  const image = images[hash % images.length];
  const focusX = 30 + (hash % 41);
  const focusY = 32 + ((hash >>> 4) % 35);

  return `${image}&crop=entropy&fp-x=${focusX / 100}&fp-y=${focusY / 100}`;
}

function imageForProduct(name, fallback) {
  const value = name.toLowerCase();

  if (value.includes("espresso") || value.includes("americano") || value.includes("filtrado") || value.includes("macchiato") || value.includes("cappuccino") || value.includes("flat white")) return uniqueMenuImage(imagePools.hotCoffee, name);
  if (value.includes("chocolate caliente") || value.includes("peppermint") || value.includes("chai") || (value.includes("té") && !value.includes("frío")) || (value.includes("matcha") && !value.includes("ice") && !value.includes("frapp")) || (value.includes("latte") && !value.includes("iced") && !value.includes("ice"))) return uniqueMenuImage(imagePools.hotCoffee, name);
  if (value.includes("affogato") || value.includes("iced") || value.includes("ice ") || value.includes("frappé") || value.includes("frappe") || value.includes("milk shake")) return uniqueMenuImage(imagePools.coldCoffee, name);
  if (value.includes("jugo") || value.includes("batido") || value.includes("limonada") || value.includes("frozen") || value.includes("frío")) return uniqueMenuImage(imagePools.juices, name);
  if (value.includes("creppé") || value.includes("creppe") || value.includes("tostada francesa") || value.includes("pancake") || value.includes("avena") || value.includes("bowl") || value.includes("waffle")) return uniqueMenuImage(imagePools.breakfast, name);
  if (value.includes("roll") || value.includes("dona") || value.includes("cake") || value.includes("galleta") || value.includes("mojada") || value.includes("cheesecake") || value.includes("tres leches") || value.includes("tiramisú") || value.includes("tiramisu") || value.includes("brownie") || (value.includes("croissant") && !value.includes("jamón") && !value.includes("queso"))) return uniqueMenuImage(imagePools.desserts, name);
  if (value.includes("pan de ajo") || value.includes("pan pizza") || value.includes("pizza") || value.includes("bruschetta") || value.includes("empanada") || value.includes("shawarma") || value.includes("papa") || value.includes("fries") || value.includes("sánduche") || value.includes("sanduche") || value.includes("ensalada") || value.includes("hamburguesa") || value.includes("cheeseburger") || value.includes("ciabatta") || value.includes("lasaña") || value.includes("alitas") || value.includes("fetuccini") || value.includes("alfredo") || value.includes("costillas") || value.includes("hojaldre") || value.includes("jamón")) return uniqueMenuImage(imagePools.savory, name);
  if (value.includes("cerveza") || value.includes("mojito")) return uniqueMenuImage(imagePools.cocktails, name);
  if (
    value.includes("margarita") ||
    value.includes("martini") ||
    value.includes("daiquir") ||
    value.includes("michelada") ||
    value.includes("chelada") ||
    value.includes("corona sunrise") ||
    value.includes("luna rosada") ||
    value.includes("vodkazao") ||
    value.includes("tinto")
  ) {
    return uniqueMenuImage(imagePools.cocktails, name);
  }

  return uniqueMenuImage([fallback, ...imagePools.hotCoffee], name);
}

const menuSections = [
  {
    category: "calientes",
    section: "Cafetería / bebidas",
    subcategory: "Calientes",
    image: productImages.latte,
    description: "Bebida caliente preparada al momento en Cafetería Lunaria.",
    items: [
      ["Espresso", "$1,50"],
      ["Americano", "$1,75"],
      ["Filtrado Catuai El Aguacate", "$2,50"],
      ["Filtrado Sidra El Carmen", "$3,25"],
      ["Filtrado Sidra Aurum", "$3,25"],
      ["Macchiato", "$1,75"],
      ["Cappuccino", "$2,50"],
      ["Flat White", "$2,00"],
      ["Chocolate Caliente", "$2,00"],
      ["Mocaccino", "$3,00"],
      ["Latte Saborizado", "$3,25"],
      ["Latte", "$2,75"],
      ["Matcha Latte", "$3,00"],
      ["PepperMint Moca", "$3,25"],
      ["Chai Latte", "$3,25"],
      ["Té de Frutos Rojos", "$2,25"],
      ["Pistacho Latte", "$3,50"],
    ],
  },
  {
    category: "frias",
    section: "Cafetería / bebidas",
    subcategory: "Frías",
    image: productImages.coldBrew,
    description: "Café frío, frappés y bebidas cremosas para tardes luminosas.",
    items: [
      ["Affogato", "$2,50"],
      ["Iced Coffee", "$2,50"],
      ["Caramel Iced Latte", "$3,50"],
      ["Moca Iced Latte", "$3,50"],
      ["Iced Latte", "$3,00"],
      ["Matcha Ice Latte", "$3,50"],
      ["Salted Caramel Iced Latte", "$3,50"],
      ["Pistacho Iced Latte", "$3,75"],
      ["Tiramisu Latte", "$4,00"],
      ["Frappé Clásico", "$3,00"],
      ["Frappé Caramelo", "$3,25"],
      ["Frappé Oreo", "$3,25"],
      ["Frappé Mocca", "$3,25"],
      ["Milk shake Café", "$3,25"],
      ["Milk shake Vainilla", "$3,25"],
      ["Milk shake Fresa", "$3,50"],
      ["Milk shake Oreo", "$3,50"],
      ["Milk shake Chocolate", "$3,50"],
      ["Frappé Matcha", "$3,50"],
      ["Limonada de Café", "$3,00"],
    ],
  },
  {
    category: "jugos",
    section: "Jugos / bebidas",
    subcategory: "Frías",
    image: productImages.juice,
    description: "Jugos, limonadas y tés fríos para refrescar la pausa.",
    items: [
      ["Jugo de Naranja y fresa", "$2,25"],
      ["Jugo de Maracuyá", "$1,75"],
      ["Jugo de Mora", "$1,75"],
      ["Jugo de Naranja", "$1,75"],
      ["Jugo de Fresa", "$1,75"],
      ["Batidos", "$2,25"],
      ["Limonada rosa", "$2,25"],
      ["Limonada azul", "$2,25"],
      ["Limonada de Frutos rojos", "$2,50"],
      ["Frozen", "$2,50"],
      ["Frozen doble", "$3,00"],
      ["Té de Frutos rojos Frío", "$2,50"],
      ["Té Negro Frío", "$1,50"],
      ["Té Negro con menta Frío", "$2,25"],
      ["Té de Durazno Frío", "$1,75"],
    ],
  },
  {
    category: "desayunos",
    section: "Desayunos all day",
    subcategory: "General",
    image: productImages.breakfast,
    description: "Desayunos dulces para pedir a cualquier hora del día.",
    items: [
      ["Creppé de Nutella y Fresas", "$2,75"],
      ["Tostada Francesa con Nutella y Helado", "$3,50"],
      ["Tostada Francesa de Tiramisú", "$4,00"],
      ["Pancakes con Frutas y Miel", "$3,50"],
      ["Pancakes con Frutas, Nutella y Crema", "$4,25"],
      ["Bowl de Avena con Frutas y Yogurt", "$4,00"],
      ["Waffle Sencillo", "$3,00"],
      ["Waffle de Nutella y Frutas con Helado", "$4,50"],
      ["Waffle de Frutos Rojos", "$5,50"],
    ],
  },
  {
    category: "postres",
    section: "Postres",
    subcategory: "General",
    image: productImages.cheesecake,
    description: "Postres artesanales para acompañar café o compartir.",
    items: [
      ["Roll de Canela", "$0,75"],
      ["Donas de Chocolate", "$0,75"],
      ["Cake de Zanahoria", "$1,50"],
      ["Cake de Manzana y Nuez", "$1,50"],
      ["Galleta Chocolate Kinder", "$2,00"],
      ["Galleta Kinder con Helado", "$3,00"],
      ["New York Roll", "$2,00"],
      ["New York Roll de Pistacho", "$2,50"],
      ["Mojada de Chocolate", "$2,25"],
      ["Cheesecake de Frutos Rojos", "$3,00"],
      ["Tres Leches", "$2,50"],
      ["Tiramisú", "$2,50"],
      ["Croissant de Nutella con Helado", "$2,75"],
      ["Croissant de Nutella y Fresas", "$2,50"],
      ["Croissant de Nutella", "$1,25"],
      ["Croissant de Pistacho", "$1,75"],
      ["Brownie con Helado", "$2,75"],
    ],
  },
  {
    category: "salados",
    section: "Platos de sal",
    subcategory: "Antojos",
    image: productImages.savory,
    description: "Bocados salados para acompañar café, charla o almuerzo ligero.",
    items: [
      ["Croissant", "$0,75"],
      ["Pan de ajo (x2 u.)", "$0,50"],
      ["Pan Pizza", "$0,75"],
      ["Sánduche Integral", "$1,25"],
      ["Bruschetta", "$2,00"],
      ["Pastel Hojaldre de Pollo", "$2,00"],
      ["Croissant de Jamón y Queso", "$2,00"],
      ["Empanada Chilena", "$2,00"],
    ],
  },
  {
    category: "salados",
    section: "Platos de sal",
    subcategory: "Fuertes",
    image: productImages.sandwich,
    description: "Platos fuertes para una visita con más hambre.",
    items: [
      ["Shawarma de Pollo", "$2,75"],
      ["Papas Fritas", "$2,00"],
      ["Bacon Cheese Fries", "$3,00"],
      ["Sánduche de Pernil", "$3,75"],
      ["Creppé de Pollo", "$4,00"],
      ["Ensalada César con Pollo", "$5,00"],
      ["Hamburguesa Cheese Bacon", "$4,00"],
      ["Hamburguesa Doble", "$6,00"],
      ["Ciabatta de Lomo", "$4,25"],
      ["Lasaña de Pollo", "$5,00"],
      ["Lasaña de Carne", "$6,00"],
      ["Alitas", "$6,00"],
      ["Pizza Lunaria", "$6,00"],
      ["Tocino cheeseburger", "Consultar"],
      ["Pizza Marte", "$4,50"],
      ["Pizza Funghi", "$5,00"],
      ["Fetuccini Alfredo", "$7,00"],
      ["Costillas ~250 g", "$9,00"],
    ],
  },
  {
    category: "cocteleria",
    section: "Coctelería",
    subcategory: "General",
    image: productImages.cocktail,
    description: "Cocteles y cervezas para mayores de edad.",
    items: [
      ["Michelada", "$2,50"],
      ["Michelada de Maracuyá", "$2,75"],
      ["Chelada", "$2,25"],
      ["Chelada de Maracuyá", "$2,50"],
      ["Cerveza Corona", "$2,50"],
      ["Cerveza Club", "$2,00 / $2,50"],
      ["Cerveza Paulaner", "$4,50 / $5,00"],
      ["Tinto de Verano", "$4,00"],
      ["Corona Sunrise", "$4,50"],
      ["Margarita", "$5,00"],
      ["Espresso Martini", "$4,00"],
      ["Mojito Clásico", "$4,50"],
      ["Mojito Frutos rojos / Maracuyá", "$5,50"],
      ["Vodkazao", "$5,00"],
      ["Luna Rosada", "$5,50"],
      ["Daiquirí", "$5,00"],
      ["Daiquirí Fresa / Mora / Frutos rojos / Maracuyá", "$5,50"],
    ],
  },
];

const products = menuSections.flatMap((section) =>
  section.items.map(([name, price], index) => ({
    category: section.category,
    section: section.section,
    subcategory: section.subcategory,
    name,
    price,
    description: section.description,
    image: imageForProduct(name, section.image),
    tag: index === 0 ? section.subcategory : undefined,
    id: `${section.section}·${section.subcategory}·${name}`,
    priceOptions: parsePrice(price).values,
  })),
);

const gallery = [
  {
    title: "Latte art",
    image:
      "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=1000&q=85",
    tall: true,
  },
  {
    title: "Postres artesanales",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Mesa cálida",
    image:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1000&q=85",
    tall: true,
  },
  {
    title: "Brunch Lunaria",
    image:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Café boutique",
    image:
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1000&q=85",
    tall: true,
  },
  {
    title: "Panaderia dulce",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Interior acogedor",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Momentos Lunaria",
    image:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1000&q=85",
    tall: true,
  },
];

const faqs = [
  {
    question: "¿Puedo pedir por WhatsApp?",
    answer:
      "Sí. Cada botón de pedido abre WhatsApp con un mensaje listo para enviar a Cafetería Lunaria.",
  },
  {
    question: "¿Dónde puedo ver el menú?",
    answer:
      "El menú principal está en esta página con categorías, buscador, fotos y botones para pedir. El botón Ver menú completo muestra toda la carta visual sin salir de la web.",
  },
  {
    question: "¿Puedo reservar mesa?",
    answer:
      "Sí. El botón Reservar mesa abre WhatsApp para coordinar el día, hora y cantidad de personas.",
  },
  {
    question: "¿Tienen postres y bebidas frías?",
    answer:
      "La carta visual incluye cafés, bebidas frías, postres, salados y especiales para elegir según el antojo.",
  },
  {
    question: "¿El menú funciona en celular?",
    answer:
      "Sí. La experiencia está pensada mobile-first para explorar, buscar y pedir rápido desde el teléfono.",
  },
  {
    question: "¿Puedo armar un pedido para llevar?",
    answer:
      "Sí. Añade los productos que quieras al carrito, ajusta las cantidades, deja una nota si hace falta y pulsa «Hacer pedido por WhatsApp». Se abrirá WhatsApp con el pedido ya escrito para que solo tengas que enviarlo.",
  },
];

function scrollToId(id, event) {
  event?.preventDefault?.();
  const target = document.getElementById(id);
  if (!target) return;

  const navOffset = window.innerWidth < 768 ? 104 : 112;
  const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
  window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });

  if (window.location.hash !== `#${id}`) {
    window.history.replaceState(null, "", `#${id}`);
  }
}

function productMatchesCategory(product, category) {
  if (category === "todos") return true;

  if (category === "helados") {
    const value = product.name.toLowerCase();
    return (
      value.includes("helado") ||
      value.includes("milk shake") ||
      value.includes("affogato")
    );
  }

  return product.category === category;
}

function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  target,
  rel,
  type = "button",
  ariaLabel,
}) {
  const buttonRef = useRef(null);

  useEffect(() => {
    const element = buttonRef.current;
    if (!element) return undefined;

    const handleMove = (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
      gsap.to(element, {
        x,
        y,
        scale: 1.03,
        duration: 0.35,
        ease: "power2.out",
      });
    };

    const handleLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.45,
        ease: "power2.inOut",
      });
    };

    element.addEventListener("mousemove", handleMove);
    element.addEventListener("mouseleave", handleLeave);

    return () => {
      element.removeEventListener("mousemove", handleMove);
      element.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const classes = `magnetic-button inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lunaria-solar sm:px-6 ${className}`;

  if (href) {
    return (
      <a
        ref={buttonRef}
        href={href}
        onClick={onClick}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={classes}
    >
      {children}
    </button>
  );
}

function ProductCard({ product }) {
  return (
    <article className="menu-card group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-lunaria-coffee/10 bg-white shadow-warm transition duration-500 hover:-translate-y-1 hover:scale-[1.02]">
      <div className="relative aspect-square shrink-0 overflow-hidden rounded-b-[1.5rem]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-lunaria-coffee/46 via-lunaria-coffee/8 to-transparent" />
        {product.tag && (
          <span className="absolute left-5 top-5 rounded-full bg-lunaria-cream px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-lunaria-coffee shadow-soft">
            {product.tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-lunaria-coffee/60">
          {product.section} · {product.subcategory}
        </p>
        <div className="mt-3 flex items-start justify-between gap-3">
          <h3 className="text-base font-extrabold leading-tight text-lunaria-coal sm:text-lg">
            {product.name}
          </h3>
          <span className="shrink-0 rounded-full bg-lunaria-warm px-3 py-2 font-mono text-xs font-bold text-lunaria-solar sm:text-sm">
            {product.price}
          </span>
        </div>

        <div className="mt-auto pt-4">
          <AddToCartControl product={product} />
        </div>
      </div>
    </article>
  );
}

function LunariaSite() {
  const appRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("todos");
  const [query, setQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState(0);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = productMatchesCategory(product, activeCategory);
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [
          product.name,
          product.description,
          product.price,
          product.tag,
          product.section,
          product.subcategory,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, query]);

  const featuredProducts = useMemo(() => {
    const featuredNames = [
      "Pistacho Latte",
      "Tiramisu Latte",
      "Cheesecake de Frutos Rojos",
      "Pizza Lunaria",
    ];

    return featuredNames
      .map((name) => products.find((product) => product.name === name))
      .filter(Boolean);
  }, []);

  const groupedProducts = useMemo(
    () =>
      menuSections
        .map((section) => ({
          ...section,
          products: filteredProducts.filter(
            (product) =>
              product.section === section.section &&
              product.subcategory === section.subcategory,
          ),
        }))
        .filter((section) => section.products.length > 0),
    [filteredProducts],
  );

  useEffect(() => {
    const updateScroll = () => setIsScrolled(window.scrollY > 18);
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-copy > *", {
        opacity: 0,
        y: 32,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.from(".hero-mockup", {
        opacity: 0,
        scale: 0.85,
        y: 42,
        duration: 1.1,
        delay: 0.16,
        ease: "power3.out",
      });

      gsap.utils.toArray(".reveal").forEach((element) => {
        gsap.from(element, {
          scrollTrigger: {
            trigger: element,
            start: "top 84%",
          },
          opacity: 0,
          y: 34,
          duration: 0.85,
          ease: "power3.out",
        });
      });

      gsap.utils.toArray(".stagger-section").forEach((section) => {
        const items = section.querySelectorAll(".stagger-item");
        if (!items.length) return;

        gsap.from(items, {
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
          opacity: 0,
          y: 30,
          duration: 0.85,
          stagger: 0.15,
          ease: "power3.out",
        });
      });
    }, appRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <main
        ref={appRef}
        className="relative min-h-screen overflow-hidden bg-lunaria-warm text-lunaria-coal"
      >
        <Navbar isScrolled={isScrolled} />
        <Hero />
        <FeaturedMenuSection
          featuredProducts={featuredProducts}
          setActiveCategory={setActiveCategory}
          setQuery={setQuery}
        />
        <FullMenuSection
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          query={query}
          setQuery={setQuery}
          groupedProducts={groupedProducts}
          visibleCount={filteredProducts.length}
        />
        <Gallery />
        <LocalSpotlight />
        <Process />
        <FAQ activeFaq={activeFaq} setActiveFaq={setActiveFaq} />
        <FinalCTA />
        <Footer />
      </main>

      <CartFab />
      <CartDrawer />
    </>
  );
}

function App() {
  return (
    <CartProvider products={products}>
      <LunariaSite />
    </CartProvider>
  );
}

function useOrderWhatsAppUrl() {
  const { orderLink } = useCart();

  return orderLink || whatsAppUrl("Hola, quiero hacer un pedido en Cafetería Lunaria.");
}

function Navbar({ isScrolled }) {
  const [open, setOpen] = useState(false);
  const orderUrl = useOrderWhatsAppUrl();
  const navLinks = [
    { label: "Inicio", id: "inicio" },
    { label: "Menú", id: "menu" },
    { label: "Galería", id: "galeria" },
    { label: "Contacto", id: "contacto" },
  ];

  const handleNavClick = (id) => {
    scrollToId(id);
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav
        className={`mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full border px-4 py-3 transition-all duration-500 sm:px-5 ${
          isScrolled
            ? "border-lunaria-coffee/12 bg-lunaria-warm/82 shadow-soft backdrop-blur-2xl"
            : "border-lunaria-coffee/8 bg-white/58 shadow-[0_18px_60px_rgba(122,74,46,0.10)] backdrop-blur-xl"
        }`}
      >
        <button
          type="button"
          onClick={() => handleNavClick("inicio")}
          className="group flex items-center gap-2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lunaria-solar"
          aria-label="Ir al inicio"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-lunaria-solar text-white shadow-solar transition group-hover:-translate-y-0.5">
            <Moon className="h-5 w-5 fill-white/20" />
          </span>
          <span className="hidden text-left leading-none sm:block">
            <span className="block text-sm font-extrabold">
              Cafetería Lunaria
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-lunaria-coffee/70">
              Piñas, El Oro
            </span>
          </span>
        </button>

        <div className="hidden items-center gap-1 rounded-full bg-white/62 p-1 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className="rounded-full px-4 py-2 text-sm font-bold text-lunaria-coal/72 transition hover:-translate-y-0.5 hover:bg-lunaria-cream hover:text-lunaria-coal"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <MagneticButton
            href={orderUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden bg-lunaria-coal text-white hover:bg-lunaria-solar sm:inline-flex"
          >
            Pedir por WhatsApp
            <MessageCircle className="h-4 w-4" />
          </MagneticButton>

          <CartButton />

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="grid h-11 w-11 place-items-center rounded-full bg-lunaria-coal text-white md:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            <span className="relative h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 rounded bg-white transition ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-5 rounded bg-white transition ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-5 rounded bg-white transition ${
                  open ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="mx-auto mt-3 max-w-5xl rounded-[2rem] border border-lunaria-coffee/10 bg-white/92 p-3 shadow-warm backdrop-blur-2xl md:hidden">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className="flex w-full items-center justify-between rounded-full px-4 py-3 text-left text-sm font-extrabold text-lunaria-coal transition hover:bg-lunaria-cream"
            >
              {link.label}
              <ArrowUpRight className="h-4 w-4" />
            </button>
          ))}
          <MagneticButton
            href={orderUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 w-full bg-lunaria-solar text-white"
          >
            Pedir por WhatsApp
            <MessageCircle className="h-4 w-4" />
          </MagneticButton>
        </div>
      )}
    </header>
  );
}

function Hero() {
  const orderUrl = useOrderWhatsAppUrl();

  return (
    <section
      id="inicio"
      className="relative isolate min-h-screen scroll-mt-28 overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8"
    >
      <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-lunaria-latte blur-3xl" />
      <div className="absolute right-[-9rem] top-12 h-96 w-96 rounded-full bg-lunaria-cream blur-3xl" />
      <div className="absolute bottom-6 left-[16%] h-52 w-52 rounded-[42%_58%_54%_46%] bg-lunaria-solar/20 blur-2xl" />
      <div className="organic-shape left-[6%] top-[42%] hidden bg-lunaria-solar/16 lg:block" />
      <div className="organic-shape right-[7%] top-[38%] hidden bg-lunaria-latte/70 lg:block" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div className="hero-copy relative z-10 max-w-3xl pt-6 lg:pt-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-lunaria-coffee/12 bg-white/72 px-4 py-2 shadow-soft backdrop-blur">
            <Sun className="h-4 w-4 text-lunaria-solar" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-lunaria-coffee">
              Solar Studio · Lunaria cálida
            </span>
          </div>

          <h1 className="mt-7 max-w-4xl text-[clamp(2.85rem,5.6vw,5.9rem)] font-black leading-[0.92] tracking-normal text-lunaria-coal">
            <span className="block">Café, postres y momentos con</span>
            <span className="mt-3 block font-serif italic text-lunaria-solar">
              luz propia.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-lunaria-coal/70 sm:text-xl">
            Descubre el nuevo universo visual de Cafetería Lunaria: café de
            especialidad, sabores dulces y un menú diseñado para antojar desde
            el primer vistazo.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <MagneticButton
              onClick={(event) => scrollToId("menu", event)}
              className="bg-lunaria-solar text-white shadow-solar hover:bg-lunaria-coffee"
            >
              Ver menú
              <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton
              href={orderUrl}
              target="_blank"
              rel="noreferrer"
              className="border border-lunaria-coffee/12 bg-white text-lunaria-coal shadow-soft hover:bg-lunaria-cream"
            >
              Hacer pedido
              <MessageCircle className="h-4 w-4" />
            </MagneticButton>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {["Café de especialidad", "Postres artesanales", "Reservas por WhatsApp"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full bg-white/72 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-lunaria-coffee shadow-soft"
                >
                  {item}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="hero-mockup relative z-10 mx-auto w-full max-w-[560px]">
          <div className="absolute -left-6 top-10 z-20 hidden rotate-[-8deg] rounded-[1.5rem] bg-white px-5 py-4 shadow-warm sm:block">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-lunaria-solar">
              Café
            </span>
            <p className="mt-1 text-sm font-extrabold text-lunaria-coal">
              Latte Lunaria
            </p>
          </div>
          <div className="absolute -right-4 bottom-28 z-20 rounded-[1.5rem] bg-lunaria-cream px-5 py-4 shadow-warm">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-lunaria-coffee">
              Postres
            </span>
            <p className="mt-1 text-sm font-extrabold text-lunaria-coal">
              Cheesecake
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[3rem] border border-white/78 bg-white/82 p-4 shadow-warm backdrop-blur">
            <div className="overflow-hidden rounded-[2.4rem]">
              <img
                src={productImages.latte}
                alt="Latte art cálido en Cafetería Lunaria"
                className="h-[390px] w-full object-cover sm:h-[500px]"
              />
            </div>

            <div className="absolute inset-x-7 bottom-7 rounded-[2rem] border border-white/52 bg-lunaria-warm/90 p-4 shadow-warm backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-lunaria-solar">
                    Carta digital
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-lunaria-coal">
                    Menú Lunaria
                  </h2>
                </div>
                <span className="rounded-full bg-lunaria-solar px-4 py-2 font-mono text-sm font-bold text-white">
                  $3.50
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {["Café", "Postres", "Desayunos"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white px-3 py-2 text-center font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-lunaria-coffee"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -bottom-8 left-8 right-8 -z-10 h-24 rounded-full bg-lunaria-solar/24 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

function FeaturedMenuSection({ featuredProducts, setActiveCategory, setQuery }) {
  const openFullMenu = (event) => {
    setQuery("");
    setActiveCategory("todos");
    scrollToId("menu", event);
  };

  return (
    <section
      id="favoritos"
      className="relative scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-x-0 top-16 -z-10 h-[32rem] bg-solar-soft opacity-80" />
      <div className="mx-auto max-w-7xl">
        <div className="reveal mx-auto max-w-3xl text-center">
          <span className="section-kicker">Carta premium interactiva</span>
          <h2 className="mt-4 text-[clamp(2.5rem,5vw,5rem)] font-black leading-[0.95] tracking-normal text-lunaria-coal">
            Los favoritos primero,
            <span className="block font-serif italic text-lunaria-solar">
              la carta completa después.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-lunaria-coal/68">
            Una muestra rápida de lo más pedido para abrir el apetito antes de
            pasar al menú completo por categorías.
          </p>
        </div>

        <div className="stagger-section mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <div key={product.name} className="stagger-item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="reveal mt-10 flex justify-center">
          <MagneticButton
            onClick={openFullMenu}
            className="bg-lunaria-coal text-white shadow-warm hover:bg-lunaria-solar"
          >
            Ver menú completo
            <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

function FullMenuSection({
  activeCategory,
  setActiveCategory,
  query,
  setQuery,
  groupedProducts,
  visibleCount,
}) {
  return (
    <section
      id="menu"
      className="relative min-h-screen scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-x-0 top-16 -z-10 h-[38rem] bg-lunaria-latte/24" />
      <div className="mx-auto max-w-7xl">
        <div className="reveal mx-auto max-w-3xl text-center">
          <span className="section-kicker">Menú completo</span>
          <h2 className="mt-4 text-[clamp(2.5rem,5vw,5rem)] font-black leading-[0.95] tracking-normal text-lunaria-coal">
            Toda la carta,
            <span className="block font-serif italic text-lunaria-solar">
              por secciones.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-lunaria-coal/68">
            Explora calientes, frías, desayunos, postres, helados, salados y
            coctelería sin salir de esta pantalla.
          </p>
        </div>

        <div className="reveal mt-10 rounded-[2.5rem] border border-lunaria-coffee/10 bg-white/76 p-4 shadow-warm backdrop-blur-xl sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-lunaria-coffee/55" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar en el menú..."
                className="h-14 w-full rounded-full border border-lunaria-coffee/10 bg-white pl-13 pr-5 text-sm font-bold text-lunaria-coal shadow-soft outline-none transition placeholder:text-lunaria-coffee/44 focus:border-lunaria-solar"
              />
            </label>
            <div className="flex h-14 items-center justify-center rounded-full bg-lunaria-coal px-5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-white">
              {visibleCount} productos
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => setActiveCategory("todos")}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-3 text-sm font-extrabold transition ${
                activeCategory === "todos"
                  ? "bg-lunaria-solar text-white shadow-solar"
                  : "bg-lunaria-warm text-lunaria-coal hover:-translate-y-0.5 hover:bg-lunaria-cream"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Todo
            </button>
            {categories.map((category) => {
              const Icon = category.icon;
              const active = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-3 text-sm font-extrabold transition ${
                    active
                      ? "bg-lunaria-solar text-white shadow-solar"
                      : "bg-lunaria-warm text-lunaria-coal hover:-translate-y-0.5 hover:bg-lunaria-cream"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 space-y-12">
          {groupedProducts.map((section) => (
            <section key={`${section.section}-${section.subcategory}`}>
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-lunaria-solar">
                    {section.subcategory}
                  </p>
                  <h3 className="mt-2 text-3xl font-black text-lunaria-coal">
                    {section.section}
                  </h3>
                </div>
                <span className="w-fit rounded-full bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-lunaria-coffee shadow-soft">
                  {section.products.length} opciones
                </span>
              </div>

              <div className="stagger-section grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {section.products.map((product) => (
                  <div key={`${section.section}-${product.name}`} className="stagger-item">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-lunaria-coffee/68">
          Precios y disponibilidad según carta en barra. Bebidas con alcohol
          solo para mayores de edad.
        </p>

        {visibleCount === 0 && (
          <div className="mt-10 rounded-[2rem] border border-lunaria-coffee/10 bg-white p-8 text-center shadow-soft">
            <p className="font-serif text-2xl italic text-lunaria-solar">
              No encontramos ese antojo.
            </p>
            <p className="mt-2 text-lunaria-coal/64">
              Prueba con otra palabra o cambia de categoría.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="galeria" className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="reveal flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="section-kicker">Galería Lunaria</span>
            <h2 className="mt-4 text-[clamp(2.3rem,5vw,4.8rem)] font-black leading-none">
              Fotos que saben a
              <span className="block font-serif italic text-lunaria-solar">
                tarde tranquila.
              </span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-lunaria-coal/66">
            Café, madera natural, crema, postres y detalles de mesa con una luz
            que invita a quedarse.
          </p>
        </div>

        <div className="stagger-section mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.map((item) => (
            <figure
              key={item.title}
              className="gallery-item stagger-item relative overflow-hidden rounded-[2rem] bg-white shadow-warm"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="h-72 w-full object-cover sm:h-80 lg:h-72"
              />
              <figcaption className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-lunaria-coffee/36 via-lunaria-coffee/6 to-transparent p-5">
                <span className="rounded-full bg-lunaria-cream px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-lunaria-coffee">
                  {item.title}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocalSpotlight() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div className="reveal order-2 lg:order-1">
          <span className="section-kicker">El local</span>
          <h2 className="mt-4 text-[clamp(2.3rem,5vw,4.8rem)] font-black leading-none">
            Una pausa con
            <span className="block font-serif italic text-lunaria-solar">
              rostro real.
            </span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-lunaria-coal/68">
            Lunaria también se reconoce por su espacio: una cafetería cercana,
            luminosa y lista para recibir a quien llega buscando café, postre y
            un rato bonito en Piñas.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <MagneticButton
              href={whatsAppUrl("Hola, quiero reservar una mesa en Cafetería Lunaria.")}
              target="_blank"
              rel="noreferrer"
              className="bg-lunaria-solar text-white shadow-solar hover:bg-lunaria-coffee"
            >
              Reservar mesa
              <CalendarDays className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton
              href="https://maps.app.goo.gl/qc8ytMJjoBQXd6oW8"
              target="_blank"
              rel="noreferrer"
              className="border border-lunaria-coffee/12 bg-white text-lunaria-coal shadow-soft hover:bg-lunaria-cream"
            >
              Cómo llegar
              <MapPin className="h-4 w-4" />
            </MagneticButton>
          </div>
        </div>

        <figure className="reveal order-1 overflow-hidden rounded-[3rem] border border-lunaria-coffee/10 bg-white p-3 shadow-warm lg:order-2">
          <div className="relative overflow-hidden rounded-[2.4rem]">
            <img
              src={localImage}
              alt="Exterior de Cafetería Lunaria"
              loading="lazy"
              className="h-[360px] w-full object-cover sm:h-[520px]"
            />
            <figcaption className="pointer-events-none absolute inset-x-4 bottom-4 rounded-[1.5rem] bg-lunaria-warm/90 p-4 shadow-soft backdrop-blur-xl">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-lunaria-solar">
                Cafetería Lunaria
              </p>
              <p className="mt-1 text-xl font-black text-lunaria-coal">
                Piñas, El Oro
              </p>
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    {
      title: "Explora el menú",
      description: "Filtra por categoría, busca tu favorito y mira cada carta.",
      icon: Coffee,
    },
    {
      title: "Elige tu antojo",
      description: "Café, postre, brunch o una bebida fría para la tarde.",
      icon: ShoppingBag,
    },
    {
      title: "Pide o reserva por WhatsApp",
      description: "El mensaje sale listo para coordinar rápido con Lunaria.",
      icon: MessageCircle,
    },
  ];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="reveal mx-auto max-w-3xl text-center">
          <span className="section-kicker">Proceso simple</span>
          <h2 className="mt-4 text-[clamp(2.2rem,5vw,4.6rem)] font-black leading-none">
            De la vista al pedido
            <span className="block font-serif italic text-lunaria-solar">
              en tres pasos.
            </span>
          </h2>
        </div>

        <div className="stagger-section mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                className="stagger-item rounded-[2.5rem] border border-lunaria-coffee/10 bg-white p-6 shadow-warm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-5xl font-black text-lunaria-solar/32">
                    0{index + 1}
                  </span>
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-lunaria-cream text-lunaria-coffee">
                    <Icon className="h-6 w-6" />
                  </span>
                </div>
                <h3 className="mt-10 text-2xl font-black">{step.title}</h3>
                <p className="mt-3 leading-7 text-lunaria-coal/64">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FAQ({ activeFaq, setActiveFaq }) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="reveal lg:sticky lg:top-28">
          <span className="section-kicker">FAQ</span>
          <h2 className="mt-4 text-[clamp(2.3rem,5vw,4.6rem)] font-black leading-none">
            Preguntas con
            <span className="block font-serif italic text-lunaria-solar">
              respuesta clara.
            </span>
          </h2>
          <p className="mt-5 max-w-md leading-7 text-lunaria-coal/66">
            La experiencia está pensada para que todo termine en una decisión
            fácil: ver, elegir y escribir.
          </p>
        </div>

        <div className="stagger-section space-y-4">
          {faqs.map((faq, index) => {
            const open = activeFaq === index;
            return (
              <article
                key={faq.question}
                className="stagger-item overflow-hidden rounded-[2rem] border border-lunaria-coffee/10 bg-white shadow-soft"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(open ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-lg font-black text-lunaria-coal">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-lunaria-solar transition ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 leading-7 text-lunaria-coal/66">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const orderUrl = useOrderWhatsAppUrl();

  return (
    <section id="contacto" className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8">
      <div className="reveal texture-solar relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-lunaria-solar p-8 text-white shadow-solar sm:p-12 lg:p-16">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-lunaria-cream/30 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-lunaria-latte/40 blur-3xl" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white/80">
              WhatsApp directo
            </span>
            <h2 className="mt-5 text-[clamp(2.7rem,6vw,6rem)] font-black leading-[0.9]">
              Tu proxima pausa empieza en Lunaria.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/86">
              Explora el menú, elige tu favorito y escríbenos por WhatsApp.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <MagneticButton
              href={orderUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-white text-lunaria-coal hover:bg-lunaria-cream"
            >
              Hacer pedido
              <ShoppingBag className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton
              href={whatsAppUrl("Hola, quiero reservar una mesa en Cafetería Lunaria.")}
              target="_blank"
              rel="noreferrer"
              className="border border-white/35 bg-white/12 text-white backdrop-blur hover:bg-lunaria-coal"
            >
              Reservar mesa
              <CalendarDays className="h-4 w-4" />
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="rounded-t-[4rem] bg-lunaria-coal px-4 pb-8 pt-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-lunaria-solar">
                <Moon className="h-6 w-6 fill-white/20" />
              </span>
              <div>
                <h2 className="text-2xl font-black">Cafetería Lunaria</h2>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/50">
                  Piñas, El Oro
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-md text-lg leading-8 text-white/70">
              Café de especialidad, postres y momentos con luz propia.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-lunaria-cream">
              Navegacion
            </h3>
            <div className="mt-5 flex flex-col items-start gap-3">
              <button
                type="button"
                onClick={() => scrollToId("menu")}
                className="transition hover:-translate-y-0.5 hover:text-lunaria-cream"
              >
                Menú
              </button>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition hover:-translate-y-0.5 hover:text-lunaria-cream"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition hover:-translate-y-0.5 hover:text-lunaria-cream"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </a>
              <a
                href={whatsAppUrl("Hola, quiero información de Cafetería Lunaria.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition hover:-translate-y-0.5 hover:text-lunaria-cream"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-lunaria-cream">
              Visitanos
            </h3>
            <div className="mt-5 space-y-4 text-white/70">
              <p className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-lunaria-solar" />
                Piñas, El Oro
              </p>
              <p className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-lunaria-solar" />
                Pedidos y reservas por WhatsApp
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 font-mono text-xs uppercase tracking-[0.16em] text-white/46 sm:flex-row">
          <span>Sistema activo · Lunaria v1.0</span>
          <span>Café con luz propia</span>
        </div>
      </div>
    </footer>
  );
}

export default App;
