import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role?: string;
    organizationId?: string | null;
    clinicianType?: string | null;
    mustChangePassword?: boolean;
    extendedSessionAcknowledged?: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      image?: string | null;
      role: string;
      organizationId: string | null;
      clinicianType: string | null;
      mustChangePassword: boolean;
      extendedSessionAcknowledged: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    organizationId: string | null;
    clinicianType: string | null;
    mustChangePassword: boolean;
    extendedSessionAcknowledged: boolean;
  }
}
