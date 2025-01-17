import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('id');

        if (userId) {
            const pengguna = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (pengguna) {
                return new Response(JSON.stringify(pengguna), {
                    status: 200,
                    headers: corsHeaders,
                });
            } else {
                return new Response(JSON.stringify({ error: 'User Not Found' }), {
                    status: 404,
                    headers: corsHeaders,
                });
            }
        } else {
            const pengguna = await prisma.user.findMany();

            return new Response(JSON.stringify(pengguna), {
                status: 200,
                headers: corsHeaders,
            });
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: corsHeaders,
        });
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        const pengguna = await prisma.user.create({
            data: {
                nama: data.nama,
                role_id: "1",
                email: data.email,
                password: data.password,
            },
        });

        return new Response(JSON.stringify(pengguna), {
            status: 200,
            headers: corsHeaders,
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: corsHeaders,
        });
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(request) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('id');

        if (!userId) {
            return new Response(JSON.stringify({ error: 'Missing id parameter' }), {
                status: 400,
                headers: corsHeaders,
            });
        }

        const deletedUser = await prisma.user.delete({
            where: { id: userId },
        });

        return new Response(JSON.stringify(deletedUser), {
            status: 200,
            headers: corsHeaders,
        });
    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            return new Response(JSON.stringify({ error: 'User Not Found' }), {
                status: 404,
                headers: corsHeaders,
            });
        }
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: corsHeaders,
        });
    } finally {
        await prisma.$disconnect();
    }
}