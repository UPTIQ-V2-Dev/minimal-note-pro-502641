import { PrismaClient, Role } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin',
            password: adminPassword,
            role: Role.ADMIN,
            isEmailVerified: true
        }
    });

    console.log('✅ Created admin user:', admin.email);

    // Create sample notes for the admin user
    const note1 = await prisma.note.upsert({
        where: { id: 'sample-note-1' },
        update: {},
        create: {
            id: 'sample-note-1',
            title: 'Welcome Note',
            content: 'This is your first note! You can create, edit, and delete notes using the API.',
            userId: admin.id
        }
    });

    const note2 = await prisma.note.upsert({
        where: { id: 'sample-note-2' },
        update: {},
        create: {
            id: 'sample-note-2',
            title: 'Meeting Notes',
            content:
                'Discussed project roadmap:\n\n1. Complete user authentication\n2. Implement notes feature\n3. Add API documentation\n4. Deploy to production',
            userId: admin.id
        }
    });

    console.log('✅ Created sample notes:', note1.title, 'and', note2.title);
}

main()
    .catch(e => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
