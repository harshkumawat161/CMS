import React from 'react';
import portfolioApi from '@/lib/api';
import HeroSection from '@/components/home/HeroSection';
import AboutPreviewSection from '@/components/home/AboutPreviewSection';
import SkillsSection from '@/components/home/SkillsSection';
import FeaturedProjectsSection from '@/components/home/FeaturedProjectsSection';
import ExperienceSection from '@/components/home/ExperienceSection';
import ServicesSection from '@/components/home/ServicesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import LatestBlogsSection from '@/components/home/LatestBlogsSection';
import ContactCtaSection from '@/components/home/ContactCtaSection';

export default async function HomePage() {
  const [
    aboutRes,
    skillsRes,
    projectsRes,
    experiencesRes,
    servicesRes,
    testimonialsRes,
    blogsRes,
  ] = await Promise.allSettled([
    portfolioApi.getAbout(),
    portfolioApi.getSkills(),
    portfolioApi.getProjects(),
    portfolioApi.getExperiences(),
    portfolioApi.getServices(),
    portfolioApi.getTestimonials(),
    portfolioApi.getBlogs(0, 3),
  ]);

  const about = aboutRes.status === 'fulfilled' ? aboutRes.value : null;
  const skills = skillsRes.status === 'fulfilled' ? skillsRes.value : [];
  const projects = projectsRes.status === 'fulfilled' ? projectsRes.value : [];
  const experiences =
    experiencesRes.status === 'fulfilled' ? experiencesRes.value : [];
  const services = servicesRes.status === 'fulfilled' ? servicesRes.value : [];
  const testimonials =
    testimonialsRes.status === 'fulfilled' ? testimonialsRes.value : [];
  const blogs =
    blogsRes.status === 'fulfilled' ? blogsRes.value.content : [];

  return (
    <div className="space-y-0">
      {/* 1. Hero */}
      <HeroSection about={about} />

      {/* 2. About Preview */}
      <AboutPreviewSection about={about} />

      {/* 3. Skills */}
      <SkillsSection skills={skills} />

      {/* 4. Featured Projects */}
      <FeaturedProjectsSection projects={projects} />

      {/* 5. Experience */}
      <ExperienceSection experiences={experiences} />

      {/* 6. Services */}
      <ServicesSection services={services} />

      {/* 7. Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 8. Latest Blogs */}
      <LatestBlogsSection blogs={blogs} />

      {/* 9. Contact CTA */}
      <ContactCtaSection />
    </div>
  );
}
