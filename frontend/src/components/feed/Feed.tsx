'use client';

import React from 'react';
import FeedPost, { Post } from './FeedPost';

// Mock data for the feed
const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Johnson',
      title: 'Senior Software Engineer',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=0D8ABC&color=fff',
      company: 'TechCorp'
    },
    content: `🚀 Just launched a new feature that reduces load times by 60%! 

The key was implementing smart caching strategies and optimizing our database queries. It's amazing what proper indexing can do.

Always remember: premature optimization is the root of all evil, but informed optimization is the path to excellence! 

#WebDevelopment #Performance #TechLife`,
    timestamp: '2 hours ago',
    likes: 47,
    comments: 8,
    shares: 12,
    isLiked: false,
    isSaved: false
  },
  {
    id: '2',
    author: {
      name: 'Mike Chen',
      title: 'Product Manager',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=7C3AED&color=fff',
      company: 'StartupXYZ'
    },
    content: `Exciting news! 🎉 We've just hit 10,000 active users on our platform!

This milestone wouldn't have been possible without our amazing team and the incredible feedback from our community. 

Here's what we learned along the way:
• Listen to user feedback religiously
• Ship fast, but don't break things
• Data-driven decisions > gut feelings
• Team culture matters more than individual talent

Thank you to everyone who believed in our vision! 🙏

#Startup #ProductManagement #Milestone`,
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&h=300&fit=crop',
    timestamp: '4 hours ago',
    likes: 123,
    comments: 24,
    shares: 31,
    isLiked: true,
    isSaved: true
  },
  {
    id: '3',
    author: {
      name: 'Emma Rodriguez',
      title: 'UX Designer',
      avatar: 'https://ui-avatars.com/api/?name=Emma+Rodriguez&background=F59E0B&color=fff',
      company: 'DesignStudio'
    },
    content: `💡 Design tip of the day: White space is not wasted space!

I see so many products cramming information everywhere, thinking more content = more value. 

But here's the truth: White space improves:
✅ Readability
✅ Focus
✅ User comprehension
✅ Overall aesthetic appeal

Sometimes less really is more. Give your content room to breathe!

What's your favorite example of great use of white space?

#UXDesign #DesignTips #UserExperience`,
    timestamp: '6 hours ago',
    likes: 89,
    comments: 15,
    shares: 7,
    isLiked: false,
    isSaved: false
  },
  {
    id: '4',
    author: {
      name: 'David Park',
      title: 'DevOps Engineer',
      avatar: 'https://ui-avatars.com/api/?name=David+Park&background=10B981&color=fff',
      company: 'CloudTech'
    },
    content: `🔧 PSA: Your monitoring is only as good as your alerting strategy

Just prevented a major outage because our alerts caught a memory leak at 3 AM. The key is setting up meaningful alerts that don't cry wolf.

My golden rules:
1. Alert on symptoms, not causes
2. Make alerts actionable
3. Reduce noise with smart grouping
4. Always have escalation paths

Sleep is important, but so is system reliability! 😴

#DevOps #Monitoring #SRE`,
    timestamp: '1 day ago',
    likes: 34,
    comments: 6,
    shares: 9,
    isLiked: false,
    isSaved: true
  },
  {
    id: '5',
    author: {
      name: 'Lisa Wang',
      title: 'Data Scientist',
      avatar: 'https://ui-avatars.com/api/?name=Lisa+Wang&background=EC4899&color=fff',
      company: 'DataInsights'
    },
    content: `📊 Just finished analyzing our user behavior data and the results are fascinating!

Key insights:
• Mobile users engage 40% longer than desktop
• Feature adoption follows a perfect power law distribution
• Tuesday is our highest engagement day (who knew?)
• Users who complete onboarding are 5x more likely to convert

Data really does tell a story. The trick is knowing which questions to ask!

Next up: diving into cohort analysis to understand retention patterns better.

#DataScience #Analytics #UserBehavior`,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
    timestamp: '2 days ago',
    likes: 67,
    comments: 11,
    shares: 18,
    isLiked: true,
    isSaved: false
  }
];

interface FeedProps {
  className?: string;
}

const Feed: React.FC<FeedProps> = ({ className = '' }) => {
  const handleLike = (postId: string) => {
    console.log('Liked post:', postId);
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId: string) => {
    console.log('Share post:', postId);
  };

  const handleSave = (postId: string) => {
    console.log('Save post:', postId);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {mockPosts.map((post) => (
        <FeedPost
          key={post.id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onSave={handleSave}
        />
      ))}
    </div>
  );
};

export default Feed;