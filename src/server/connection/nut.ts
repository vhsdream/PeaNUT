import PromiseSocket from '../utils/promise-socket'

export class Nut {
  private socket: PromiseSocket

  private host: string

  private port: number

  private username: string

  private password: string

  constructor(host: string, port: number, username?: string, password?: string) {
    this.host = host
    this.port = port
    this.username = username || ''
    this.password = password || ''
    this.socket = new PromiseSocket()
  }

  private async getCommand(command: string, until?: string) {
    await this.socket.write(command)
    const data = await this.socket.readAll(command, until)
    return data
  }

  public async connect() {
    await this.socket.connect(this.port, this.host)

    if (this.username) {
      const res = await this.getCommand(`USERNAME ${this.username}`, '\n')
      if (res !== 'OK\n') {
        throw new Error('Invalid username')
      }
    }

    if (this.password) {
      const res = await this.getCommand(`PASSWORD ${this.password}`, '\n')
      if (res !== 'OK\n') {
        throw new Error('Invalid password')
      }
    }
  }

  public async close() {
    await this.socket.write('LOGOUT')
    await this.socket.close()
  }

  public async getDevices() {
    const command = 'LIST UPS'
    let data = await this.getCommand(command)
    data = data.replace(`BEGIN ${command}`, '')
    data = data.replace(`END ${command}\n`, '')
    data = data.replace(/"/g, '')
    const devices = data.trim().split('\n')
    return devices.map((device) => device.split(' ')[1])
  }

  public async getData(device = 'UPS', delimiter = '.') {
    const command = `LIST VAR ${device}`
    let data = await this.getCommand(command)
    data = data.replace(`BEGIN ${command}`, '')
    data = data.replace(`END ${command}\n`, '')
    const regex = new RegExp(`VAR ${device} `, 'g')
    data = data.replace(regex, '')
    data = data.replace(/"/g, '')
    const props = data.trim().split('\n')
    const values: any = {}
    props.forEach((prop) => {
      const key = prop.substring(0, prop.indexOf(' ')).replace(/\./g, delimiter)
      const value = prop.substring(prop.indexOf(' ') + 1)
      values[key] = value
    })
    return values
  }
}
