# Conversor de Números Universal

Conversor entre sistemas numéricos: Binario, Decimal y Hexadecimal.

![Preview de la app](utils/page.png)

## 🔗 Link de Producción

- **App Principal**: [https://conversor-juan.vercel.app](https://conversor-juan.vercel.app)
- **Dashboard de Analytics**: [https://conversor-juan.vercel.app/stats](https://conversor-juan.vercel.app/stats)

## Características

- **Conversión Bidireccional**: Convierte entre binario, decimal y hexadecimal en tiempo real con validación automática
- **Click-to-Copy**: Copia cualquier valor del historial con un simple click y feedback visual
- **Exportación Avanzada**: Exporta tu historial de conversiones a Excel (.xlsx) o CSV
- **Persistencia Inteligente**: Sistema de sesión invisible con localStorage - tus datos se mantienen sin necesidad de login
- **Analytics Completo**: Dashboard en `/stats` con métricas de uso, ubicación, dispositivos y navegadores
- **Tema VSCode Dark**: Interfaz profesional con tipografía monoespaciada Consolas/Monaco y colores del tema oscuro de VSCode

## Uso

1. Escribe un número en cualquiera de los tres campos
2. La conversión se realiza automáticamente en los otros dos campos
3. Usa el botón "Limpiar Todo" para reiniciar

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Deploy en Vercel

Este proyecto está optimizado para desplegarse en Vercel:

1. Sube el código a un repositorio de GitHub
2. Importa el proyecto en Vercel
3. Vercel detectará automáticamente Next.js y configurará el deploy

O usa el CLI de Vercel:

```bash
npm i -g vercel
vercel
```

## Tecnologías

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Vercel

## Validación

- **Binario**: Solo acepta 0 y 1
- **Decimal**: Solo acepta números 0-9
- **Hexadecimal**: Acepta 0-9 y A-F (case-insensitive)
