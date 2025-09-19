/**
 * Test utilities for the main project
 */

import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { NextRequest } from 'next/server'

// Custom render function that includes providers if needed
export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions
) {
  return render(ui, {
    // Add any providers here if needed
    ...options,
  })
}

// Mock Next.js API request
export function createMockRequest(
  url: string,
  init?: RequestInit & {
    nextUrl?: {
      searchParams?: URLSearchParams
    }
  }
): NextRequest {
  const request = new NextRequest(url, init)
  if (init?.nextUrl?.searchParams) {
    // Mock searchParams if provided
    Object.defineProperty(request, 'nextUrl', {
      value: {
        ...request.nextUrl,
        searchParams: init.nextUrl.searchParams,
      },
    })
  }
  return request
}

// Mock environment variables
export function mockEnvVars(vars: Record<string, string>) {
  const originalEnv = { ...process.env }
  Object.entries(vars).forEach(([key, value]) => {
    process.env[key] = value
  })
  return () => {
    process.env = originalEnv
  }
}

// Wait for promises to resolve
export function waitForPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

// Mock fetch response
export function mockFetchResponse<T>(data: T, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: jest.fn().mockResolvedValue(data),
    text: jest.fn().mockResolvedValue(JSON.stringify(data)),
    headers: new Headers(),
    redirected: false,
    type: 'basic' as ResponseType,
    url: 'https://api.test.com',
    clone: jest.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
  } as Response
}

// Console spy utilities
export function spyOnConsole() {
  const originalLog = console.log
  const originalError = console.error
  const originalWarn = console.warn
  
  const mockLog = jest.fn()
  const mockError = jest.fn()
  const mockWarn = jest.fn()
  
  console.log = mockLog
  console.error = mockError
  console.warn = mockWarn
  
  return {
    mockLog,
    mockError,
    mockWarn,
    restore() {
      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
    },
  }
}

// File system test utilities
export function mockFileOperations() {
  const fs = require('fs')
  const path = require('path')
  
  // Mock file system state
  const mockFiles: Record<string, string> = {}
  
  fs.readFileSync.mockImplementation((filePath: string) => {
    if (mockFiles[filePath]) {
      return mockFiles[filePath]
    }
    throw new Error(`ENOENT: no such file or directory, open '${filePath}'`)
  })
  
  fs.writeFileSync.mockImplementation((filePath: string, content: string) => {
    mockFiles[filePath] = content
  })
  
  fs.existsSync.mockImplementation((filePath: string) => {
    return !!mockFiles[filePath]
  })
  
  return {
    addFile: (filePath: string, content: string) => {
      mockFiles[filePath] = content
    },
    getFile: (filePath: string) => mockFiles[filePath],
    removeFile: (filePath: string) => {
      delete mockFiles[filePath]
    },
    reset: () => {
      Object.keys(mockFiles).forEach(key => delete mockFiles[key])
    },
  }
}

// Date mocking utilities
export function mockDate(date: string) {
  const mockDate = new Date(date)
  const originalDate = Date
  
  // Mock Date constructor
  const MockedDate = jest.fn(() => mockDate) as any
  MockedDate.now = jest.fn(() => mockDate.getTime())
  MockedDate.prototype = originalDate.prototype
  
  global.Date = MockedDate
  
  return () => {
    global.Date = originalDate
  }
}

// Async test utilities
export async function expectAsync<T>(
  promise: Promise<T>
): Promise<jest.JestMatchers<T>> {
  const result = await promise
  return expect(result)
}

// Error testing utilities
export async function expectAsyncError(
  promise: Promise<any>,
  expectedError?: string | RegExp
): Promise<void> {
  try {
    await promise
    throw new Error('Expected promise to reject, but it resolved')
  } catch (error) {
    if (expectedError) {
      if (typeof expectedError === 'string') {
        expect(error).toHaveProperty('message', expectedError)
      } else {
        expect(error.message).toMatch(expectedError)
      }
    }
    // If no expectedError specified, just expect any error
  }
}