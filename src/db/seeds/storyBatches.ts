import { db } from '@/db';
import { storyBatches } from '@/db/schema';

async function main() {
    const sampleBatches = [
        {
            name: '2024-25 Batch',
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(storyBatches).values(sampleBatches);
    
    console.log('✅ Story batches seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});