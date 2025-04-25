const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export const RepairRecordController = {
    list: async () => {
        try {
            const repairRecords = await prisma.repairRecord.findMany({
                include: {
                    device: true,
                    user: true
                },
                orderBy: {
                    id: "desc"
                }
            });

            // ตรวจสอบค่าของ engineerId ถ้ามีให้หา username ของ engineer มาเพิ่มใน list 
            let list = [];

            for (const repairRecord of repairRecords) {
                if (repairRecord.engineerId) {
                    const engineer = await prisma.user.findUnique({
                        select: {
                            id: true,
                            username: true,
                            level: true
                        },
                        where: {
                            id: repairRecord.engineerId
                        }
                    });

                    list.push({...repairRecord, engineer});
                } else {
                    list.push(repairRecord);
                }
            }

            return list;
        } catch (error) {
            return error;
        }
    },

    create: async ({ body, request, jwt }: {
        body: {
            customerName: string;
            customerPhone: string;
            deviceId?: number;
            deviceName: string;
            deviceBarcode: string;
            deviceSerial?: string;
            problem: string;
            solving?: string;
            expireDate?: Date;
        },
        request: any,
        jwt: any
    }) => {
        try {
            const row = await prisma.repairRecord.create({
                data: body
            });

            return { message: "success", row: row}
        } catch (error) {
            return error;
        }
    },

    update: async ({ body, params }: {
        body: {
            customerName: string;
            customerPhone: string;
            deviceId?: number;
            deviceName: string;
            deviceBarcode: string;
            deviceSerial?: string;
            problem: string;
            solving?: string;
            expireDate?: Date;
        },
        params: {id: string}
    }) => {
        try {
            await prisma.repairRecord.update({
                where: {
                    id: parseInt(params.id)
                },
                data: body
            });

            return { message: "success" }
        } catch (error) {
            return error;
        }
    },
    remove: async ({ params }: {
        params: {
            id: string;
        }
    }) => {
        try {
            await prisma.repairRecord.update({
                where: { id: parseInt(params.id) },
                data: { status: "inactive" }
            })

            return { message: "success"};
        } catch (error) {
            return error;
        }
    },

    updateStatus: async ({ body, params }: {
        body: {
            status: string;
            solving: string;
            engineerId: number;
            endJobDate?: Date;
        },
        params: {
            id: string;
        }
    }) => {
        try {
            await prisma.repairRecord.update({
                where: { id: parseInt(params.id) },
                data: body
            })

            return { message: "success"};
        } catch (error) {
            return error;
        }
    },

    receive: async ({ body }: {
        body: {
            amount: number;
            id: number;
        }
    }) => {
        try {
            await prisma.repairRecord.update({
                where: { id: body.id },
                data: { 
                    amount: body.amount,
                    payDate: new Date(),
                    status: "complete"
                }
            })

            return { message: "success"};
        } catch (error) {
            return error;
        }
    },
    
    // List All Income Report
    listReport: async () => {
        try {
            const repairRecords = await prisma.repairRecord.findMany({
                where: {
                    status: "complete"
                },
                orderBy: {
                    payDate: "asc"
                }
            });

            return repairRecords;
        } catch (error) {
            return error;
        }
    },
    
    // Selected Income Report in period
    selectedReport: async ({ params }: {
        params: {
            startDate: string;
            endDate: string;
        }
    }) => {
        try {
            const startDate = new Date(params.startDate);
            const endDate = new Date(params.endDate);

            startDate.setHours(0, 0, 0, 0);    // เวลา 00:00:00:000
            endDate.setHours(23, 59, 59, 999); // เวลา 23:59:59:999

            const repairRecords = await prisma.repairRecord.findMany({
                where: {
                    payDate: {
                        gte: startDate,
                        lte: endDate
                    },
                    status: "complete"
                },
                orderBy: {
                    payDate: "asc"
                }
            });

            return repairRecords;
        } catch (error) {
            return error;
        }
    }
}