import type { Request, Response } from 'express';
export declare const createShow: (req: Request, res: Response) => Promise<void>;
export declare const getAllShows: (req: Request, res: Response) => Promise<void>;
export declare const getShowById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateShow: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteShow: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=showController.d.ts.map