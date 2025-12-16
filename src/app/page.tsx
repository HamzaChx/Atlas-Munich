import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar, CategoryCard } from "@/components/shared";
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { places } from "@/data/places";
import { faqs } from "@/data/faqs";
import {
  BookOpen,
  ChevronRight,
  Sparkles,
  MapPin,
  HelpCircle,
  Users,
  CheckCircle2,
  Heart,
  Compass,
  Coffee,
  Home as HomeIcon,
  FileText,
  ArrowRight,
} from "lucide-react";

// Quick links for the hero
const quickLinks = [
  { label: "Find Housing", href: "/category/rent-housing", icon: HomeIcon },
  { label: "KVR Registration", href: "/category/kvr-residence", icon: FileText },
  { label: "Halal Food", href: "/places", icon: Coffee },
  { label: "All Guides", href: "/guides", icon: Compass },
];

// Stats
const stats = [
  { value: guides.length, suffix: "+", label: "Guides", icon: BookOpen },
  { value: places.length, suffix: "+", label: "Places", icon: MapPin },
  { value: faqs.length, suffix: "+", label: "FAQs Answered", icon: HelpCircle },
  { value: "100", suffix: "%", label: "Free & Open", icon: Heart },
];

export default function Home() {
  const guideCountByCategory = (key: string) =>
    guides.filter((g) => g.categoryKey === key).length;

  return (
    <div className="min-h-screen">
      {/* Hero Section - Moroccan-Munich Fusion */}
      <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        {/* Authentic Moroccan Zellige Pattern - Inspired by traditional mosaics */}
        <div className="absolute inset-0 opacity-[0.08]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Traditional Moroccan Zellige Tile Pattern */}
              <pattern id="moroccan-zellige" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                {/* Central hexagon with star (classic zellige motif) */}
                <g transform="translate(50, 50)">
                  {/* Outer hexagon */}
                  <path d="M 0,-30 L 26,-15 L 26,15 L 0,30 L -26,15 L -26,-15 Z" 
                        fill="none" stroke="white" strokeWidth="2" opacity="0.9"/>
                  
                  {/* 6-pointed star inside */}
                  <path d="M 0,-20 L 6,-6 L 20,0 L 6,6 L 0,20 L -6,6 L -20,0 L -6,-6 Z" 
                        fill="none" stroke="white" strokeWidth="1.5" opacity="0.8"/>
                  
                  {/* Inner hexagon */}
                  <path d="M 0,-12 L 10,-6 L 10,6 L 0,12 L -10,6 L -10,-6 Z" 
                        fill="none" stroke="white" strokeWidth="1" opacity="0.7"/>
                  
                  {/* Central small star */}
                  <path d="M 0,-5 L 2,-2 L 5,0 L 2,2 L 0,5 L -2,2 L -5,0 L -2,-2 Z" 
                        fill="white" opacity="0.6"/>
                </g>
                
                {/* Four corner motifs (smaller geometric patterns) */}
                <g transform="translate(0, 0)">
                  <path d="M 8,0 L 4,4 L 0,8 L 4,4 L 8,8 L 4,4 Z" 
                        fill="none" stroke="white" strokeWidth="0.8" opacity="0.5"/>
                  <circle cx="4" cy="4" r="2" fill="none" stroke="white" strokeWidth="0.5" opacity="0.4"/>
                </g>
                <g transform="translate(100, 0)">
                  <path d="M -8,0 L -4,4 L 0,8 L -4,4 L -8,8 L -4,4 Z" 
                        fill="none" stroke="white" strokeWidth="0.8" opacity="0.5"/>
                  <circle cx="-4" cy="4" r="2" fill="none" stroke="white" strokeWidth="0.5" opacity="0.4"/>
                </g>
                <g transform="translate(0, 100)">
                  <path d="M 8,0 L 4,-4 L 0,-8 L 4,-4 L 8,-8 L 4,-4 Z" 
                        fill="none" stroke="white" strokeWidth="0.8" opacity="0.5"/>
                  <circle cx="4" cy="-4" r="2" fill="none" stroke="white" strokeWidth="0.5" opacity="0.4"/>
                </g>
                <g transform="translate(100, 100)">
                  <path d="M -8,0 L -4,-4 L 0,-8 L -4,-4 L -8,-8 L -4,-4 Z" 
                        fill="none" stroke="white" strokeWidth="0.8" opacity="0.5"/>
                  <circle cx="-4" cy="-4" r="2" fill="none" stroke="white" strokeWidth="0.5" opacity="0.4"/>
                </g>
                
                {/* Connecting crosses (traditional zellige element) */}
                <path d="M 50,0 L 50,10 M 45,5 L 55,5" stroke="white" strokeWidth="1" opacity="0.4"/>
                <path d="M 0,50 L 10,50 M 5,45 L 5,55" stroke="white" strokeWidth="1" opacity="0.4"/>
                <path d="M 50,100 L 50,90 M 45,95 L 55,95" stroke="white" strokeWidth="1" opacity="0.4"/>
                <path d="M 100,50 L 90,50 M 95,45 L 95,55" stroke="white" strokeWidth="1" opacity="0.4"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#moroccan-zellige)"/>
          </svg>
        </div>

        {/* Gradient Orbs - Morocco & Germany colors */}
        <div className="absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-red-600/20 to-green-600/20 blur-[120px]" />
        <div className="absolute -right-32 bottom-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-500/15 to-red-600/15 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 blur-[100px]" />

        {/* Detailed Munich Skyline Silhouette - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-52 opacity-[0.10]">
          <svg viewBox="0 0 1440 200" className="h-full w-full" preserveAspectRatio="none">
            
            {/* Main skyline base */}
            <path 
              fill="white" 
              d="M0,200 L0,175
                L30,175 L30,160 L50,160 L50,175
                L80,175 L80,100 L85,100 L85,55 L95,35 L105,55 L105,100 L125,100 L125,55 L135,35 L145,55 L145,100 L150,100 L150,175
                L200,175 L200,150 L220,150 L220,175
                L260,175 L260,140 L270,140 L275,110 L285,110 L290,140 L300,140 L300,175
                L340,175 L340,155 L360,155 L360,175
                L400,175 L400,130 L410,130 L420,100 L430,100 L440,130 L450,130 L450,175
                L490,175 L490,160 L510,160 L510,175
                L550,175 L550,145 L555,145 L555,115 L565,95 L575,115 L575,145 L580,145 L580,175
                L620,175 L620,160 L640,160 L640,175
                L680,175 L680,135 L690,135 L700,105 L710,105 L720,135 L730,135 L730,175
                L770,175 L770,155 L790,155 L790,175
                L830,175 L830,140 L840,140 L850,110 L860,110 L870,140 L880,140 L880,175
                L920,175 L920,160 L940,160 L940,175
                L980,175 L980,145 L990,145 L1000,115 L1010,115 L1020,145 L1030,145 L1030,175
                L1070,175 L1070,155 L1090,155 L1090,175
                L1130,175 L1130,140 L1145,140 L1145,175
                L1180,175 L1180,160 L1200,160 L1200,175
                L1240,175 L1240,145 L1255,145 L1255,175
                L1290,175 L1290,155 L1310,155 L1310,175
                L1350,175 L1350,55 L1350,175
                L1440,175 L1440,200 Z"
            />
            
            {/* === LEFT: Frauenkirche Twin Towers === */}
            {/* Left Tower */}
            <rect x="82" y="55" width="26" height="120" fill="white"/>
            <ellipse cx="95" cy="55" rx="13" ry="18" fill="white"/>
            <line x1="95" y1="37" x2="95" y2="18" stroke="white" strokeWidth="2"/>
            <circle cx="95" cy="14" r="5" fill="white"/>
            {/* Right Tower */}
            <rect x="122" y="55" width="26" height="120" fill="white"/>
            <ellipse cx="135" cy="55" rx="13" ry="18" fill="white"/>
            <line x1="135" y1="37" x2="135" y2="18" stroke="white" strokeWidth="2"/>
            <circle cx="135" cy="14" r="5" fill="white"/>
            {/* Church body */}
            <rect x="70" y="100" width="100" height="75" fill="white"/>
            
            {/* === GEOMETRIC BUILDINGS CENTER === */}
            {/* Building with diamond pattern */}
            <rect x="270" y="110" width="25" height="65" fill="white"/>
            <path d="M282.5 115L290 125L282.5 135L275 125Z" fill="none" stroke="white" strokeWidth="1.5"/>
            <path d="M282.5 140L290 150L282.5 160L275 150Z" fill="none" stroke="white" strokeWidth="1.5"/>
            
            {/* Rathaus-style tower */}
            <rect x="410" y="100" width="40" height="75" fill="white"/>
            <rect x="420" y="70" width="20" height="30" fill="white"/>
            <polygon points="430,40 415,70 445,70" fill="white"/>
            <line x1="430" y1="40" x2="430" y2="20" stroke="white" strokeWidth="2"/>
            
            {/* Hexagonal pattern building */}
            <rect x="555" y="95" width="25" height="80" fill="white"/>
            <circle cx="567.5" cy="110" r="8" fill="none" stroke="white" strokeWidth="1.5"/>
            <circle cx="567.5" cy="130" r="8" fill="none" stroke="white" strokeWidth="1.5"/>
            <circle cx="567.5" cy="150" r="8" fill="none" stroke="white" strokeWidth="1.5"/>
            
            {/* Modern glass tower */}
            <rect x="695" y="105" width="30" height="70" fill="white"/>
            <line x1="700" y1="105" x2="700" y2="175" stroke="white" strokeWidth="1"/>
            <line x1="710" y1="105" x2="710" y2="175" stroke="white" strokeWidth="1"/>
            <line x1="720" y1="105" x2="720" y2="175" stroke="white" strokeWidth="1"/>
            <line x1="695" y1="120" x2="725" y2="120" stroke="white" strokeWidth="1"/>
            <line x1="695" y1="140" x2="725" y2="140" stroke="white" strokeWidth="1"/>
            <line x1="695" y1="160" x2="725" y2="160" stroke="white" strokeWidth="1"/>
            
            {/* Triangle pattern building */}
            <rect x="845" y="110" width="30" height="65" fill="white"/>
            <polygon points="860,115 850,130 870,130" fill="none" stroke="white" strokeWidth="1.5"/>
            <polygon points="860,135 850,150 870,150" fill="none" stroke="white" strokeWidth="1.5"/>
            
            {/* BMW-style cylinders */}
            <rect x="995" y="115" width="12" height="60" rx="6" fill="white"/>
            <rect x="1010" y="120" width="12" height="55" rx="6" fill="white"/>
            
            {/* === RIGHT: Olympiaturm (Olympic Tower) === */}
            <rect x="1370" y="30" width="10" height="145" fill="white"/>
            {/* Observation deck */}
            <ellipse cx="1375" cy="55" rx="22" ry="30" fill="none" stroke="white" strokeWidth="3"/>
            <ellipse cx="1375" cy="55" rx="15" ry="20" fill="white"/>
            {/* Top antenna */}
            <circle cx="1375" cy="25" r="8" fill="white"/>
            <line x1="1375" y1="17" x2="1375" y2="0" stroke="white" strokeWidth="3"/>
            {/* Restaurant level */}
            <ellipse cx="1375" cy="90" rx="12" ry="8" fill="white"/>
          </svg>
        </div>

        {/* Content */}
        <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
          {/* Cultural Bridge Badge */}
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-xl">
            <span className="text-3xl" role="img" aria-label="Morocco">🇲🇦</span>
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-gradient-to-r from-red-500 via-amber-500 to-green-500" />
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span className="h-px w-8 bg-gradient-to-r from-black via-red-500 to-amber-400" />
            </div>
            <span className="text-3xl" role="img" aria-label="Germany">🇩🇪</span>
          </div>

          {/* Main Title */}
          <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            Your Complete Guide to
            <span className="relative mt-2 block">
              <span className="relative z-10 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Thriving in Munich
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 blur-xl" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
            Built by the <span className="font-semibold text-amber-400">Moroccan community</span>, for the Moroccan community.
            Everything you need to navigate life in Munich — from your first Anmeldung to finding the best tajine in town.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-10 w-full max-w-2xl">
            <div className="relative">
              <SearchBar
                size="lg"
                placeholder="Search for guides, places, or answers..."
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
                <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/10 hover:bg-white/10"
              >
                <div className="mb-2 inline-flex rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-2">
                  <stat.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white sm:text-3xl">
                  {stat.value}
                  <span className="text-emerald-400">{stat.suffix}</span>
                </div>
                <div className="text-xs text-zinc-500 sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Categories Section - Moroccan Tile Inspired */}
      <section className="relative overflow-hidden border-b border-white/10 bg-zinc-950 py-24">
        {/* Moroccan Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="categories-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="white" strokeWidth="1"/>
                <circle cx="30" cy="30" r="8" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#categories-pattern)"/>
          </svg>
        </div>

        {/* Decorative Elements */}
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <Badge className="mb-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <Compass className="mr-1.5 h-3.5 w-3.5" />
              Navigate Munich
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Everything You Need,
              <span className="block text-emerald-400">One Place</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
              Comprehensive guides organized by what matters most to you
            </p>
          </div>

          {/* Categories Grid - Bento Style */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.key}
                title={category.title}
                description={category.description}
                href={`/category/${category.key}`}
                icon={category.icon}
                color={category.color}
                count={guideCountByCategory(category.key) || "New"}
                className={index === 0 ? "sm:col-span-2 lg:col-span-1" : ""}
              />
            ))}
          </div>

          {/* View All Button */}
          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline" className="group border-2 border-white/10 text-white hover:border-emerald-500/50 hover:bg-emerald-500/10">
              <Link href="/guides">
                <BookOpen className="mr-2 h-5 w-5" />
                Browse All Guides
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Community Mission Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-zinc-950 py-24">
        {/* Moroccan Pattern Background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="zellige" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="white" strokeWidth="1"/>
                <path d="M40 20L60 40L40 60L20 40Z" fill="none" stroke="white" strokeWidth="0.5"/>
                <circle cx="40" cy="40" r="5" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#zellige)"/>
          </svg>
        </div>

        {/* Gradient orbs */}
        <div className="absolute -left-32 top-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-emerald-600/10 to-teal-600/10 blur-[100px]" />
        <div className="absolute -right-32 bottom-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-amber-500/10 to-red-600/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left - Visual */}
            <div className="relative">
              <div className="relative aspect-square max-w-lg overflow-hidden rounded-3xl">
                {/* Main gradient background with Moroccan colors */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-amber-500/20 to-green-600/20" />

                {/* Content - Central gathering metaphor */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
                  <div className="relative mb-6">
                    {/* Community circle - people gathering */}
                    <div className="relative">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/50">
                        <span className="text-4xl">🤝</span>
                      </div>
                      {/* Orbiting community members */}
                      <div className="absolute -right-3 -top-3 h-12 w-12 animate-pulse rounded-full bg-gradient-to-br from-amber-500 to-red-600 p-2 shadow-lg">
                        <span className="flex h-full w-full items-center justify-center text-xl">🇲🇦</span>
                      </div>
                      <div className="absolute -bottom-3 -left-3 h-12 w-12 animate-pulse rounded-full bg-gradient-to-br from-green-600 to-emerald-600 p-2 shadow-lg" style={{ animationDelay: '0.5s' }}>
                        <span className="flex h-full w-full items-center justify-center text-xl">🏰</span>
                      </div>
                      <div className="absolute -bottom-1 -right-3 h-10 w-10 animate-pulse rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 p-2 shadow-lg" style={{ animationDelay: '1s' }}>
                        <span className="flex h-full w-full items-center justify-center text-lg">💚</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-center text-3xl font-bold">Built Together</h3>
                  <p className="mt-2 text-center text-lg text-white/80">
                    By the community, for the community
                  </p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -right-4 -top-4 rounded-2xl border border-white/10 bg-zinc-900 p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-500/20 p-2">
                    <span className="text-2xl">🇲🇦</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Moroccan Roots</div>
                    <div className="text-xs text-zinc-500">Authentic guidance</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 rounded-2xl border border-white/10 bg-zinc-900 p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-amber-500/20 p-2">
                    <span className="text-2xl">🏰</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Munich Life</div>
                    <div className="text-xs text-zinc-500">Local expertise</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <Badge className="mb-4 border-amber-500/30 bg-amber-500/10 text-amber-400">
                <Heart className="mr-1.5 h-3.5 w-3.5" />
                Our Story
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Making Munich Feel
                <span className="text-emerald-400"> Like Home</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-400">
                We know the struggle — navigating German bureaucracy, finding halal food, understanding university systems, and feeling a bit lost in a new city. 
              </p>
              <p className="mt-4 text-lg leading-relaxed text-zinc-400">
                That&apos;s why we built <span className="font-semibold text-white">Atlas Munich</span> — a collective knowledge base where every tip, every guide, and every hidden gem comes from people who&apos;ve walked the same path.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-emerald-600 shadow-lg hover:bg-emerald-500">
                  <Link href="/about">
                    <Users className="mr-2 h-5 w-5" />
                    About Our Community
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-white/10 text-white hover:border-emerald-500/50 hover:bg-emerald-500/10">
                  <Link href="/faq">
                    <HelpCircle className="mr-2 h-5 w-5" />
                    Common Questions
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Contribute */}
      <section className="relative overflow-hidden bg-zinc-950 py-24">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-zinc-950 to-teal-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge className="mb-6 border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Open Source
          </Badge>
          
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Help Us Grow This
            <span className="block bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Knowledge Hub
            </span>
          </h2>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Every correction, every new guide, every shared experience helps the next Moroccan arriving in Munich. 
            Your knowledge is valuable — share it with the community.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-14 bg-emerald-600 px-8 text-lg shadow-xl shadow-emerald-500/25 hover:bg-emerald-500">
              <Link
                href="https://github.com/HamzaChx/Atlas-Munich"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Contribute on GitHub
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 border-2 border-zinc-700 px-8 text-lg text-white hover:bg-zinc-800">
              <Link href="/about">
                Learn How
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-zinc-500">
            {[
              { icon: CheckCircle2, text: "100% Free Forever" },
              { icon: Users, text: "Community Driven" },
              { icon: Heart, text: "Made with Love" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <item.icon className="h-5 w-5 text-emerald-500" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
