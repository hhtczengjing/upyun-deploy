import * as upyun from 'upyun'
import * as utils from './utils'
import path from 'path'
import * as core from '@actions/core'

export async function uploadArtifact(
  srcPath: string,
  destPath: string,
  opts = {}
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const serviceName = process.env.UPYUN_SERVICE_NAME
    const operatorName = process.env.UPYUN_OPERATOR
    const password = process.env.UPYUN_PASSWORD
    if (!serviceName) {
      core.error(`error: UPYUN_SERVICE_NAME is empty`)
      resolve(false)
      return
    }

    if (!srcPath || !destPath) {
      core.error(`error: srcPath/destPath is empty`)
      resolve(false)
      return
    }

    const remotePath = `${destPath}/${path.parse(srcPath).base}`
    const filePath = srcPath
    core.info(`remotePath: ${remotePath}, filePath: ${filePath}`)

    if (!utils.isFile(srcPath)) {
      core.error(`srcPath: ${srcPath} is not file`)
      resolve(false)
      return
    }

    const service = new upyun.Service(serviceName, operatorName, password)
    const client = new upyun.Client(service)
    client
      .initMultipartUpload(remotePath, filePath)
      .then(result => {
        if (!result) {
          resolve(false)
          return
        }

        const { fileSize, partCount, uuid } = result
        core.debug(
          `fileSize: ${fileSize}, partCount: ${partCount}, uuid: ${uuid}`
        )
        const promises = Array.apply(null, { length: partCount } as any).map(
          (_, partId) => {
            return client.multipartUpload(remotePath, filePath, uuid, partId)
          }
        )
        Promise.all(promises)
          .then(() => {
            core.info(`completeMultipartUpload: ${uuid} ${remotePath}`)
            const result = client.completeMultipartUpload(remotePath, uuid)
            resolve(result)
          })
          .catch(error => {
            core.error(`multipartUpload error: ${JSON.stringify(error)}`)
            reject(error)
          })
      })
      .catch(error => {
        core.error(`initMultipartUpload error: ${JSON.stringify(error)}`)
        reject(error)
      })
  })
}
