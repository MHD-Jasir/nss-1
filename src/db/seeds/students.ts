import { db } from '@/db';
import { students } from '@/db/schema';

async function main() {
    const sampleStudents = [
        {
            customId: '101',
            name: 'John Doe',
            department: 'Computer Science',
            password: 'student123',
            profileImageUrl: null,
            createdAt: new Date().toISOString(),
        },
        {
            customId: '102',
            name: 'Jane Smith',
            department: 'Electronics',
            password: 'student123',
            profileImageUrl: null,
            createdAt: new Date().toISOString(),
        },
        {
            customId: '103',
            name: 'Mike Johnson',
            department: 'Mechanical',
            password: 'student123',
            profileImageUrl: null,
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(students).values(sampleStudents);
    
    console.log('✅ Students seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});