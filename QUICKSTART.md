# 🚀 Quick Start Guide - GH-300 Practice App

## ⚡ Inicio Rápido (5 minutos)

### 1. Generar Datos de Prueba

```bash
python3 scripts/convert-md-to-json.py
```

**Salida esperada:**

```
Processing Test 1...
✓ Test 1 saved: 50 questions
Processing Test 2...
✓ Test 2 saved: 50 questions

✅ Conversion complete!
   Test 1: 7 domains
   Test 2: 7 domains
```

### 2. Instalar Dependencias

```bash
cd frontend
npm install
```

### 3. Iniciar Servidor

```bash
npm run dev
```

### 4. Abrir en el Navegador

```
http://localhost:5173
```

## 🎯 Flujo de Uso

1. **Dashboard** → Selecciona Test 1 o Test 2
2. **Modo** → Elige "Exam Mode" (cronometrado) o "Practice Mode" (sin tiempo)
3. **Start** → Haz clic en "Start Exam"
4. **Responde** → 50 preguntas, navega libremente
5. **Submit** → Revisa y envía
6. **Resultados** → Ve tu puntuación y áreas de mejora

## 📊 Lo Que Funciona

✅ **Dashboard**

- Selección de test
- Estadísticas personales
- Historial de intentos
- Selección de modo

✅ **Examen**

- 50 preguntas por test
- Timer de 100 minutos (modo exam)
- Navegación entre preguntas
- Marcar para revisión
- Auto-save del progreso

✅ **Resultados**

- Puntuación total (PASS ≥ 36/50)
- Desglose por dominio
- Revisión de respuestas
- Explicaciones detalladas

✅ **Configuración**

- Tema claro/oscuro
- Tamaño de fuente

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo

# Build
npm run build        # Compilar para producción
npm run preview      # Ver build de producción

# Calidad de Código
npm run lint         # Ejecutar linter
npm run format       # Formatear código
npm run type-check   # Verificar tipos

# Regenerar Datos
python3 scripts/convert-md-to-json.py
```

## 📁 Archivos Importantes

```
frontend/
├── src/
│   ├── pages/          # Páginas principales
│   ├── components/     # Componentes UI
│   ├── stores/         # State management (Zustand)
│   └── data/           # test1.json, test2.json
├── package.json
└── README.md          # Documentación completa

scripts/
└── convert-md-to-json.py   # Generador de datos
```

## 🎨 Personalización

### Cambiar Tema

1. Ir a Settings (⚙️)
2. Elegir Light/Dark/Auto

### Ajustar Fuente

1. Ir a Settings
2. Elegir Small/Medium/Large

## 💾 Datos Guardados

Todo se guarda automáticamente en el navegador (localStorage):

- ✅ Progreso del examen
- ✅ Historial de intentos
- ✅ Configuración personal

## ❓ Solución de Problemas

### Los datos no cargan

```bash
python3 scripts/convert-md-to-json.py
```

### Puerto en uso

Cambiar puerto en `vite.config.ts`:

```ts
server: {
  port: 3000; // Cambiar a otro puerto
}
```

### Errores de dependencias

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Recursos

- 📖 [README Completo](frontend/README.md)
- 📊 [Resumen de Implementación](IMPLEMENTATION_SUMMARY.md)
- 📋 [Requisitos del Proyecto](.github/prompts/requirement_app.prompt.md)

## ✨ Features Destacados

- 🎯 **50 preguntas** por test
- ⏱️ **Timer de 100 minutos** (modo exam)
- 📊 **7 dominios** cubiertos
- 💾 **Auto-save** del progreso
- 🌙 **Dark mode** completo
- 📱 **Responsive** design
- ⌨️ **Navegación** intuitiva

## 🎓 Dominios del Examen

1. Responsible AI
2. GitHub Copilot plans and features
3. GitHub Copilot Best Practices
4. GitHub Copilot for IDEs and CLI
5. GitHub Copilot Extensions and Agents
6. Code Security with GitHub Copilot
7. Productivity Enhancement

## 🏆 Puntuación

- **Total de preguntas**: 50
- **Puntuación mínima para pasar**: 36 (72%)
- **Tiempo límite**: 100 minutos

---

**¡Buena suerte con tu preparación para el GH-300! 🚀**

_La práctica hace al maestro. Usa esta app para dominar todos los dominios del examen._
