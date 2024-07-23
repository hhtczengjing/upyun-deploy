import fs from 'fs'

export function readFile(path: string, encoding = 'utf8') {
  return fs.readFileSync(path)
}

export function exists(path: string) {
  return fs.existsSync(path)
}

export function isDirectory(path: string) {
  return fs.existsSync(path) && fs.statSync(path).isDirectory()
}

export function isFile(path: string) {
  const fileStates = fs.lstatSync(path)
  return fileStates.isFile()
}
