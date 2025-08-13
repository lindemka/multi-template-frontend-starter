-- Create feed_posts table
CREATE TABLE feed_posts (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create feed_likes table
CREATE TABLE feed_likes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id BIGINT NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- Create feed_comments table
CREATE TABLE feed_comments (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id BIGINT NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
    parent_comment_id BIGINT REFERENCES feed_comments(id) ON DELETE CASCADE,
    is_edited BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create feed_shares table
CREATE TABLE feed_shares (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id BIGINT NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
    share_platform VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_feed_posts_author_id ON feed_posts(author_id);
CREATE INDEX idx_feed_posts_created_at ON feed_posts(created_at DESC);
CREATE INDEX idx_feed_posts_published ON feed_posts(is_published) WHERE is_published = TRUE;

CREATE INDEX idx_feed_likes_user_id ON feed_likes(user_id);
CREATE INDEX idx_feed_likes_post_id ON feed_likes(post_id);

CREATE INDEX idx_feed_comments_user_id ON feed_comments(user_id);
CREATE INDEX idx_feed_comments_post_id ON feed_comments(post_id);
CREATE INDEX idx_feed_comments_parent_id ON feed_comments(parent_comment_id);
CREATE INDEX idx_feed_comments_created_at ON feed_comments(created_at DESC);

CREATE INDEX idx_feed_shares_user_id ON feed_shares(user_id);
CREATE INDEX idx_feed_shares_post_id ON feed_shares(post_id);

-- Insert sample feed posts for testing
INSERT INTO feed_posts (content, author_id, created_at) VALUES
('🚀 Just launched a new feature that reduces load times by 60%! The key was implementing smart caching strategies and optimizing our database queries. It''s amazing what proper indexing can do. Always remember: premature optimization is the root of all evil, but informed optimization is the path to excellence! #WebDevelopment #Performance #TechLife', 1, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('Exciting news! 🎉 We''ve just hit 10,000 active users on our platform! This milestone wouldn''t have been possible without our amazing team and the incredible feedback from our community. Here''s what we learned along the way: • Listen to user feedback religiously • Ship fast, but don''t break things • Data-driven decisions > gut feelings • Team culture matters more than individual talent Thank you to everyone who believed in our vision! 🙏 #Startup #ProductManagement #Milestone', 2, CURRENT_TIMESTAMP - INTERVAL '4 hours'),
('💡 Design tip of the day: White space is not wasted space! I see so many products cramming information everywhere, thinking more content = more value. But here''s the truth: White space improves: ✅ Readability ✅ Focus ✅ User comprehension ✅ Overall aesthetic appeal Sometimes less really is more. Give your content room to breathe! What''s your favorite example of great use of white space? #UXDesign #DesignTips #UserExperience', 3, CURRENT_TIMESTAMP - INTERVAL '6 hours'),
('🔧 PSA: Your monitoring is only as good as your alerting strategy. Just prevented a major outage because our alerts caught a memory leak at 3 AM. The key is setting up meaningful alerts that don''t cry wolf. My golden rules: 1. Alert on symptoms, not causes 2. Make alerts actionable 3. Reduce noise with smart grouping 4. Always have escalation paths Sleep is important, but so is system reliability! 😴 #DevOps #Monitoring #SRE', 4, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('📊 Just finished analyzing our user behavior data and the results are fascinating! Key insights: • Mobile users engage 40% longer than desktop • Feature adoption follows a perfect power law distribution • Tuesday is our highest engagement day (who knew?) • Users who complete onboarding are 5x more likely to convert Data really does tell a story. The trick is knowing which questions to ask! Next up: diving into cohort analysis to understand retention patterns better. #DataScience #Analytics #UserBehavior', 5, CURRENT_TIMESTAMP - INTERVAL '2 days');

-- Insert sample likes
INSERT INTO feed_likes (user_id, post_id) VALUES
(2, 1), (3, 1), (4, 1), (5, 1),
(1, 2), (3, 2), (4, 2), (5, 2),
(1, 3), (2, 3), (4, 3), (5, 3),
(1, 4), (2, 4), (3, 4), (5, 4),
(1, 5), (2, 5), (3, 5), (4, 5);

-- Insert sample comments
INSERT INTO feed_comments (content, user_id, post_id) VALUES
('Amazing work! What caching strategy did you use?', 2, 1),
('Redis or Memcached?', 3, 1),
('Great insights! The power law distribution is fascinating.', 1, 5),
('Tuesday engagement - that''s unexpected!', 2, 5),
('White space is indeed crucial for good UX!', 1, 3),
('Couldn''t agree more about alerting strategy.', 1, 4);
