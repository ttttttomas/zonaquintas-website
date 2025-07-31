import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const cookies = request.cookies
    const token = cookies.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()

}
export const config = {
  matcher : ['/favorites/:path*','/reservations/:path*', '/publications/:path*']
}