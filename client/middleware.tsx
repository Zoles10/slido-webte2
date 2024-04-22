import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("jwtToken");

  // You should implement the isValidToken function to check if the token is valid
  if (!token || !isValidToken(token)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

function isValidToken(token: RequestCookie): boolean {
  // Implement token validation logic here
  return true; // Stub: Replace with actual validation logic
}
