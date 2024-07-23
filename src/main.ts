import * as core from '@actions/core'
import { getInputs } from './input-helper'
import { uploadArtifact } from './upyun-helper'

export async function run(): Promise<void> {
  const inputs = getInputs()
  if (inputs.length === 0) {
    core.info(`No artifacts will be uploaded.`)
    return
  }

  for (const input of inputs) {
    core.debug(`Start to update artifact ${input.srcPath} -> ${input.destPath}`)
    await uploadArtifact(input.srcPath, input.destPath)
  }
}
