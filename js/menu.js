/* Carta de Pizzas D'Barrio.
 * price: número en soles. null = "Consultar" (precio por confirmar en la carta).
 * sizes: para pizzas, precios por tamaño.
 */
const BUSINESS = {
  name: "Pizzas D'Barrio",
  whatsapp: "51923433817",
  phoneDisplay: "923 433 817",
  yapeName: "Miriam Solis P.",
};

const CATEGORIES = [
  { id: "pizzas", name: "Pizzas", icon: "pizza", note: "Todas incluyen café" },
  { id: "hamburguesas", name: "Hamburguesas", icon: "burger", note: "Todas con papas y ensalada" },
  { id: "salchipapas", name: "Salchipapas", icon: "fries", note: "Con ensalada" },
  { id: "broaster", name: "Pollo Broaster", icon: "chicken", note: "Con papas y ensalada" },
  { id: "alitas", name: "Alitas", icon: "wings", note: "4 alitas + papas + ensalada" },
  { id: "bebidas", name: "Bebidas", icon: "drink", note: "Para acompañar" },
  { id: "extras", name: "Extras", icon: "extra", note: "Agrégale más sabor" },
];

const SIZES = ["Personal", "Mediana", "Familiar"];

const PRODUCTS = [
  // ---------- PIZZAS CLÁSICAS ----------
  { id: "pz-americana", cat: "pizzas", tag: "Clásica", name: "Americana", desc: "Jamón inglés · queso", sizes: [6.0, 12.0, 20.0] },
  { id: "pz-hawaiana", cat: "pizzas", tag: "Clásica", name: "Hawaiana", desc: "Jamón inglés · queso · piña", sizes: [7.0, 14.5, 23.0] },
  { id: "pz-pepperoni", cat: "pizzas", tag: "Clásica", name: "Pepperoni", desc: "Jamón inglés · queso · pepperoni", sizes: [9.5, 17.0, 29.0] },
  { id: "pz-brasilena", cat: "pizzas", tag: "Clásica", name: "Brasileña", desc: "Jamón inglés · queso · tocino", sizes: [10.5, 17.5, 30.0] },
  // ---------- PIZZAS ESPECIALES (+ salami) ----------
  { id: "pz-americana-esp", cat: "pizzas", tag: "Especial + salami", name: "Americana Especial", desc: "Jamón inglés · queso · salami", sizes: [7.5, 14.0, 22.0] },
  { id: "pz-hawaiana-esp", cat: "pizzas", tag: "Especial + salami", name: "Hawaiana Especial", desc: "Jamón inglés · queso · piña · salami", sizes: [9.0, 17.0, 26.0] },
  { id: "pz-pepperoni-esp", cat: "pizzas", tag: "Especial + salami", name: "Pepperoni Especial", desc: "Jamón inglés · queso · pepperoni · salami", sizes: [10.5, 18.5, 32.0] },
  { id: "pz-brasilena-esp", cat: "pizzas", tag: "Especial + salami", name: "Brasileña Especial", desc: "Jamón inglés · queso · tocino · salami", sizes: [11.0, 19.0, 32.0] },

  // ---------- HAMBURGUESAS ----------
  { id: "hb-clasica", cat: "hamburguesas", name: "Clásica", desc: "Carne", price: 5.0 },
  { id: "hb-huevo", cat: "hamburguesas", name: "Huevo", desc: "Huevo", price: 5.0 },
  { id: "hb-pollo", cat: "hamburguesas", name: "Pollo", desc: "Pollo", price: 6.0 },
  { id: "hb-salchicha", cat: "hamburguesas", name: "Salchicha", desc: "Salchicha", price: 6.0 },
  { id: "hb-doble", cat: "hamburguesas", name: "Doble", desc: "Carne · pollo", price: 7.0 },
  { id: "hb-mixta", cat: "hamburguesas", name: "Mixta", desc: "Carne · huevo", price: 7.0 },
  { id: "hb-desmenuzado", cat: "hamburguesas", name: "Desmenuzado", desc: "Pollo desmenuzado", price: 7.0 },
  { id: "hb-queso", cat: "hamburguesas", name: "H' Queso", desc: "Carne · queso", price: 7.0 },
  { id: "hb-tocino", cat: "hamburguesas", name: "Tocino", desc: "Carne · tocino", price: 7.0 },
  { id: "hb-salchihamburguesa", cat: "hamburguesas", name: "Salchihamburguesa", desc: "Salchicha · carne", price: 7.0 },
  { id: "hb-charapita", cat: "hamburguesas", name: "Charapita", desc: "Carne · plátano · salchicha", price: 7.0 },
  { id: "hb-especial", cat: "hamburguesas", name: "Especial", desc: "Carne · huevo · salchicha", price: 7.5 },
  { id: "hb-queso-mixta", cat: "hamburguesas", name: "H' Queso Mixta", desc: "Carne · queso · huevo", price: 8.0 },
  { id: "hb-salchi-mixta", cat: "hamburguesas", name: "Salchi Mixta", desc: "Salchipapa · carne · huevo", price: 8.0 },
  { id: "hb-royal", cat: "hamburguesas", name: "Royal", desc: "Carne · tocino · queso · huevo", price: 9.0 },
  { id: "hb-xxl", cat: "hamburguesas", name: "XXL", desc: "Carne · tocino · plátano · queso", price: 10.0 },
  { id: "hb-super-grueso", cat: "hamburguesas", name: "Súper Grueso", desc: "Carne · tocino · plátano · queso · salchicha · huevo. La más cargada de la carta.", price: 11.0, featured: true },

  // ---------- SALCHIPAPAS ----------
  { id: "sp-salchipapa", cat: "salchipapas", name: "Salchipapa", desc: "Salchichas · papas", price: 6.0 },
  { id: "sp-mixta", cat: "salchipapas", name: "Salchipapa Mixta", desc: "Salchichas · huevo · papas", price: 7.5 },
  { id: "sp-pobre", cat: "salchipapas", name: "Salchi a lo Pobre", desc: "Salchicha · huevo · plátano · papas", price: 8.5 },
  { id: "sp-salchipollo", cat: "salchipapas", name: "Salchipollo", desc: "Pollo desmenuzado · salchicha · papas", price: 8.5 },
  { id: "sp-salchipollo-mixto", cat: "salchipapas", name: "Salchipollo Mixto", desc: "Pollo desmenuzado · huevo · salchicha · papas", price: 9.5 },
  { id: "sp-salchipollo-pobre", cat: "salchipapas", name: "Salchipollo Pobre", desc: "Pollo desmenuzado · huevo · plátano · salchicha", price: 10.5 },

  // ---------- POLLO BROASTER ----------
  { id: "br-octavo", cat: "broaster", name: "1/8 Broaster", desc: "1/8 de pollo", price: 8.0 },
  { id: "br-cuarto", cat: "broaster", name: "1/4 Broaster", desc: "1/4 de pollo", price: null },
  { id: "br-chaufa", cat: "broaster", name: "Chaufa de Pollo", desc: "Arroz chaufa con pollo", price: 10.0 },
  { id: "br-mostrito", cat: "broaster", name: "Mostrito", desc: "1/8 broaster · chaufa", price: 12.0 },
  { id: "br-salchibroaster", cat: "broaster", name: "1/4 Salchibroaster", desc: "1/4 broaster · salchichas", price: 13.0 },
  { id: "br-extra", cat: "broaster", name: "Broaster Extra", desc: "1/4 broaster · arroz blanco", price: 13.0 },
  { id: "br-salchi-extra", cat: "broaster", name: "Salchibroaster Extra", desc: "1/4 broaster · salchicha · arroz blanco", price: 14.0 },
  { id: "br-mostro", cat: "broaster", name: "Mostro", desc: "1/4 broaster · chaufa", price: 15.0 },
  { id: "br-dbarrio", cat: "broaster", name: "D'Barrio Broaster", desc: "1/4 broaster · salchicha · huevo · arroz · papas · ensalada. El combo de la casa.", price: 16.0, featured: true },

  // ---------- ALITAS ----------
  { id: "al-broaster", cat: "alitas", name: "Alitas Broaster", desc: "Clásicas, crocantes", price: 12.5 },
  { id: "al-salchi", cat: "alitas", name: "Salchialitas", desc: "Con salchicha", price: 14.0 },
  { id: "al-acevichadas", cat: "alitas", name: "Alitas Acevichadas", desc: "En salsa acevichada", price: 14.0 },
  { id: "al-bbq", cat: "alitas", name: "Alitas BBQ", desc: "En salsa BBQ", price: 14.0 },
  { id: "al-chaufa", cat: "alitas", name: "Alitas con Chaufa", desc: "Con arroz chaufa", price: 15.0 },

  // ---------- BEBIDAS ----------
  { id: "bb-gaseosa-1l", cat: "bebidas", name: "Gaseosa Inka o Coca 1 L", desc: "Inca Kola o Coca-Cola", price: null },
  { id: "bb-gaseosa-personal", cat: "bebidas", name: "Inka / Coca Personal", desc: "Botella personal", price: null },
  { id: "bb-gordita", cat: "bebidas", name: "Inka Kola Gordita", desc: "Botella de vidrio", price: null },
  { id: "bb-agua", cat: "bebidas", name: "Agua Mineral", desc: "Botella personal", price: null },
  { id: "bb-mate", cat: "bebidas", name: "Mate Manzanilla / Anís", desc: "Infusión caliente", price: 2.0 },
  { id: "bb-te", cat: "bebidas", name: "Té", desc: "Infusión caliente", price: 2.0 },
  { id: "bb-cafe", cat: "bebidas", name: "Café Pasado", desc: "Café caliente", price: 2.5 },
  { id: "bb-milo", cat: "bebidas", name: "Milo", desc: "Bebida caliente", price: 2.5 },
  { id: "bb-chicha", cat: "bebidas", name: "Jarra de Chicha 1 L", desc: "Chicha morada", price: 10.0 },

  // ---------- EXTRAS ----------
  { id: "ex-huevo", cat: "extras", name: "Huevo", desc: "Extra", price: 1.5 },
  { id: "ex-carne", cat: "extras", name: "Carne", desc: "Extra", price: 2.0 },
  { id: "ex-pollo", cat: "extras", name: "Pollo", desc: "Extra", price: 2.5 },
  { id: "ex-tocino", cat: "extras", name: "Tocino", desc: "Extra", price: 2.0 },
  { id: "ex-queso", cat: "extras", name: "Queso", desc: "Extra", price: 2.0 },
  { id: "ex-platano", cat: "extras", name: "Plátano x6", desc: "Extra", price: 3.0 },
  { id: "ex-papas", cat: "extras", name: "Papas", desc: "Porción", price: 5.0 },
  { id: "ex-salchicha", cat: "extras", name: "Salchicha", desc: "Porción", price: 5.0 },
  { id: "ex-arroz", cat: "extras", name: "Arroz", desc: "Porción", price: 5.0 },
];
