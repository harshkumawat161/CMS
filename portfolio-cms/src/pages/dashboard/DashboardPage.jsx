import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  BookOpen,
  Wrench,
  Inbox,
  CheckCircle2,
  Image,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import projectService from '../../services/projectService';
import blogService from '../../services/blogService';
import skillService from '../../services/skillService';
import messageService from '../../services/messageService';
import mediaService from '../../services/mediaService';
import aboutService from '../../services/aboutService';
import { useToast } from '../../context/ToastContext';
import LoadingState from '../../components/LoadingState';

export const DashboardPage = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Real backend metrics
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    totalBlogs: 0,
    publishedBlogs: 0,
    totalSkills: 0,
    publishedSkills: 0,
    unreadMessages: 0,
    totalMessages: 0,
    totalMedia: 0,
  });

  const [recentMessages, setRecentMessages] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [aboutProfile, setAboutProfile] = useState(null);

  const fetchDashboardData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const [
        projectsRes,
        blogsRes,
        skillsRes,
        messagesRes,
        mediaRes,
        aboutRes,
      ] = await Promise.allSettled([
        projectService.getAllProjects(),
        blogService.getAllBlogs(),
        skillService.getAllSkills(),
        messageService.getAllMessages(),
        mediaService.getAllMedia(),
        aboutService.getAbout(),
      ]);

      const projects = projectsRes.status === 'fulfilled' ? projectsRes.value || [] : [];
      const blogs = blogsRes.status === 'fulfilled' ? blogsRes.value || [] : [];
      const skills = skillsRes.status === 'fulfilled' ? skillsRes.value || [] : [];
      const messages = messagesRes.status === 'fulfilled' ? messagesRes.value || [] : [];
      const media = mediaRes.status === 'fulfilled' ? mediaRes.value || [] : [];
      const about = aboutRes.status === 'fulfilled' ? aboutRes.value : null;

      const pubProjects = projects.filter((p) => p.status === 'PUBLISHED').length;
      const pubBlogs = blogs.filter((b) => b.status === 'PUBLISHED').length;
      const pubSkills = skills.filter((s) => s.published).length;
      const unreadMsgs = messages.filter((m) => !m.read).length;

      setStats({
        totalProjects: projects.length,
        publishedProjects: pubProjects,
        totalBlogs: blogs.length,
        publishedBlogs: pubBlogs,
        totalSkills: skills.length,
        publishedSkills: pubSkills,
        unreadMessages: unreadMsgs,
        totalMessages: messages.length,
        totalMedia: media.length,
      });

      setRecentMessages(messages.slice(0, 5));
      setRecentProjects(projects.slice(0, 4));
      setAboutProfile(about);

      if (isManual) {
        toast.success('Live dashboard data synchronized with server.');
      }
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
      toast.error('Could not load some dashboard analytics from the server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalPublishedContent =
    stats.publishedProjects + stats.publishedBlogs + stats.publishedSkills;

  if (loading) {
    return <LoadingState message="Fetching real-time CMS metrics and system health..." />;
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      subtext: `${stats.publishedProjects} published · ${stats.totalProjects - stats.publishedProjects} draft`,
      icon: FolderGit2,
      color: 'from-blue-600/20 to-indigo-600/20 border-blue-500/30 text-blue-400',
      link: '/projects',
    },
    {
      title: 'Blog Articles',
      value: stats.totalBlogs,
      subtext: `${stats.publishedBlogs} published · ${stats.totalBlogs - stats.publishedBlogs} draft`,
      icon: BookOpen,
      color: 'from-purple-600/20 to-pink-600/20 border-purple-500/30 text-purple-400',
      link: '/blogs',
    },
    {
      title: 'Skills Listed',
      value: stats.totalSkills,
      subtext: `${stats.publishedSkills} visible in public portfolio`,
      icon: Wrench,
      color: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-emerald-400',
      link: '/skills',
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages,
      subtext: `${stats.totalMessages} total inquiries received`,
      icon: Inbox,
      color: stats.unreadMessages > 0
        ? 'from-rose-600/20 to-orange-600/20 border-rose-500/40 text-rose-400'
        : 'from-slate-700/20 to-slate-800/20 border-slate-700/40 text-slate-400',
      link: '/messages',
      highlightBadge: stats.unreadMessages > 0 ? 'Requires Action' : null,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Live Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-slate-900 border border-indigo-900/30 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Live Control Center
            </span>
            <span className="text-xs text-slate-400">
              Last synced: {new Date().toLocaleTimeString()}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            {aboutProfile?.name ? `Welcome back, ${aboutProfile.name}` : 'Welcome back, Administrator'}
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time management dashboard backed by Spring Boot REST services
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 text-xs font-semibold transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync Data</span>
          </button>
          <Link
            to="/projects"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Manage Content</span>
          </Link>
        </div>
      </div>

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="group relative p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} border flex items-center justify-center transition-transform group-hover:scale-110`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  {card.highlightBadge ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {card.highlightBadge}
                    </span>
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
                  )}
                </div>

                <div className="text-3xl font-black text-white tracking-tight mb-1">
                  {card.value}
                </div>
                <div className="text-sm font-medium text-slate-300">{card.title}</div>
              </div>

              <div className="text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800/80">
                {card.subtext}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Aggregate Publishing & Content Health Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Published Ratio Card */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Publication Status
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white mb-1">
              {totalPublishedContent} Items
            </div>
            <p className="text-xs text-slate-400">
              Total active public entries (Projects, Blogs & Skills)
            </p>
          </div>

          <div className="space-y-3 mt-6 pt-4 border-t border-slate-800">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-400">Projects Published</span>
                <span className="text-slate-200">
                  {stats.publishedProjects} / {stats.totalProjects}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{
                    width: `${stats.totalProjects ? (stats.publishedProjects / stats.totalProjects) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-400">Blogs Published</span>
                <span className="text-slate-200">
                  {stats.publishedBlogs} / {stats.totalBlogs}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{
                    width: `${stats.totalBlogs ? (stats.publishedBlogs / stats.totalBlogs) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-400">Skills Published</span>
                <span className="text-slate-200">
                  {stats.publishedSkills} / {stats.totalSkills}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{
                    width: `${stats.totalSkills ? (stats.publishedSkills / stats.totalSkills) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media & Profile Health Card */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Asset Storage & Profile
              </span>
              <Image className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-3xl font-black text-white mb-1">
              {stats.totalMedia} Files
            </div>
            <p className="text-xs text-slate-400">
              Media files stored in local repository with secure URLs
            </p>
          </div>

          <div className="space-y-3 mt-6 pt-4 border-t border-slate-800">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="text-xs font-semibold text-slate-200 mb-0.5">
                Profile Information
              </div>
              <p className="text-xs text-slate-400 truncate">
                {aboutProfile?.headline || 'No headline configured yet.'}
              </p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-indigo-400 font-medium">
                <Link to="/about" className="hover:underline flex items-center gap-1">
                  <span>Edit Profile</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
                <Link to="/media" className="hover:underline flex items-center gap-1 text-slate-400 hover:text-slate-200">
                  <span>Manage Media</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Launchpad Card */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
              Content Launchpad
            </span>
            <div className="text-lg font-bold text-white mb-1">Administrative Actions</div>
            <p className="text-xs text-slate-400">
              Quick shortcuts to add new records to your portfolio
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-6 pt-4 border-t border-slate-800">
            <Link
              to="/projects"
              className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-200 hover:text-white transition-colors flex items-center gap-2"
            >
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
              <span>+ Project</span>
            </Link>
            <Link
              to="/blogs"
              className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-200 hover:text-white transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>+ Article</span>
            </Link>
            <Link
              to="/skills"
              className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-200 hover:text-white transition-colors flex items-center gap-2"
            >
              <Wrench className="w-4 h-4 text-emerald-400" />
              <span>+ Skill</span>
            </Link>
            <Link
              to="/media"
              className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-200 hover:text-white transition-colors flex items-center gap-2"
            >
              <Image className="w-4 h-4 text-sky-400" />
              <span>Upload File</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Inquiries & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Recent Inquiries</h3>
              <p className="text-xs text-slate-400">Latest messages submitted via contact form</p>
            </div>
            <Link
              to="/messages"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              No contact inquiries recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <Link
                  key={msg.id}
                  to="/messages"
                  className="flex items-start justify-between p-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 transition-colors group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                        msg.read ? 'bg-slate-600' : 'bg-rose-500 animate-pulse'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-200 truncate group-hover:text-indigo-300">
                          {msg.name}
                        </span>
                        <span className="text-xs text-slate-400 truncate">({msg.email})</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
                        {msg.subject}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{msg.message}</p>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 shrink-0 ml-3">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Recent'}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Project Showcase</h3>
              <p className="text-xs text-slate-400">Featured projects and publish status</p>
            </div>
            <Link
              to="/projects"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <FolderGit2 className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              No projects created yet. Click "+ Project" to begin.
            </div>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-800"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-200 truncate">
                        {proj.title}
                      </span>
                      {proj.featured && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {proj.shortDescription || 'No description provided'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        proj.status === 'PUBLISHED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-700/30 text-slate-400 border border-slate-700/50'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
