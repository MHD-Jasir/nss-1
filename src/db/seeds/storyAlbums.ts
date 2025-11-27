import { db } from '@/db';
import { storyAlbums } from '@/db/schema';

async function main() {
    const sampleStoryAlbums = [
        {
            batchId: 1,
            name: 'Orientation Program',
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(storyAlbums).values(sampleStoryAlbums);
    
    console.log('✅ Story albums seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});