export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatPercentage(score: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((score / total) * 100)}%`;
}

export function getScorePercentage(score: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

export function getGradeLabel(percentage: number): string {
  if (percentage >= 90) return 'Outstanding';
  if (percentage >= 80) return 'Very Good';
  if (percentage >= 70) return 'Good';
  if (percentage >= 60) return 'Satisfactory';
  return 'Needs Improvement';
}

export function getGradeColor(percentage: number): string {
  if (percentage >= 90) return 'var(--color-success)';
  if (percentage >= 80) return 'var(--color-info)';
  if (percentage >= 70) return 'var(--color-primary)';
  if (percentage >= 60) return 'var(--color-warning)';
  return 'var(--color-danger)';
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
