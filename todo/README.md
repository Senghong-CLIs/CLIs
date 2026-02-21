# 📝 Todo CLI

A beautiful, fast, and lightweight command-line todo list manager built with Node.js. Features a rich terminal UI with colors, box-drawing characters, and intuitive commands for efficient task management.

## ✨ Features

- 🎨 **Beautiful Grid Table Display** - Box-drawing characters for clear visual separation
- 📅 **Smart Date Tracking** - Shows creation and completion timestamps with human-readable formats (Today, Yesterday, dates)
- 📏 **Full Text Display** - Long titles wrap across multiple lines without truncation
- ✅ **Add Todos** - Instantly add tasks with auto-display of updated list
- ✓ **Mark as Completed** - Strikethrough visual feedback with auto-display
- 📋 **Flexible Filtering** - View all, pending, or completed todos
- 🗑️ **Bulk Remove** - Delete single or multiple todos at once with auto-display
- 🧹 **Clear Completed** - Remove all finished tasks in one command with auto-display
- 💾 **Persistent Storage** - Data saved in `~/.todos.json`
- 🚀 **Fast & Lightweight** - Zero external dependencies, pure Node.js
- 🎨 **Color-Coded UI** - Intuitive colors for different states and actions
- 📊 **Statistics Display** - Track total, completed, and pending todos at a glance

## 🚀 Installation

Clone the repository and link it globally:

```bash
# Clone the repository (or navigate to the project directory)
cd /path/to/todo

# Install globally
npm link
```

This makes the `todo` command available globally from anywhere in your terminal.

## 📖 Usage

### ➕ Add a Todo

```bash
todo add "Buy groceries"
todo add "Write documentation"
todo add "Complete project report"
```

Adds a new todo and automatically displays the updated list.

### 📋 List Todos

```bash
todo list              # Show all todos (default)
todo list pending      # Show only pending/incomplete todos
todo list completed    # Show only completed todos
```

Display todos in a beautiful table with status indicators, timestamps, and statistics.

### ✅ Mark as Completed

```bash
todo done 1            # Mark todo with ID 1 as completed
```

Marks the todo as complete with a timestamp and displays the updated list.

### 🗑️ Remove Todos

```bash
todo remove 1              # Remove a single todo
todo remove 1 3 5          # Remove multiple todos at once
```

Delete one or more todos by ID and display the updated list.

### 🧹 Clear Completed

```bash
todo clear             # Remove all completed todos at once
```

Bulk delete all finished tasks and display the updated list.

### ❓ Help

```bash
todo help              # Show help message with all commands
todo --help            # Alternative help flag
todo -h                # Short help flag
```

## 💾 Storage

Todos are stored in `~/.todos.json` for persistence across sessions. Each todo contains:

- **`id`** - Unique identifier (auto-incrementing integer)
- **`title`** - Task description (supports long text with wrapping)
- **`completed`** - Boolean status (true/false)
- **`createdAt`** - ISO 8601 timestamp when the todo was created
- **`completedAt`** - ISO 8601 timestamp when marked done (null if pending)

Example storage format:
```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "completed": false,
    "createdAt": "2026-01-14T13:30:00.000Z",
    "completedAt": null
  }
]
```

## 🎯 Example Workflow

```bash
$ todo add "Learn Node.js"
  ✓ Added: Learn Node.js (ID: 1)

$ todo add "Build a complete CLI application"
  ✓ Added: Build a complete CLI application (ID: 2)

$ todo list
  📋  All Todos  (2)
  ┌────────┬─────────┬──────────────────────────────────────────────────────┬────────────────────┬────────────────────┐
  │ ID     │ ST      │ Title                                                │ Created At         │ Completed At       │
  ├────────┼─────────┼──────────────────────────────────────────────────────┼────────────────────┼────────────────────┤
  │ 1      │ ○       │ Learn Node.js                                        │ Today 07:30 PM     │ —                  │
  ├────────┼─────────┼──────────────────────────────────────────────────────┼────────────────────┼────────────────────┤
  │ 2      │ ○       │ Build a complete CLI application                     │ Today 07:30 PM     │ —                  │
  └────────┴─────────┴──────────────────────────────────────────────────────┴────────────────────┴────────────────────┘
  Total: 2 | Done: 0 | Pending: 2

$ todo done 1
  ✓ Completed: Learn Node.js

$ todo list pending
  ⚡ Pending Todos  (1)
  ┌────────┬─────────┬──────────────────────────────────────────────────────┬────────────────────┬────────────────────┐
  │ ID     │ ST      │ Title                                                │ Created At         │ Completed At       │
  ├────────┼─────────┼──────────────────────────────────────────────────────┼────────────────────┼────────────────────┤
  │ 2      │ ○       │ Build a complete CLI application                     │ Today 07:30 PM     │ —                  │
  └────────┴─────────┴──────────────────────────────────────────────────────┴────────────────────┴────────────────────┘
  Total: 2 | Done: 1 | Pending: 1

$ todo list completed
  ✨ Completed Todos  (1)
  ┌────────┬─────────┬──────────────────────────────────────────────────────┬────────────────────┬────────────────────┐
  │ ID     │ ST      │ Title                                                │ Created At         │ Completed At       │
  ├────────┼─────────┼──────────────────────────────────────────────────────┼────────────────────┼────────────────────┤
  │ 1      │ ✓       │ Learn Node.js                                        │ Today 07:30 PM     │ Today 07:30 PM     │
  └────────┴─────────┴──────────────────────────────────────────────────────┴────────────────────┴────────────────────┘
  Total: 2 | Done: 1 | Pending: 1

$ todo clear
  ✓ Cleared 1 completed todo(s)
```

## 🎨 Visual Features

- **Status Indicators**: ○ for pending, ✓ for completed
- **Color Coding**: 
  - Green for completed tasks
  - Yellow for pending tasks
  - Cyan for headers and borders
  - Gray for strikethrough completed titles
- **Smart Dates**: Shows "Today", "Yesterday", or formatted dates
- **Auto-refresh**: List updates automatically after add, complete, remove, or clear operations

## 🛠️ Technical Details

- **Language**: Pure Node.js (no transpilation needed)
- **Dependencies**: None (uses only Node.js built-in modules)
- **Storage**: JSON file in home directory (`~/.todos.json`)
- **UI**: ANSI color codes and box-drawing characters
- **Compatibility**: Works on macOS, Linux, and Windows (with proper terminal support)

## 📝 License

ISC

---

**Made with ❤️ using Node.js**

---

## 🇰🇭 README ភាសាខ្មែរ

### ពិពណ៌នា

Todo CLI គឺជាកម្មវិធីបញ្ជីការងារដែលដំណើរការតាម Command Line (CLI) ដែលមានល្បឿនលឿន ស្រួលប្រើ និងមាន UI ស្អាត។

### លក្ខណៈពិសេស

- បង្ហាញតារាងស្រស់ស្អាតដោយប្រើ Box-drawing characters
- កត់ត្រាថ្ងៃខែបង្កើត និងបញ្ចប់ការងារជា format ដែលងាយស្រួលអាន
- អាចបញ្ចូលការងារបានយ៉ាងឆាប់រហ័ស
- សម្គាល់ការងារដែលបានបញ្ចប់ដោយ strikethrough
- អាចបង្ហាញការងារទាំងអស់ ការងារមិនទាន់បញ្ចប់ និងការងារដែលបានបញ្ចប់
- លុបការងារបានច្រើនក្នុងពេលតែមួយ
- លុបការងារដែលបានបញ្ចប់ទាំងអស់
- ទិន្នន័យរក្សាទុកក្នុង `~/.todos.json`
- មិនមាន dependencies ខាងក្រៅ (Node.js ប៉ុណ្ណោះ)

### ការដំឡើង

```bash
# Clone project
cd /path/to/todo
npm link
```

### ការប្រើប្រាស់

- បន្ថែមការងារ:
  ```bash
  todo add "ទិញអាហារ"
  todo add "សរសេរឯកសារ"
  ```
- បង្ហាញបញ្ជីការងារ:
  ```bash
  todo list
  todo list pending
  todo list completed
  ```
- សម្គាល់ការងារដែលបានបញ្ចប់:
  ```bash
  todo done 1
  ```
- លុបការងារ:
  ```bash
  todo remove 1
  todo remove 1 3 5
  ```
- លុបការងារដែលបានបញ្ចប់ទាំងអស់:
  ```bash
  todo clear
  ```

### អាជ្ញាប័ណ្ណ
ISC

**បង្កើតដោយ Node.js**
