# Pizzas D'Barrio — Página web

Sitio web de comida rápida (pizzas, hamburguesas, salchipapas, pollo broaster y alitas) con carrito de compras y pedidos por WhatsApp.

## Funciones
- Slider de promociones (combo D'Barrio Broaster, Súper Grueso, pizza familiar).
- Carta completa por categorías con barra fija y búsqueda.
- Pizzas con selector de tamaño (Personal / Mediana / Familiar).
- Carrito guardado en el navegador, con cantidades y total.
- Pedido por WhatsApp (923 433 817) con delivery o recojo, y pago con Yape o efectivo.
- Carta original descargable en PDF (`assets/carta-dbarrio.pdf`).

## Estructura
```
index.html        Página principal
css/styles.css    Estilos (colores de la marca: amarillo, rojo y negro)
js/menu.js        Carta: categorías, productos y precios  ← editar aquí
js/icons.js       Ilustraciones SVG de cada categoría
js/app.js         Slider, carta, carrito y envío por WhatsApp
assets/           Logo, imagen del banner y carta en PDF
```

## Editar precios
En `js/menu.js`, cambia `price` (o `sizes` en las pizzas). Los productos con `price: null` se muestran como **Consultar** (en la carta original figuran como `__.__`).

## Ver en local
Es un sitio estático, no necesita instalación:
```bash
python3 -m http.server 8000
```
y abre http://localhost:8000. Se puede publicar gratis en GitHub Pages, Netlify o Vercel.
