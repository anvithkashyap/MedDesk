import { AppDataSource } from '../config/database.config';
import { seedDatabase } from './seeds/initial-seed';

async function runSeeds() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Initialize the data source
    await AppDataSource.initialize();
    console.log('📦 Database connection established');

    // Run the seed
    await seedDatabase(AppDataSource);

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    // Close the connection
    await AppDataSource.destroy();
    console.log('🔌 Database connection closed');
  }
}

runSeeds();
