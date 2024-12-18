export interface Category {
  id: string;
  name: string;
  description: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'personal-development',
    name: 'Personal Development',
    description: 'Goals focused on individual growth and self-improvement',
    subcategories: [
      {
        id: 'education',
        name: 'Education',
        description: 'Academic and learning goals'
      },
      {
        id: 'skills',
        name: 'Skills Development',
        description: 'Acquiring or improving specific abilities'
      },
      {
        id: 'habits',
        name: 'Habits & Routines',
        description: 'Developing positive habits and daily routines'
      },
      {
        id: 'mindfulness',
        name: 'Mindfulness & Mental Health',
        description: 'Emotional well-being and mental clarity'
      }
    ]
  },
  {
    id: 'career',
    name: 'Career & Professional',
    description: 'Work-related and professional advancement goals',
    subcategories: [
      {
        id: 'advancement',
        name: 'Career Advancement',
        description: 'Promotions and professional growth'
      },
      {
        id: 'business',
        name: 'Business Development',
        description: 'Entrepreneurship and business goals'
      },
      {
        id: 'networking',
        name: 'Professional Networking',
        description: 'Building professional relationships'
      },
      {
        id: 'certifications',
        name: 'Certifications',
        description: 'Professional certifications and qualifications'
      }
    ]
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    description: 'Physical health and wellness objectives',
    subcategories: [
      {
        id: 'exercise',
        name: 'Exercise & Training',
        description: 'Physical fitness and workout goals'
      },
      {
        id: 'nutrition',
        name: 'Nutrition',
        description: 'Diet and healthy eating habits'
      },
      {
        id: 'wellness',
        name: 'Wellness',
        description: 'Overall health and well-being'
      },
      {
        id: 'sports',
        name: 'Sports',
        description: 'Sports-related achievements'
      }
    ]
  },
  {
    id: 'financial',
    name: 'Financial',
    description: 'Money management and financial goals',
    subcategories: [
      {
        id: 'savings',
        name: 'Savings',
        description: 'Building savings and emergency funds'
      },
      {
        id: 'investment',
        name: 'Investment',
        description: 'Investment and portfolio management'
      },
      {
        id: 'debt',
        name: 'Debt Management',
        description: 'Reducing and managing debt'
      },
      {
        id: 'budgeting',
        name: 'Budgeting',
        description: 'Creating and maintaining budgets'
      }
    ]
  },
  {
    id: 'relationships',
    name: 'Relationships',
    description: 'Goals related to personal and professional relationships',
    subcategories: [
      {
        id: 'family',
        name: 'Family',
        description: 'Family relationships and dynamics'
      },
      {
        id: 'social',
        name: 'Social Connections',
        description: 'Friendships and social networks'
      },
      {
        id: 'romantic',
        name: 'Romantic Relationships',
        description: 'Dating and romantic partnerships'
      },
      {
        id: 'community',
        name: 'Community Involvement',
        description: 'Community engagement and volunteering'
      }
    ]
  },
  {
    id: 'creativity',
    name: 'Creativity & Hobbies',
    description: 'Creative pursuits and recreational activities',
    subcategories: [
      {
        id: 'arts',
        name: 'Arts & Crafts',
        description: 'Artistic and creative projects'
      },
      {
        id: 'music',
        name: 'Music',
        description: 'Musical instruments and performance'
      },
      {
        id: 'writing',
        name: 'Writing',
        description: 'Writing and literary projects'
      },
      {
        id: 'hobbies',
        name: 'Recreational Hobbies',
        description: 'Personal interests and pastimes'
      }
    ]
  },
  {
    id: 'productivity',
    name: 'Productivity & Organization',
    description: 'Time management and organizational goals',
    subcategories: [
      {
        id: 'time-management',
        name: 'Time Management',
        description: 'Improving time usage and efficiency'
      },
      {
        id: 'organization',
        name: 'Organization',
        description: 'Organizing spaces and systems'
      },
      {
        id: 'workflow',
        name: 'Workflow Optimization',
        description: 'Improving processes and procedures'
      },
      {
        id: 'digital',
        name: 'Digital Organization',
        description: 'Managing digital assets and information'
      }
    ]
  },
  {
    id: 'travel',
    name: 'Travel & Adventure',
    description: 'Travel and exploration objectives',
    subcategories: [
      {
        id: 'destinations',
        name: 'Destinations',
        description: 'Visiting specific locations'
      },
      {
        id: 'experiences',
        name: 'Experiences',
        description: 'Unique travel experiences and activities'
      },
      {
        id: 'culture',
        name: 'Cultural Exploration',
        description: 'Learning about different cultures'
      },
      {
        id: 'adventure',
        name: 'Adventure Activities',
        description: 'Outdoor and adventure pursuits'
      }
    ]
  },
  {
    id: 'sustainability',
    name: 'Sustainability & Environment',
    description: 'Environmental and sustainable living goals',
    subcategories: [
      {
        id: 'eco-friendly',
        name: 'Eco-Friendly Living',
        description: 'Sustainable lifestyle changes'
      },
      {
        id: 'conservation',
        name: 'Conservation',
        description: 'Environmental conservation efforts'
      },
      {
        id: 'zero-waste',
        name: 'Zero Waste',
        description: 'Reducing waste and consumption'
      },
      {
        id: 'green-energy',
        name: 'Green Energy',
        description: 'Renewable energy and efficiency'
      }
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'Technology-related objectives',
    subcategories: [
      {
        id: 'programming',
        name: 'Programming',
        description: 'Software development and coding'
      },
      {
        id: 'digital-skills',
        name: 'Digital Skills',
        description: 'General technology competencies'
      },
      {
        id: 'cybersecurity',
        name: 'Cybersecurity',
        description: 'Digital security and privacy'
      },
      {
        id: 'innovation',
        name: 'Innovation Projects',
        description: 'Tech innovation and projects'
      }
    ]
  }
];

export const getCategory = (categoryId: string): Category | undefined => {
  return categories.find(category => category.id === categoryId);
};

export const getSubcategory = (categoryId: string, subcategoryId: string): Subcategory | undefined => {
  const category = getCategory(categoryId);
  return category?.subcategories.find(subcategory => subcategory.id === subcategoryId);
};