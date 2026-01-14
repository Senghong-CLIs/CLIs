#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TODO_FILE = path.join(process.env.HOME, '.todos.json');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  strikethrough: '\x1b[9m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bgGreen: '\x1b[42m',
  bgBlue: '\x1b[44m',
};

function c(text, color) {
  if (Array.isArray(color)) {
    return color.reduce((acc, col) => colors[col] + acc, '') + text + colors.reset;
  }
  return colors[color] + text + colors.reset;
}

function loadTodos() {
  try {
    if (fs.existsSync(TODO_FILE)) {
      return JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading todos:', err.message);
  }
  return [];
}

function saveTodos(todos) {
  try {
    fs.writeFileSync(TODO_FILE, JSON.stringify(todos, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving todos:', err.message);
  }
}

function addTodo(title) {
  const todos = loadTodos();
  const id = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
  todos.push({ id, title, completed: false, createdAt: new Date().toISOString(), completedAt: null });
  saveTodos(todos);
  console.log(`\n  ${c('✓', 'green')} ${c('Added:', 'bold')} ${title} ${c(`(ID: ${id})`, 'gray')}\n`);
  
  // Auto-display updated list
  listTodos('all');
}

function listTodos(filter = 'all') {
  const todos = loadTodos();
  let filtered = todos;

  if (filter === 'completed') filtered = todos.filter(t => t.completed);
  else if (filter === 'pending') filtered = todos.filter(t => !t.completed);

  if (filtered.length === 0) {
    console.log(`\n  ${c('ℹ', 'blue')}  ${c('No todos found.', 'dim')}\n`);
    return;
  }

  console.log();
  const headerMap = {
    'all': '📋  All Todos',
    'pending': '⚡ Pending Todos',
    'completed': '✨ Completed Todos'
  };
  
  console.log(`  ${c(headerMap[filter], ['bold', 'cyan'])}  ${c(`(${filtered.length})`, 'gray')}`);
  
  // Table layout with grid lines
  const colWidths = { id: 4, status: 3, title: 50, created: 16, completed: 16 };
  const padding = 1;

  // Top border
  const topBorder = `  ${c('┌' + '─'.repeat(colWidths.id + 2) + '┬' + '─'.repeat(colWidths.status + 2) + '┬' + '─'.repeat(colWidths.title + 2) + '┬' + '─'.repeat(colWidths.created + 2) + '┬' + '─'.repeat(colWidths.completed + 2) + '┐', 'cyan')}`;
  console.log(topBorder);
  
  // Header row
  const headers = ['ID', 'ST', 'Title', 'Created At', 'Completed At'];
  const headerCells = [
    headers[0].padEnd(colWidths.id),
    headers[1].padEnd(colWidths.status),
    headers[2].padEnd(colWidths.title),
    headers[3].padEnd(colWidths.created),
    headers[4].padEnd(colWidths.completed)
  ];
  const headerPipe = c('│', 'cyan');
  const pad = ' '.repeat(padding);
  console.log(`  ${headerPipe}${pad}${c(headerCells[0], ['bold', 'cyan'])}${pad}${headerPipe}${pad}${c(headerCells[1], ['bold', 'cyan'])}${pad}${headerPipe}${pad}${c(headerCells[2], ['bold', 'cyan'])}${pad}${headerPipe}${pad}${c(headerCells[3], ['bold', 'cyan'])}${pad}${headerPipe}${pad}${c(headerCells[4], ['bold', 'cyan'])}${pad}${headerPipe}`);
  
  // Header separator
  const headerSeparator = `  ${c('├' + '─'.repeat(colWidths.id + 2) + '┼' + '─'.repeat(colWidths.status + 2) + '┼' + '─'.repeat(colWidths.title + 2) + '┼' + '─'.repeat(colWidths.created + 2) + '┼' + '─'.repeat(colWidths.completed + 2) + '┤', 'cyan')}`;
  console.log(headerSeparator);

  // Data rows
  filtered.forEach((todo, index) => {
    const status = todo.completed ? c('✓', 'green') : c('○', 'yellow');
    const idStr = String(todo.id).padEnd(colWidths.id);
    const pipe = c('│', 'cyan');
    
    // Create status string with proper spacing (status symbol + spaces to fill column)
    const statusStr = status + ' '.repeat(colWidths.status - 1);
    
    let titleDisplay = todo.title;
    if (todo.title.length > colWidths.title) {
      // Display full text, let it wrap
      const titleLines = [];
      for (let i = 0; i < todo.title.length; i += colWidths.title) {
        titleLines.push(todo.title.substring(i, i + colWidths.title));
      }
      
      // First line with data
      let firstLine = titleLines[0].padEnd(colWidths.title);
      if (todo.completed) {
        firstLine = c(firstLine, ['strikethrough', 'gray']);
      }
      
      const createdDate = formatDateShort(todo.createdAt);
      const createdStr = createdDate.padEnd(colWidths.created);
      
      const completedDate = todo.completed ? formatDateShort(todo.completedAt) : '—';
      const completedStr = completedDate.padEnd(colWidths.completed);
      
      console.log(`  ${pipe}${pad}${idStr}${pad}${pipe}${pad}${statusStr}${pad}${pipe}${pad}${firstLine}${pad}${pipe}${pad}${createdStr}${pad}${pipe}${pad}${completedStr}${pad}${pipe}`);
      
      // Additional lines for wrapped title
      for (let i = 1; i < titleLines.length; i++) {
        let line = titleLines[i].padEnd(colWidths.title);
        if (todo.completed) {
          line = c(line, ['strikethrough', 'gray']);
        }
        console.log(`  ${pipe}${pad}${' '.repeat(colWidths.id)}${pad}${pipe}${pad}${' '.repeat(colWidths.status)}${pad}${pipe}${pad}${line}${pad}${pipe}${pad}${' '.repeat(colWidths.created)}${pad}${pipe}${pad}${' '.repeat(colWidths.completed)}${pad}${pipe}`);
      }
    } else {
      titleDisplay = todo.title.padEnd(colWidths.title);
      if (todo.completed) {
        titleDisplay = c(titleDisplay, ['strikethrough', 'gray']);
      }
      
      const createdDate = formatDateShort(todo.createdAt);
      const createdStr = createdDate.padEnd(colWidths.created);
      
      const completedDate = todo.completed ? formatDateShort(todo.completedAt) : '—';
      const completedStr = completedDate.padEnd(colWidths.completed);
      
      console.log(`  ${pipe}${pad}${idStr}${pad}${pipe}${pad}${statusStr}${pad}${pipe}${pad}${titleDisplay}${pad}${pipe}${pad}${createdStr}${pad}${pipe}${pad}${completedStr}${pad}${pipe}`);
    }
    
    // Row separator (except after last row)
    if (index < filtered.length - 1) {
      console.log(`  ${c('├' + '─'.repeat(colWidths.id + 2) + '┼' + '─'.repeat(colWidths.status + 2) + '┼' + '─'.repeat(colWidths.title + 2) + '┼' + '─'.repeat(colWidths.created + 2) + '┼' + '─'.repeat(colWidths.completed + 2) + '┤', 'cyan')}`);
    }
  });
  
  // Bottom border
  console.log(`  ${c('└' + '─'.repeat(colWidths.id + 2) + '┴' + '─'.repeat(colWidths.status + 2) + '┴' + '─'.repeat(colWidths.title + 2) + '┴' + '─'.repeat(colWidths.created + 2) + '┴' + '─'.repeat(colWidths.completed + 2) + '┘', 'cyan')}`);
  
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length
  };
  
  const statsText = `Total: ${stats.total} | ${c('Done:', 'green')} ${stats.completed} | ${c('Pending:', 'yellow')} ${stats.pending}`;
  console.log(`  ${c(statsText, 'gray')}`);
  console.log();
}

function formatDateShort(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return `Today ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (isYesterday) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

function completeTodo(id) {
  const todos = loadTodos();
  const todo = todos.find(t => t.id === parseInt(id));
  
  if (!todo) {
    console.log(`\n  ${c('✗', 'red')} ${c(`Error: Todo with ID ${id} not found.`, 'red')}\n`);
    return;
  }

  todo.completed = true;
  todo.completedAt = new Date().toISOString();
  saveTodos(todos);
  console.log(`\n  ${c('✓', 'green')} ${c('Completed:', 'bold')} ${todo.title}\n`);
  
  // Auto-display updated list
  listTodos('all');
}

function removeTodo(ids) {
  const todos = loadTodos();
  const idArray = Array.isArray(ids) ? ids : [ids];
  const removed = [];
  const notFound = [];

  idArray.forEach(id => {
    const index = todos.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
      removed.push(todos.splice(index, 1)[0]);
    } else {
      notFound.push(id);
    }
  });

  if (removed.length > 0) {
    saveTodos(todos);
    console.log(`\n  ${c('✓', 'yellow')} ${c(`Removed ${removed.length} todo(s):`, 'bold')}`);
    removed.forEach(todo => {
      console.log(`    ${c('•', 'yellow')} ${todo.title}`);
    });
  }

  if (notFound.length > 0) {
    console.log(`\n  ${c('⚠', 'yellow')}  ${c(`Not found: ${notFound.join(', ')}`, 'gray')}`);
  }
  
  if (removed.length > 0 || notFound.length > 0) {
    console.log();
  }
  
  // Auto-display updated list
  if (removed.length > 0) {
    listTodos('all');
  }
}

function clearCompleted() {
  const todos = loadTodos();
  const before = todos.length;
  const filtered = todos.filter(t => !t.completed);
  saveTodos(filtered);
  const cleared = before - filtered.length;
  console.log(`\n  ${c('✓', 'yellow')} ${c(`Cleared ${cleared} completed todo(s)`, 'bold')}\n`);
  
  // Auto-display updated list
  if (cleared > 0) {
    listTodos('all');
  }
}

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === 'help' || command === '-h' || command === '--help') {
  console.log(`
${c('╔════════════════════════════════════════════════╗', 'cyan')}
${c('║', 'cyan')}  ${c('📝  Todo CLI - Task Manager', ['bold', 'cyan'])}              ${c('║', 'cyan')}
${c('╚════════════════════════════════════════════════╝', 'cyan')}

${c('Usage:', 'bold')}
  ${c('todo add <title>', 'yellow')}               Add a new todo
  ${c('todo list [filter]', 'yellow')}            List todos (all, pending, completed)
  ${c('todo done <id>', 'yellow')}                Mark todo as completed
  ${c('todo remove <id...>', 'yellow')}           Remove one or more todos
  ${c('todo clear', 'yellow')}                    Clear all completed todos
  ${c('todo help', 'yellow')}                     Show this help message

${c('Examples:', 'bold')}
  ${c('todo add "Buy groceries"', 'gray')}
  ${c('todo list pending', 'gray')}
  ${c('todo done 1', 'gray')}
  ${c('todo remove 2', 'gray')}
  ${c('todo remove 1 3 5', 'gray')}
  ${c('todo clear', 'gray')}

${c('Tips:', 'bold')}
  • Use ${c('todo list', 'cyan')} to see all your tasks
  • Use ${c('todo list pending', 'cyan')} to focus on what's left
  • Use ${c('todo list completed', 'cyan')} to see your accomplishments
`);
  process.exit(0);
}

switch (command) {
  case 'add':
    if (!args[1]) {
      console.log(`\n  ${c('✗', 'red')} ${c('Error: Please provide a title.', 'red')}\n`);
      process.exit(1);
    }
    addTodo(args.slice(1).join(' '));
    break;
  case 'list':
    listTodos(args[1] || 'all');
    break;
  case 'done':
    if (!args[1]) {
      console.log(`\n  ${c('✗', 'red')} ${c('Error: Please provide a todo ID.', 'red')}\n`);
      process.exit(1);
    }
    completeTodo(args[1]);
    break;
  case 'remove':
    if (!args[1]) {
      console.log(`\n  ${c('✗', 'red')} ${c('Error: Please provide todo ID(s).', 'red')}\n`);
      process.exit(1);
    }
    removeTodo(args.slice(1));
    break;
  case 'clear':
    clearCompleted();
    break;
  default:
    console.log(`\n  ${c('✗', 'red')} ${c(`Unknown command: ${command}`, 'red')}\n`);
    console.log(`  ${c(`Use 'todo help' for usage.`, 'gray')}\n`);
    process.exit(1);
}
