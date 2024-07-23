import * as core from '@actions/core'
import { Inputs } from './constants'

export interface UploadInputs {
  srcPath: string
  destPath: string
}

export function getInputs(): UploadInputs[] {
  const path = core.getInput(Inputs.Path, { required: true })
  const lines = path.split(/[\s\n]/)
  const inputs: UploadInputs[] = []
  for (const line of lines) {
    const items = line.split('->')
    if (items.length === 2) {
      const srcPath: string = items[0].trim()
      const destPath: string = items[1].trim()
      const input = { srcPath: srcPath, destPath: destPath } as UploadInputs
      inputs.push(input)
    }
  }
  return inputs
}
