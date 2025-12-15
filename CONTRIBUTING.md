# Guía de Contribución

¡Gracias por tu interés en contribuir al Conversor de Números Universal! Este documento te guiará en el proceso de contribución al proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno de Desarrollo](#configuración-del-entorno-de-desarrollo)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Guía de Estilo](#guía-de-estilo)
- [Proceso de Pull Request](#proceso-de-pull-request)

## Código de Conducta

Este proyecto se adhiere a un código de conducta que todos los contribuidores deben seguir:

- Ser respetuoso y constructivo en las discusiones
- Aceptar críticas constructivas con gracia
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros de la comunidad

## Cómo Contribuir

Hay muchas formas de contribuir a este proyecto:

1. **Reportar bugs**: Abre un issue describiendo el problema, los pasos para reproducirlo y el comportamiento esperado
2. **Sugerir mejoras**: Comparte tus ideas para nuevas funcionalidades o mejoras en las existentes
3. **Mejorar documentación**: Ayuda a mejorar el README, comentarios en el código o esta guía
4. **Enviar código**: Implementa nuevas características o corrige bugs existentes

## Configuración del Entorno de Desarrollo

### Requisitos Previos

- Node.js 20 o superior
- npm o yarn
- Git

### Pasos de Instalación

1. **Fork el repositorio** en GitHub

2. **Clona tu fork** localmente:
```bash
git clone https://github.com/TU_USUARIO/conversor.git
cd conversor
```

3. **Instala las dependencias**:
```bash
npm install
```

4. **Inicia el servidor de desarrollo**:
```bash
npm run dev
```

5. **Abre tu navegador** en [http://localhost:3000](http://localhost:3000)

## Estructura del Proyecto

```
conversor/
├── app/                    # App Router de Next.js
│   ├── page.tsx           # Página principal del conversor
│   ├── stats/             # Dashboard de analytics
│   │   └── page.tsx       # Página de estadísticas
│   ├── layout.tsx         # Layout principal
│   └── globals.css        # Estilos globales
├── lib/                   # Utilidades y librerías
│   └── analytics.ts       # Sistema de analytics
├── public/                # Assets estáticos
│   └── calculator.svg     # Favicon
├── .npmrc                 # Configuración de npm
└── package.json           # Dependencias del proyecto
```

## Guía de Estilo

### TypeScript

- Usa TypeScript para todos los archivos nuevos
- Define interfaces para estructuras de datos complejas
- Evita el uso de `any`, usa `unknown` si es necesario

### React

- Usa componentes funcionales con hooks
- Mantén los componentes pequeños y enfocados en una sola responsabilidad
- Usa `"use client"` cuando el componente requiera interactividad del cliente

### CSS/Tailwind

- Usa Tailwind CSS para estilos
- Mantén consistencia con el tema VSCode Dark:
  - Background principal: `#1e1e1e`
  - Background secundario: `#252526`
  - Bordes: `#3e3e42`
  - Texto principal: `#d4d4d4`
  - Acentos: `#4ec9b0`, `#007acc`, `#ce9178`, `#c586c0`

### Convenciones de Código

- Indentación: 2 espacios
- Comillas: Dobles para JSX, simples para TypeScript
- Nombres de variables: camelCase
- Nombres de componentes: PascalCase
- Nombres de archivos: kebab-case para utilidades, PascalCase para componentes

### Commits

Usa mensajes de commit descriptivos siguiendo este formato:

```
tipo: descripción breve

Descripción más detallada si es necesaria
```

Tipos de commit:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (sin afectar funcionalidad)
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `chore`: Tareas de mantenimiento

Ejemplo:
```
feat: agregar validación de entrada en hexadecimal

Implementa validación en tiempo real para caracteres
hexadecimales válidos (0-9, A-F) en el campo de entrada
```

## Proceso de Pull Request

1. **Crea una rama** para tu feature o fix:
```bash
git checkout -b feat/mi-nueva-funcionalidad
```

2. **Realiza tus cambios** siguiendo la guía de estilo

3. **Prueba tu código** localmente:
```bash
npm run dev    # Verifica que funciona en desarrollo
npm run build  # Asegúrate que compila correctamente
npm run lint   # Verifica que no hay errores de linting
```

4. **Commit tus cambios**:
```bash
git add .
git commit -m "feat: descripción de tu cambio"
```

5. **Push a tu fork**:
```bash
git push origin feat/mi-nueva-funcionalidad
```

6. **Abre un Pull Request** en GitHub:
   - Describe qué cambia tu PR y por qué
   - Incluye capturas de pantalla si hay cambios visuales
   - Referencia issues relacionados si aplica

7. **Responde a los comentarios** de revisión si los hay

8. **Espera la aprobación** antes de hacer merge

## Áreas de Contribución Sugeridas

Aquí hay algunas ideas de cómo puedes contribuir:

### Features
- Agregar más sistemas numéricos (octal, base64, etc.)
- Implementar historial con búsqueda y filtros
- Agregar soporte para operaciones matemáticas entre bases
- Crear modo de práctica/quiz para aprender conversiones

### Mejoras de UI/UX
- Añadir animaciones y transiciones suaves
- Mejorar la experiencia móvil
- Implementar atajos de teclado
- Agregar tema claro como opción

### Analytics
- Agregar más métricas útiles al dashboard
- Implementar filtros por fecha en /stats
- Crear gráficos adicionales de tendencias
- Optimizar la performance de las consultas

### Documentación
- Añadir ejemplos de uso
- Crear guía de conversión entre bases
- Traducir a otros idiomas
- Mejorar comentarios en el código

### Testing
- Agregar tests unitarios para conversiones
- Implementar tests de integración
- Agregar tests E2E con Playwright o Cypress

## Preguntas

Si tienes alguna pregunta, no dudes en:

- Abrir un issue en GitHub
- Contactar al mantenedor principal: Juan Cruz Larraya
  - [LinkedIn](https://www.linkedin.com/in/juancruzlarraya/)
  - [GitHub](https://github.com/juancruzmv)

---

¡Gracias por contribuir al Conversor de Números Universal! 🚀
