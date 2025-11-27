import { db } from '@/db';
import { departments } from '@/db/schema';

async function main() {
    const sampleDepartments = [
        {
            name: 'Mathematics',
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Physics',
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Chemistry',
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Microbiology',
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'History',
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'English',
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'ASM',
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'BBA',
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'BCOM',
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Computer Science',
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Economics',
            isActive: true,
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(departments).values(sampleDepartments);
    
    console.log('✅ Departments seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});