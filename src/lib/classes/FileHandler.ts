import fs from 'fs'
import util from 'util'

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const access = util.promisify(fs.access)
const deleteFile = util.promisify(fs.unlink)

/**
 * Represents a file handler class to manage CRUD operations.
 */
export class File {
  private filePath: string

  /**
   * Creates a new instance of the File class.
   * @param filePath - The path of the file.
   */
  constructor(filePath: string) {
    this.filePath = filePath
  }

  async fileExists(): Promise<boolean> {
    try {
      await access(this.filePath, fs.constants.F_OK)
      return true
    } catch (error) {
      return false
    }
  }

  async create(data: unknown) {
    const jsonData = JSON.stringify(data)
    await writeFile(this.filePath, jsonData, 'utf8')
  }

  async read() {
    const data = await readFile(this.filePath, 'utf8')
    return JSON.parse(data)
  }

  async update(data: object) {
    await this.create(data)
  }

  async delete() {
    await deleteFile(this.filePath)
  }
}
