import type { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const bookAppointment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMyBookings: (req: AuthRequest, res: Response) => Promise<void>;
export declare const cancelBooking: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=bookingController.d.ts.map