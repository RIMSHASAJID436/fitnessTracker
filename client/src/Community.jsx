import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Search, 
  Plus, 
  UserCheck, 
  UserPlus, 
  Flame, 
  Send, 
  X, 
  Activity,
  Award,
  Clock
} from 'lucide-react';
import { useAuth } from './context/AuthContext';

const Community = () => {
  const { user, formatWeight } = useAuth();
  const token = localStorage.getItem('fitTrackToken');

  const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'athletes'
  const [posts, setPosts] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchPost, setSearchPost] = useState('');
  const [searchAthlete, setSearchAthlete] = useState('');

  // Modals & comments
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('workout_win');
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const fetchPosts = async () => {
    try {
      let url = 'http://localhost:5000/api/community?';
      if (categoryFilter !== 'all') url += `category=${categoryFilter}&`;
      if (searchPost.trim()) url += `search=${encodeURIComponent(searchPost.trim())}&`;

      const res = await fetch(url, {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error('Fetch posts err:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAthletes = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/search?q=${encodeURIComponent(searchAthlete)}`, {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setAthletes(data);
      }
    } catch (err) {
      console.error('Fetch athletes err:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [categoryFilter, searchPost]);

  useEffect(() => {
    fetchAthletes();
  }, [searchAthlete]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          content: newPostContent,
          category: newPostCategory
        })
      });
      if (res.ok) {
        const post = await res.json();
        setPosts([post, ...posts]);
        setNewPostContent('');
        setShowPostModal(false);
      }
    } catch (err) {
      console.error('Create post err:', err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/community/${postId}/like`, {
        method: 'POST',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(posts.map(p => {
          if (p._id === postId) {
            const hasLiked = p.likes?.some(l => l.toString() === user._id);
            const newLikes = hasLiked
              ? p.likes.filter(l => l.toString() !== user._id)
              : [...(p.likes || []), user._id];
            return { ...p, likes: newLikes };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error('Like err:', err);
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/community/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ text: commentText })
      });
      if (res.ok) {
        const updatedComments = await res.json();
        setPosts(posts.map(p => p._id === postId ? { ...p, comments: updatedComments } : p));
        setCommentText('');
      }
    } catch (err) {
      console.error('Comment err:', err);
    }
  };

  const handleFollowToggle = async (athleteId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${athleteId}/follow`, {
        method: 'POST',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setAthletes(athletes.map(a => {
          if (a._id === athleteId) {
            const isNowFollowing = data.following;
            const updatedFollowers = isNowFollowing 
              ? [...(a.followers || []), user._id]
              : (a.followers || []).filter(f => f.toString() !== user._id);
            return { ...a, followers: updatedFollowers };
          }
          return a;
        }));
      }
    } catch (err) {
      console.error('Follow toggle err:', err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users color="var(--primary)" size={36} /> ATHLETE <span style={{ color: 'var(--primary)' }}>COMMUNITY</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Connect with like-minded athletes, share workout milestones, and discuss training routines.
          </p>
        </div>

        <button onClick={() => setShowPostModal(true)} className="btn-primary">
          <Plus size={20} /> Share Milestone / Post
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('feed')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: activeTab === 'feed' ? 'var(--primary)' : 'var(--text-muted)', 
            fontSize: '1.1rem', 
            fontWeight: 700, 
            cursor: 'pointer',
            fontFamily: "'Oswald', sans-serif",
            letterSpacing: '0.5px',
            position: 'relative',
            paddingBottom: '0.5rem'
          }}
        >
          Community Feed ({posts.length})
          {activeTab === 'feed' && (
            <motion.div layoutId="tabUnderlineComm" style={{ position: 'absolute', bottom: '-1rem', left: 0, right: 0, height: '3px', background: 'var(--primary)' }} />
          )}
        </button>

        <button 
          onClick={() => setActiveTab('athletes')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: activeTab === 'athletes' ? 'var(--primary)' : 'var(--text-muted)', 
            fontSize: '1.1rem', 
            fontWeight: 700, 
            cursor: 'pointer',
            fontFamily: "'Oswald', sans-serif",
            letterSpacing: '0.5px',
            position: 'relative',
            paddingBottom: '0.5rem'
          }}
        >
          Discover Athletes ({athletes.length})
          {activeTab === 'athletes' && (
            <motion.div layoutId="tabUnderlineComm" style={{ position: 'absolute', bottom: '-1rem', left: 0, right: 0, height: '3px', background: 'var(--primary)' }} />
          )}
        </button>
      </div>

      {activeTab === 'feed' ? (
        <>
          {/* Feed Filter Bar */}
          <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search community posts & discussions..."
                style={{ paddingLeft: '2.75rem' }}
                value={searchPost}
                onChange={(e) => setSearchPost(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Topics' },
                { id: 'workout_win', label: 'Workout Wins' },
                { id: 'routine_share', label: 'Routines' },
                { id: 'nutrition_tip', label: 'Nutrition' },
                { id: 'motivation', label: 'Motivation' },
                { id: 'qna', label: 'Q&A' }
              ].map(cat => (
                <button 
                  key={cat.id}
                  className={`filter-pill ${categoryFilter === cat.id ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Feed */}
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Loading community discussions...</p>
          ) : posts.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <MessageSquare size={56} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Posts Found</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                Be the first athlete to share your workout milestone, routine advice, or ask a question!
              </p>
              <button onClick={() => setShowPostModal(true)} className="btn-primary">
                <Plus size={18} /> Create First Post
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px', margin: '0 auto' }}>
              {posts.map(post => {
                const isLiked = post.likes && post.likes.some(l => l.toString() === user?._id);
                const isCommentOpen = activeCommentPostId === post._id;

                return (
                  <motion.div 
                    key={post._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel"
                    style={{ padding: '1.75rem' }}
                  >
                    {/* Post Author */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img 
                          src={post.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                          alt={post.user?.name}
                          style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem' }}>{post.user?.name || 'Athlete'}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            @{post.user?.username || 'athlete'} • {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <span className="badge" style={{ background: 'var(--surface-light)', color: 'var(--primary)', border: '1px solid var(--surface-border)' }}>
                        {post.category?.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Content */}
                    <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text)', whiteSpace: 'pre-line', marginBottom: '1.25rem' }}>
                      {post.content}
                    </p>

                    {/* Attached Routine if any */}
                    {post.workoutRef && (
                      <div style={{ background: 'var(--surface-light)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--surface-border)', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                          <Activity size={18} /> Routine Attached: {post.workoutRef.name} ({post.workoutRef.category})
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                          Exercises: {post.workoutRef.exercises?.map(e => e.name).join(', ')}
                        </div>
                      </div>
                    )}

                    {/* Actions: Likes & Comments */}
                    <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid var(--surface-border)', paddingTop: '1rem' }}>
                      <button 
                        onClick={() => handleLike(post._id)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: isLiked ? 'var(--primary)' : 'var(--text-muted)', 
                          cursor: 'pointer', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          fontWeight: 600,
                          fontSize: '0.9rem'
                        }}
                      >
                        <Heart size={18} fill={isLiked ? 'var(--primary)' : 'none'} />
                        {post.likes?.length || 0} Likes
                      </button>

                      <button 
                        onClick={() => setActiveCommentPostId(isCommentOpen ? null : post._id)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: isCommentOpen ? 'var(--primary)' : 'var(--text-muted)', 
                          cursor: 'pointer', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          fontWeight: 600,
                          fontSize: '0.9rem'
                        }}
                      >
                        <MessageSquare size={18} />
                        {post.comments?.length || 0} Comments
                      </button>
                    </div>

                    {/* Comments Drawer */}
                    <AnimatePresence>
                      {isCommentOpen && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ marginTop: '1rem', borderTop: '1px solid var(--surface-border)', paddingTop: '1rem' }}
                        >
                          {/* Input */}
                          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input 
                              type="text" 
                              className="input-field" 
                              placeholder="Write a comment or response..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post._id); }}
                            />
                            <button onClick={() => handleAddComment(post._id)} className="btn-primary" style={{ padding: '0.65rem 1rem' }}>
                              <Send size={16} />
                            </button>
                          </div>

                          {/* List */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {(!post.comments || post.comments.length === 0) ? (
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No comments yet. Start the conversation!</p>
                            ) : (
                              post.comments.map((c, i) => (
                                <div key={i} style={{ display: 'flex', gap: '0.75rem', background: 'var(--surface-light)', padding: '0.75rem', borderRadius: '8px' }}>
                                  <img 
                                    src={c.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                                    alt={c.user?.name}
                                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                                  />
                                  <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.user?.name || 'Athlete'}</span>
                                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text)', marginTop: '0.2rem' }}>{c.text}</div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Athletes Directory Tab */
        <div>
          {/* Athlete Search */}
          <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search athletes by name or username..." 
                style={{ paddingLeft: '2.75rem' }}
                value={searchAthlete}
                onChange={(e) => setSearchAthlete(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {athletes.map(ath => {
              const isFollowing = ath.followers && ath.followers.some(f => f.toString() === user?._id);

              return (
                <div key={ath._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <img 
                        src={ath.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                        alt={ath.name}
                        style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                      />
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{ath.name}</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>@{ath.username}</p>
                        <span className="badge" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', marginTop: '0.3rem', fontSize: '0.7rem' }}>
                          {ath.fitnessGoal?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {ath.bio || 'Crushing goals with FitTrack Pro.'}
                    </p>

                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      <div><strong style={{ color: '#fff' }}>{ath.followers?.length || 0}</strong> Followers</div>
                      <div><strong style={{ color: '#fff' }}>{ath.following?.length || 0}</strong> Following</div>
                      <div>Weight: <strong style={{ color: '#fff' }}>{formatWeight(ath.currentWeight || 70)}</strong></div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleFollowToggle(ath._id)}
                    className={isFollowing ? 'btn-outline' : 'btn-primary'}
                    style={{ width: '100%', padding: '0.55rem', fontSize: '0.9rem' }}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck size={16} /> Following
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} /> Follow Athlete
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showPostModal && (
        <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users color="var(--primary)" /> Share with the Community
              </h2>
              <button onClick={() => setShowPostModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Topic Category</label>
                <select 
                  className="input-field"
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                >
                  <option value="workout_win">Workout Win / Milestone Achieved</option>
                  <option value="routine_share">Training Routine & Program Advice</option>
                  <option value="nutrition_tip">Nutrition & Meal Prep Tip</option>
                  <option value="motivation">Athlete Motivation & Mindset</option>
                  <option value="qna">Question & Community Advice (Q&A)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Post Content *</label>
                <textarea 
                  className="input-field"
                  rows="5"
                  placeholder="Share your progress, workout numbers, or fitness questions..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                Publish Post
              </button>
            </form>
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default Community;
