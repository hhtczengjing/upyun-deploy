import * as core from '@actions/core'
import { getInputs } from './input-helper'
import { uploadArtifact } from './upyun-helper'

export async function run(): Promise<void> {
  // Parse inputs from workflow steps define
  const inputs = getInputs()
  if (inputs.length === 0) {
    core.error(`No artifacts will be uploaded.`)
    return
  }

  // Start to upload artifact
  const results = []
  for (const input of inputs) {
    core.info(
      `Start to upload artifact from ${input.srcPath} to ${input.destPath}`
    )
    try {
      const result = await uploadArtifact(input.srcPath, input.destPath)
      results.push({
        srcPath: input.srcPath,
        destPath: input.destPath,
        result: result
      })
    } catch (e) {
      results.push({
        srcPath: input.srcPath,
        destPath: input.destPath,
        result: false
      })
    }
  }

  // Set outputs for other workflow steps to use
  core.setOutput('result', JSON.stringify(results))
}
