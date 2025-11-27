import { db } from '@/db';
import { officerCredentials } from '@/db/schema';

async function main() {
    const sampleOfficerCredential = [
        {
            officerId: 'OFFICER001',
            password: 'NSS@OFFICER2025',
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(officerCredentials).values(sampleOfficerCredential);
    
    console.log('✅ Officer credentials seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});