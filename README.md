# ⏰ TimeSlots Picker Component

A simple, scrollable time-slot selection component built in React with TypeScript and Tailwind CSS.

## 🚀 Features

* Fetches and displays available time slots from a JSON API.
* Scrollable horizontal date picker with day labels.
* Click-to-select available time slots.
* Book button (logs selection & resets state).
* Fully tested with Vitest & React Testing Library.

---

## 📦 Tech Stack

* React + TypeScript
* Tailwind CSS
* Vitest(similar assertion as jest) + React Testing Library
* date-fns (for date formatting)
* Lucide React Icons

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/harshay-narayan/timeslot-q2.git
cd timeslot-q2
```

### 2. Install Dependencies

```bash
npm install

### 3. Run the Development Server

```bash
npm run dev

---

## 💪 Running Tests

```bash
npm run test

Tests are written using **Vitest** and **React Testing Library**. They cover:

* Date and time selection behavior
* Error handling for failed fetch
* Button enable/disable state
* Booking state reset

---

## 🧩 File Structure

```
src/
├── components/
│   └── TimeSlots.tsx        # Main component
│   └── TimeSlots.test.tsx   # Unit tests
├── lib/
│   └── dateUtils.ts         # Date formatter utility
│   └── setupTests.ts        # test setup file
│   └── utils.ts             # Common helpers
├── types/
│   └── types.ts             # TimeSlot type definition
│   
```

---

## ✨ Sample Slot Data Format (`/public/slots.json`)

```json
[
  {
    "displayDate": "2024/08/02",
    "displayTime": "07:30AM",
    "displayTimeEnd": "08:00AM",
    "startTimeUtc": 1722564000,
    "endTimeUtc": 1722565800
  }
]
```

---

## 👥 Contribution Guidelines

1. **Fork** the repo.
2. **Create a branch**:

   ```bash
   git checkout -b feature/YourFeature
   ```
3. **Make changes**, and **write/update tests** if needed.
4. **Commit** your changes:

   ```bash
   git commit -m "Add: your feature description"
   ```
5. **Push** to your fork and **open a pull request**.

✅ Follow conventional commits (`Add`, `Fix`, `Refactor`, etc.)
✅ Keep changes small and focused
✅ Add tests for new features or bug fixes

---

## 📄 License

MIT — Feel free to use and modify.
