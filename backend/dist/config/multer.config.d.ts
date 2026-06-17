export declare const multerConfig: {
    storage: import("multer").StorageEngine;
    fileFilter: (req: any, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => void;
    limits: {
        fileSize: number;
    };
};
export declare const getUploadDir: () => string;
