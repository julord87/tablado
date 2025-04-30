# 🎟️ La Jacinta - Panel de Administración

Panel interno para gestionar reservas, ingresos, shows y cierre de caja del espacio boutique de flamenco **La Jacinta**.

---

## 🚀 Tecnologías principales

- Next.js 14
- Prisma ORM
- PostgreSQL (via Docker)
- TailwindCSS
- NextAuth.js (con autenticación por credenciales)
- Cron jobs vía Vercel Scheduled Functions

---

## 🛠️ Configuración local

### 1. Cloná el repo

```bash
git clone https://github.com/tuusuario/nombre-del-repo.git
cd nombre-del-repo
```

### 2. Configurá las variables de entorno

```bash
cp .env.template .env
```

Completá las variables necesarias (base de datos, auth, etc.)

### 3. Instalá las dependencias

```bash
npm install
```

### 4. Levantá la base de datos con Docker

```bash
docker compose up -d
```

### 5. Aplicá las migraciones con Prisma

```bash
npx prisma migrate dev
```

### 6. Ejecutá el script de seed (carga inicial)

```bash
npm run seed
```

### 7. Iniciá el proyecto en modo desarrollo

```bash
npm run dev
```

---

## ⚙️ Cierre automático de caja

La aplicación incluye un **cierre de caja automático** a las 23:59 hora de Madrid, usando los **cron jobs de Vercel**.

### Configuración en `vercel.json`:

```json
{
  "cron": [
    {
      "path": "/api/close-cash-day",
      "schedule": "59 21 * * *"
    }
  ]
}
```

⏰ Nota: el horario está en UTC. Actualizá el cron según el horario de verano/invierno de España.

---

## ✅ TODOs pendientes

- [ ] Panel de egresos
- [ ] Log de ejecuciones de cron (auditoría)
- [ ] Roles de usuarios (admin, staff)
- [ ] Dashboard general (ventas, reservas, etc.)
- [ ] Exportación a CSV / Excel

---

## 🧉 Autor

**Juliano Marchante**  
Músico y desarrollador uruguayo.  
En busca del equilibrio entre arte, código y una copa de vino andaluz.
