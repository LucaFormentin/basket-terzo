import CryptoJS from 'crypto-js'
import { ADMIN_EMAIL, ADMIN_PASSWORD_C, SECRET_KEY } from '../credentials'

export async function POST(req: Request) {
  const data = (await req.json()) as {
    email: string
    password: string
  }

  if (data.email !== ADMIN_EMAIL) {
    return Response.error()
  }

  const bytes = CryptoJS.AES.decrypt(ADMIN_PASSWORD_C, SECRET_KEY)
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8)

  if (data.password !== decryptedText) {
    return Response.error()
  }

  return Response.json({ data: 'Valid user' })
}
