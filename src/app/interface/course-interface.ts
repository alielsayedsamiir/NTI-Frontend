export interface CourseInterface {
  _id: string;
  title: string;
  instructor: string;
  description?: string;
  price: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  imageUrl?: string;
}