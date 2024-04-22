import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("jwtToken");
  console.log("Token:", token);

  // You should implement the isValidToken function to check if the token is valid
  if (!token || !isValidToken(token.value)) {
    return request.url.includes("login") || request.url.includes("register")
      ? null
      : NextResponse.redirect(new URL("/login", request.url));
  }

  if (request.url.includes("login") || request.url.includes("register")) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

function isValidToken(token: string): boolean {
  // Implement token validation logic here
  return true; // Stub: Replace with actual validation logic
}

export const config = {
  matcher: ["/", "/home", "/login", "/register"],
};
