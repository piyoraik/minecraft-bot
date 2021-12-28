import { NodeSSH } from 'node-ssh'

export const sshConnect = async () => {
  const ssh = new NodeSSH()

  await ssh
    .connect({})
    .then(() => {
      ssh.execCommand('')
    })
    .then(() => {
      ssh.dispose()
    })
    .catch((err) => {
      console.log(err)
    })
}
