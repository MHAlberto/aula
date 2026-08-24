# Aula | Control de asistencia

PWA mobile-first, sin dependencias, para gestionar clases y asistencia completamente offline.

## Arquitectura

- `js/db.js`: capa mínima sobre IndexedDB. Los stores son `classes`, `students`, `periods`, `sessions`, `attendance`, `logs` y `settings`.
- `js/app.js`: estado de UI, vistas y acciones. Los registros relacionados usan IDs (`classId`, `studentId`, `sessionId`) para no duplicar datos.
- `js/export.js`: CSV UTF-8 con BOM, parser CSV sencillo y respaldo JSON.
- `sw.js`: cache-first para cargar la aplicación sin conexión.

## Uso local

Un service worker requiere HTTP(S), no `file://`. Por ejemplo:

```bash
npx serve .
```

Abra la URL en Safari y use **Compartir > Añadir a pantalla de inicio**. Los datos permanecen en IndexedDB del dispositivo y no se envían a ningún servidor.

La versión actual incluye clases, alumnos, periodos, sesiones manuales, asistencia rápida, notas, historial, estadísticas básicas, búsqueda, filtros, CSV y respaldo/restauración JSON. Las notificaciones programadas no se activan porque iOS limita las notificaciones web de fondo; el recordatorio fiable requiere abrir la PWA o usar un recordatorio nativo del sistema.
