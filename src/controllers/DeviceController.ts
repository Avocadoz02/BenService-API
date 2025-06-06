const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export const DeviceController = {
    create: async ({ body }: {
        body: {
            name: string;
            barcode: string;
            serial: string;
            expireDate: Date;
            remark: string;
        }
    }) => {
        try {
            await prisma.device.create({
                data: body
            })

            return { message: 'success'};
        } catch (error) {
            return error;
        }
    },

    // สำหรับ ดึง ข้อมูล
    list: async ()  => {
        try {
            const devices = await prisma.device.findMany({
                where: {
                    status: 'active'
                },
                orderBy: {
                    id: 'desc'
                }
            });

            return devices;
        } catch (error) {
            return error;
        }
    },
    listDevicesPage: async ({ query }: { 
        query: {
            page: string;
            pageSize: string;
        }
})  => {
        try {
            const page = parseInt(query.page);
            const pageSize = parseInt(query.pageSize);
            const totalRecord = await prisma.device.count({
                where: {
                    status: 'active'
                }
            });
            const totalPage = Math.ceil(totalRecord / pageSize);
            const devices = await prisma.device.findMany({
                where: {
                    status: 'active'
                },
                orderBy: {
                    id: 'desc'
                },
                skip: (page - 1) * pageSize,
                take: pageSize
            });

            return { results: devices, totalPage: totalPage };
        } catch (error) {
            return error;
        }
    },

    // สำหรับ อัพเดต ข้อมูล
    update: async ({ body, params }: {
        body: {
            name: string;
            barcode: string;
            serial: string;
            expireDate: Date;
            remark: string;
        },
        params: {
            id: string;
        }
    }) => {
        try {
            await prisma.device.update({
                where: { id: parseInt(params.id) },
                data: body
            })

            return { message: 'success'}
        } catch (error) {
            return error;
        }
    },
    // สำหรับ ลบ ข้อมูล
    remove: async ({ params }: {
        params: {
            id: string;
        }
    }) => {
        try {
            await prisma.device.update({
                where: { id: parseInt(params.id)},
                data: { status: 'inactive'}
            })

            return { message: 'success'};
        } catch (error) {
            return error;
        }
    }
}