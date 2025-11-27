import { db } from '@/db';
import { coordinators } from '@/db/schema';

async function main() {
    const sampleCoordinators = [
        {
            customId: 'COORD1001',
            name: 'Dr. Sarah Johnson',
            department: 'NSS Coordinator',
            password: 'coord123',
            isActive: true,
            createdAt: new Date().toISOString(),
        },
        {
            customId: 'COORD1002',
            name: 'Prof. Michael Chen',
            department: 'Environmental Science',
            password: 'coord123',
            isActive: true,
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(coordinators).values(sampleCoordinators);
    
    console.log('✅ Coordinators seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});