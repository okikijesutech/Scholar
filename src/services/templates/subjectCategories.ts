export type SubjectCategory = 
  | 'mathematics' 
  | 'science' 
  | 'language' 
  | 'religious' 
  | 'commercial' 
  | 'civic_social' 
  | 'vocational';

export function categorizeSubject(subject: string): SubjectCategory {
  const s = subject.toLowerCase();
  if (s.includes('home economics')) return 'vocational';
  if (s.includes('math') || s.includes('arithmetic') || s.includes('further')) return 'mathematics';
  if (s.includes('science') || s.includes('biology') || s.includes('chemistry') || s.includes('physics') || s.includes('agricultural') || s.includes('phe') || s.includes('health')) return 'science';
  if (s.includes('english') || s.includes('literature') || s.includes('yoruba') || s.includes('igbo') || s.includes('hausa') || s.includes('french')) return 'language';
  if (s.includes('christian') || s.includes('crs') || s.includes('islamic') || s.includes('irs') || s.includes('religious')) return 'religious';
  if (s.includes('economics') || s.includes('commerce') || s.includes('business') || s.includes('accounting') || s.includes('bookkeeping')) return 'commercial';
  if (s.includes('civic') || s.includes('social') || s.includes('government') || s.includes('history') || s.includes('geography')) return 'civic_social';
  return 'vocational';
}
