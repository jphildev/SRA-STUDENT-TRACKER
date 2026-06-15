export default function GuidePage() {
  const guides = [
    {
      number: 'Tip 01',
      title: 'How to Read SRA Booklets Effectively',
      content: `
        <ul>
          <li>Find a quiet, well-lit space free from distractions before starting</li>
          <li>Preview the passage first: read the title, look at any images, and skim headings</li>
          <li>Read the passage carefully at your own pace — don't rush through it</li>
          <li>Underline or mentally note key ideas, main characters, and important details</li>
          <li>After reading, summarize the main idea in your own words before answering</li>
          <li>Re-read sections you found confusing before moving to the questions</li>
        </ul>
      `,
    },
    {
      number: 'Tip 02',
      title: 'Answering SRA Power Builders',
      content: `
        <ul>
          <li>Read each question carefully and identify what type of question it is (factual, inferential, vocabulary)</li>
          <li>For factual questions, scan the passage for specific keywords or phrases</li>
          <li>For inference questions, think about what the passage implies rather than states directly</li>
          <li>Eliminate obviously wrong answers first to narrow your choices</li>
          <li>Don't spend too much time on one question — mark it and return later</li>
          <li>Double-check your answers by quickly referencing the passage</li>
        </ul>
      `,
    },
    {
      number: 'Tip 03',
      title: 'Improving Your Comprehension Level',
      content: `
        <ul>
          <li>Read widely outside of SRA — books, articles, and essays in your areas of interest</li>
          <li>Build your vocabulary: keep a word journal of new words you encounter</li>
          <li>Practice summarizing paragraphs and chapters after reading</li>
          <li>Discuss what you read with classmates to deepen understanding</li>
          <li>Focus on understanding context clues when encountering unfamiliar words</li>
          <li>Try reading slightly above your comfort level to challenge yourself</li>
        </ul>
      `,
    },
    {
      number: 'Tip 04',
      title: 'Increasing Your Accuracy',
      content: `
        <ul>
          <li>Review your mistakes after each Power Builder — understand why you got it wrong</li>
          <li>Identify patterns in your errors (vocabulary, inference, detail-oriented, etc.)</li>
          <li>Practice the question types you struggle with most</li>
          <li>Read the passage twice if time allows: once for overall understanding, once for details</li>
          <li>Take notes while reading to improve information retention</li>
          <li>Set a personal accuracy goal and track your improvement over time</li>
        </ul>
      `,
    },
    {
      number: 'Tip 05',
      title: 'Managing Your Reading Time',
      content: `
        <ul>
          <li>Set a realistic time limit for each Power Builder and practice with a timer</li>
          <li>Don't read too slowly or too fast — find a comfortable, steady pace</li>
          <li>Spend roughly 60% of your time reading and 40% answering questions</li>
          <li>If a passage is long, break it into sections and check understanding after each</li>
          <li>Practice speed reading techniques like reducing subvocalization</li>
          <li>Over time, you'll naturally read faster as your familiarity with text structures grows</li>
        </ul>
      `,
    },
    {
      number: 'Tip 06',
      title: 'Understanding Question Types',
      content: `
        <ul>
          <li><strong>Literal:</strong> The answer is stated directly in the passage — look for exact matches</li>
          <li><strong>Inferential:</strong> The answer is implied — think about what the author means, not just what they say</li>
          <li><strong>Vocabulary:</strong> Use surrounding context to figure out the meaning of unfamiliar words</li>
          <li><strong>Main Idea:</strong> Focus on what the entire passage is about, not just one detail</li>
          <li><strong>Sequence:</strong> Pay attention to the order of events or steps described</li>
          <li><strong>Cause & Effect:</strong> Identify why something happened and what resulted from it</li>
        </ul>
      `,
    },
    {
      number: 'Tip 07',
      title: 'Moving Up to Higher SRA Color Levels',
      content: `
        <ul>
          <li>Consistently score 90% or higher on your current level before requesting advancement</li>
          <li>Complete at least 3-5 Power Builders at your current level with high scores</li>
          <li>Don't skip levels — each color builds on the skills of the previous one</li>
          <li>If you struggle at a new level, it's okay to go back and strengthen your foundation</li>
          <li>Track your progress in the Progress Report section to visualize your improvement</li>
          <li>Set clear goals: identify your target level and a realistic timeframe to reach it</li>
        </ul>
      `,
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Study Guide</h1>
        <p>Tips and strategies to help you improve your SRA reading performance</p>
      </div>

      <div className="guide-grid">
        {guides.map((guide, i) => (
          <div
            key={guide.number}
            className="glass-card guide-card animate-slide-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="guide-card__number">{guide.number}</div>
            <div className="guide-card__title">{guide.title}</div>
            <div
              className="guide-card__content"
              dangerouslySetInnerHTML={{ __html: guide.content }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
