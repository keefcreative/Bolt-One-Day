// Content-improver specific Jest setup
const fs = require('fs')
const path = require('path')

// Mock environment variables for content-improver
process.env.NODE_ENV = 'test'
process.env.OPENAI_API_KEY = 'test-openai-key'

// Mock file system operations
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  readdirSync: jest.fn(),
}))

// Mock path operations
jest.mock('path', () => ({
  ...jest.requireActual('path'),
  join: jest.fn((...args) => args.join('/')),
  resolve: jest.fn((...args) => `/${args.join('/')}`),
  dirname: jest.fn((p) => p.split('/').slice(0, -1).join('/')),
  basename: jest.fn((p) => p.split('/').pop()),
}))

// Global test utilities
global.mockFileSystem = {
  files: {},
  reset() {
    this.files = {}
  },
  addFile(filePath, content) {
    this.files[filePath] = content
  },
  getFile(filePath) {
    return this.files[filePath]
  },
}

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
  global.mockFileSystem.reset()
  
  // Setup default fs mock behavior
  const fs = require('fs')
  fs.existsSync.mockImplementation((filePath) => {
    return global.mockFileSystem.files.hasOwnProperty(filePath)
  })
  
  fs.readFileSync.mockImplementation((filePath) => {
    if (global.mockFileSystem.files.hasOwnProperty(filePath)) {
      return global.mockFileSystem.files[filePath]
    }
    throw new Error(`ENOENT: no such file or directory, open '${filePath}'`)
  })
  
  fs.writeFileSync.mockImplementation((filePath, content) => {
    global.mockFileSystem.files[filePath] = content
  })
  
  fs.readdirSync.mockImplementation((dirPath) => {
    return Object.keys(global.mockFileSystem.files)
      .filter(path => path.startsWith(dirPath))
      .map(path => path.replace(dirPath + '/', '').split('/')[0])
      .filter((item, index, arr) => arr.indexOf(item) === index)
  })
})