import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed SRA Color Levels
  const sraLevels = [
    { code: '1A-ROSE', name: 'Rose', hexColor: '#FF007F', order: 1, gradeLevel: '1.2', lexileRange: '190-240' },
    { code: '1A-RED', name: 'Red', hexColor: '#FF0000', order: 2, gradeLevel: '1.4', lexileRange: '240-290' },
    { code: '1A-ORANGE', name: 'Orange', hexColor: '#FF8C00', order: 3, gradeLevel: '1.6', lexileRange: '290-340' },
    { code: '1A-GOLD', name: 'Gold', hexColor: '#FFD700', order: 4, gradeLevel: '1.8', lexileRange: '340-390' },
    { code: '1B-BROWN', name: 'Brown', hexColor: '#8B4513', order: 5, gradeLevel: '2.0', lexileRange: '390-440' },
    { code: '1B-TAN', name: 'Tan', hexColor: '#D2B48C', order: 6, gradeLevel: '2.2', lexileRange: '440-490' },
    { code: '1B-LIME', name: 'Lime', hexColor: '#32CD32', order: 7, gradeLevel: '2.4', lexileRange: '490-540' },
    { code: '1B-GREEN', name: 'Green', hexColor: '#228B22', order: 8, gradeLevel: '2.6', lexileRange: '540-590' },
    { code: '1C-OLIVE', name: 'Olive', hexColor: '#808000', order: 9, gradeLevel: '2.8', lexileRange: '590-640' },
    { code: '1C-AQUA', name: 'Aqua', hexColor: '#00CED1', order: 10, gradeLevel: '3.0', lexileRange: '640-690' },
    { code: '1C-BLUE', name: 'Blue', hexColor: '#4169E1', order: 11, gradeLevel: '3.5', lexileRange: '690-740' },
    { code: '2A-PURPLE', name: 'Purple', hexColor: '#800080', order: 12, gradeLevel: '4.0', lexileRange: '740-790' },
    { code: '2A-VIOLET', name: 'Violet', hexColor: '#8A2BE2', order: 13, gradeLevel: '4.5', lexileRange: '790-840' },
    { code: '2A-ROSE', name: 'Rose', hexColor: '#DB7093', order: 14, gradeLevel: '5.0', lexileRange: '840-890' },
    { code: '2A-RED', name: 'Red', hexColor: '#DC143C', order: 15, gradeLevel: '5.5', lexileRange: '890-940' },
    { code: '2B-ORANGE', name: 'Orange', hexColor: '#FF6347', order: 16, gradeLevel: '6.0', lexileRange: '940-1020' },
    { code: '2B-GOLD', name: 'Gold', hexColor: '#DAA520', order: 17, gradeLevel: '7.0', lexileRange: '1020-1100' },
    { code: '2B-BROWN', name: 'Brown', hexColor: '#A0522D', order: 18, gradeLevel: '8.0', lexileRange: '1100-1150' },
    { code: '3A-TAN', name: 'Tan', hexColor: '#C4A882', order: 19, gradeLevel: '9.0', lexileRange: null },
    { code: '3A-LIME', name: 'Lime', hexColor: '#7CFC00', order: 20, gradeLevel: '10.0', lexileRange: null },
    { code: '3B-GREEN', name: 'Green', hexColor: '#006400', order: 21, gradeLevel: '11.0', lexileRange: null },
    { code: '3B-PURPLE', name: 'Purple', hexColor: '#4B0082', order: 22, gradeLevel: '12.0', lexileRange: null },
  ];

  for (const level of sraLevels) {
    await prisma.sRAColorLevel.upsert({
      where: { code: level.code },
      update: level,
      create: level,
    });
  }

  console.log(`Seeded ${sraLevels.length} SRA color levels`);

  // Seed Grading Rubric
  const gradingLevels = [
    {
      levelName: 'Outstanding',
      minScore: 90,
      maxScore: 100,
      description: 'Mastery demonstrated across all comprehension areas',
      interpretation: 'Student is ready to advance to the next SRA color level. Comprehension, vocabulary, and critical thinking skills are exceptional.',
      order: 1,
    },
    {
      levelName: 'Very Good',
      minScore: 80,
      maxScore: 89,
      description: 'Strong comprehension with minor areas for improvement',
      interpretation: 'Student shows strong reading skills and is approaching mastery. A few more practice sessions at this level will solidify understanding.',
      order: 2,
    },
    {
      levelName: 'Good',
      minScore: 70,
      maxScore: 79,
      description: 'Solid understanding with some gaps in comprehension',
      interpretation: 'Student demonstrates adequate comprehension. Continue practicing at the current level to strengthen weak areas before advancing.',
      order: 3,
    },
    {
      levelName: 'Satisfactory',
      minScore: 60,
      maxScore: 69,
      description: 'Adequate performance with notable areas needing practice',
      interpretation: 'Student meets minimum expectations but needs focused practice. Consider reviewing difficult passages and vocabulary at this level.',
      order: 4,
    },
    {
      levelName: 'Needs Improvement',
      minScore: 0,
      maxScore: 59,
      description: 'Significant gaps in reading comprehension',
      interpretation: 'Student should revisit materials at the current or previous level. Focus on building foundational vocabulary and reading strategies.',
      order: 5,
    },
  ];

  for (const rubric of gradingLevels) {
    await prisma.gradingRubric.upsert({
      where: { levelName: rubric.levelName },
      update: rubric,
      create: rubric,
    });
  }

  console.log(`Seeded ${gradingLevels.length} grading rubric levels`);
  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
