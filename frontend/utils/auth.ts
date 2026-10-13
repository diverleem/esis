import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "esis_super_secret_jwt_key_2026_secured_smoker";
const key = new TextEncoder().encode(JWT_SECRET);

export type UserRole = "superadmin" | "admin" | "security";

export interface UserSessionPayload {
    id: string;
    username: string;
    role: UserRole;
    name?: string;
}

export async function signSession(payload: UserSessionPayload): Promise<string> {
    return await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(key);
}

export async function verifySession(token: string): Promise<UserSessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ["HS256"],
        });
        return payload as unknown as UserSessionPayload;
    } catch {
        return null;
    }
}
