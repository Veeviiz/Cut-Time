# CutTime

CutTime เป็นเว็บแอปขนาดเล็กสำหรับบันทึกเวลาที่ใช้ในโปรเจกต์ต่าง ๆ (Time tracking)

รายละเอียดโปรเจกต์ (กรุณาแก้ไขตามความเป็นจริง):

- ชื่อโปรเจกต์: CutTime (เว็บแอปสำหรับบันทึกเวลาโปรเจกต์)

- เทคโนโลยีที่ใช้: React, Vite, JavaScript, CSS, Supabase

- หน้าที่และสิ่งที่ทำ:
  - ออกแบบและพัฒนา UI สำหรับเพิ่ม/แก้ไขโปรเจกต์และบันทึกเวลา
  - จัดการ state ด้วย Context (`src/context/ProjectContext.jsx`)
  - แสดงตารางโปรเจกต์และยอดเวลารวม (`src/components/project_table.jsx`, `src/components/total_time.jsx`)
  - เชื่อมต่อ Supabase สำหรับเก็บข้อมูล (ดู `src/service/supabaseClient.js`)

```bash
npm install
npm run dev
```

การสร้าง (Production):

```bash
npm run build
npm run preview
```

ดูโครงสร้างโค้ดในโฟลเดอร์ `src/` เพื่อแก้ไขและปรับแต่งคอมโพเนนต์ต่าง ๆ
